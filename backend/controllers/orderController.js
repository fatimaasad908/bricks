import OrderQuote from '../models/OrderQuote.js';
import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';
import Truck from '../models/Truck.js';
import Driver from '../models/Driver.js';

export const createOrderQuote = async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, product, quantity, location, description, userId, status, orderDate } = req.body;
    
    const orderQuote = new OrderQuote({
      companyName: companyName || 'Manual Order',
      contactPerson,
      email,
      phone: phone || 'N/A',
      product,
      quantity,
      location,
      description,
      isRead: false,
      userId: userId || null,
      status: status || 'Order Placed',
      orderDate: orderDate || new Date(),
      statusHistory: [{ status: status || 'Order Placed', note: 'Order created' }]
    });

    await orderQuote.save();
    res.status(201).json({ message: 'Order created successfully', order: orderQuote });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await OrderQuote.find({ userId: req.user._id })
      .populate('assignedTruck')
      .populate('assignedDriver')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOrderQuotes = async (req, res) => {
  try {
    const quotes = await OrderQuote.find()
      .populate('assignedTruck')
      .populate('assignedDriver')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, totalPrice, statusNotes, estimatedDeliveryDate, assignedVehicle, assignedTruck, assignedDriver, dispatchDate, currentLocation } = req.body;
    
    const order = await OrderQuote.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order quote not found' });
    }

    const previousStatus = order.status;
    let finalStatus = status || previousStatus;

    // Handle assigned Truck status updates
    if (assignedTruck !== undefined) {
      const prevTruckId = order.assignedTruck;
      if (String(prevTruckId) !== String(assignedTruck)) {
        // Free the old truck
        if (prevTruckId) {
          await Truck.findByIdAndUpdate(prevTruckId, { availability_status: 'Available' });
        }
        // Lock the new truck
        if (assignedTruck) {
          await Truck.findByIdAndUpdate(assignedTruck, { availability_status: 'Assigned' });
        }
        order.assignedTruck = assignedTruck || null;
      }
    }

    // Handle assigned Driver status updates
    if (assignedDriver !== undefined) {
      const prevDriverId = order.assignedDriver;
      if (String(prevDriverId) !== String(assignedDriver)) {
        // Free the old driver
        if (prevDriverId) {
          await Driver.findByIdAndUpdate(prevDriverId, { availability_status: 'Available' });
        }
        // Lock the new driver
        if (assignedDriver) {
          await Driver.findByIdAndUpdate(assignedDriver, { availability_status: 'Assigned' });
        }
        order.assignedDriver = assignedDriver || null;
      }
    }

    // Assignment logic: if truck and driver are assigned, default status to 'Driver Assigned'
    if (order.assignedTruck && order.assignedDriver && (finalStatus === 'Pending' || finalStatus === 'Order Placed')) {
      finalStatus = 'Driver Assigned';
    }

    // Free Truck and Driver if status becomes 'Delivered'
    if (finalStatus === 'Delivered') {
      if (order.assignedTruck) {
        await Truck.findByIdAndUpdate(order.assignedTruck, { availability_status: 'Available' });
      }
      if (order.assignedDriver) {
        await Driver.findByIdAndUpdate(order.assignedDriver, { availability_status: 'Available' });
      }
    }

    const isStatusChanged = finalStatus !== previousStatus;

    order.status = finalStatus;
    if (totalPrice !== undefined) order.totalPrice = totalPrice;

    // Sync SalesOrder fields if it is a Direct Sales Order
    if (order.orderNumber) {
      if (finalStatus === 'Delivered') {
        order.deliveryStatus = 'Delivered';
      } else if (['Out for Delivery', 'In Transit', 'Driver Assigned', 'Ready for Delivery'].includes(finalStatus)) {
        order.deliveryStatus = 'Shipped';
      } else if (finalStatus === 'Rejected') {
        order.deliveryStatus = 'Cancelled';
      } else {
        order.deliveryStatus = 'Pending';
      }
      if (totalPrice !== undefined) {
        order.totalAmount = totalPrice;
      }
    }

    if (statusNotes !== undefined) order.statusNotes = statusNotes;
    if (estimatedDeliveryDate !== undefined) order.estimatedDeliveryDate = estimatedDeliveryDate || null;
    if (assignedVehicle !== undefined) order.assignedVehicle = assignedVehicle;
    if (dispatchDate !== undefined) order.dispatchDate = dispatchDate || null;
    if (currentLocation !== undefined) order.currentLocation = currentLocation;

    if (isStatusChanged) {
      order.statusHistory.push({
        status: finalStatus,
        note: statusNotes || `Order status updated to ${finalStatus}`,
        updatedAt: new Date()
      });
    }

    await order.save();

    // Trigger Notifications on status change
    if (isStatusChanged) {
      // Fetch truck/driver info if needed for notification
      const truck = order.assignedTruck ? await Truck.findById(order.assignedTruck) : null;
      const driver = order.assignedDriver ? await Driver.findById(order.assignedDriver) : null;
      const driverName = driver ? driver.name : 'Not Assigned Yet';
      const truckId = truck ? truck.truckId : 'Not Assigned Yet';
      const estDate = order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Scheduled';

      let title = 'Order Status Update';
      let message = `Your order #${order._id.toString().slice(-6).toUpperCase()} status has been updated to "${finalStatus}".`;

      if (finalStatus === 'Driver Assigned') {
        title = 'Delivery Assigned';
        message = `Your delivery has been assigned.\n\nDriver: ${driverName}\nTruck: ${truckId}\nStatus: Driver Assigned\nExpected Delivery: ${estDate}`;
      }

      // 1. In-App Notification
      if (order.userId) {
        try {
          await Notification.create({
            userId: order.userId,
            orderId: order._id,
            title,
            message,
            status: finalStatus
          });
          console.log(`In-app notification created for User ${order.userId} on order status: ${finalStatus}`);
        } catch (err) {
          console.error('Failed to create in-app notification:', err.message);
        }
      }

      // 2. Email Notification
      if (order.email) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const emailSubject = finalStatus === 'Driver Assigned' 
            ? `Delivery Assigned: #${order._id.toString().slice(-6).toUpperCase()}`
            : `Order Status Update: #${order._id.toString().slice(-6).toUpperCase()}`;

          let emailHtml = '';
          if (finalStatus === 'Driver Assigned') {
            emailHtml = `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h2 style="color: #c14618;">Delivery Assigned</h2>
                <p>Hello <strong>${order.contactPerson}</strong>,</p>
                <p>Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been assigned to a driver for delivery.</p>
                <div style="background-color: #fcf8f6; padding: 15px; border-left: 4px solid #c14618; margin: 20px 0; font-size: 15px; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;"><strong>Your delivery has been assigned.</strong></p>
                  <p style="margin: 0 0 5px 0;"><strong>Driver:</strong> ${driverName}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Truck:</strong> ${truckId}</p>
                  <p style="margin: 0 0 5px 0;"><strong>Status:</strong> Driver Assigned</p>
                  <p style="margin: 0;"><strong>Expected Delivery:</strong> ${estDate}</p>
                </div>
                <p>You can track the progress of your materials directly from your profile dashboard.</p>
                <p>Thank you for choosing our company.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                <p style="font-size: 12px; color: #999;">This is an automated notification. Please do not reply to this email.</p>
              </div>
            `;
          } else {
            emailHtml = `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h2 style="color: #c14618;">Order Status Update</h2>
                <p>Hello <strong>${order.contactPerson}</strong>,</p>
                <p>Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been updated.</p>
                <div style="background-color: #fcf8f6; padding: 15px; border-left: 4px solid #c14618; margin: 20px 0;">
                  <p style="margin: 0; font-size: 16px;"><strong>Current Status:</strong> ${finalStatus}</p>
                  ${statusNotes ? `<p style="margin: 5px 0 0 0; color: #555;"><strong>Note:</strong> ${statusNotes}</p>` : ''}
                </div>
                <p>You can track the progress of your materials directly from your profile dashboard.</p>
                <p>Thank you for choosing our company.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                <p style="font-size: 12px; color: #999;">This is an automated notification. Please do not reply to this email.</p>
              </div>
            `;
          }

          await transporter.sendMail({
            from: `"BrickFlow ERP Support" <${process.env.EMAIL_USER || 'no-reply@brickflow.com'}>`,
            to: order.email,
            subject: emailSubject,
            html: emailHtml
          });
          console.log(`Email notification sent to ${order.email}`);
        } catch (err) {
          console.log('Nodemailer not configured or error sending email:', err.message);
        }
      }
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteOrderQuote = async (req, res) => {
  try {
    const order = await OrderQuote.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order quote not found' });
    }
    res.json({ message: 'Order quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadOrdersCount = async (req, res) => {
  try {
    const count = await OrderQuote.countDocuments({ isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markOrdersAsRead = async (req, res) => {
  try {
    await OrderQuote.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
