import OrderQuote from '../models/OrderQuote.js';
import Inventory from '../models/Inventory.js';

// Mapping helper for Sales Order to OrderQuote fields
const mapSalesOrderToOrderQuote = (data) => {
  const quantityNum = Number(data.quantity);
  const totalAmt = Number(data.totalAmount);
  
  const mapped = {
    orderNumber: data.orderNumber,
    customer: data.customer,
    products: data.products,
    quantity: quantityNum,
    totalAmount: totalAmt,
    paymentStatus: data.paymentStatus,
    deliveryStatus: data.deliveryStatus,
    orderDate: data.orderDate || new Date(),
    
    // OrderQuote fields
    companyName: 'Sales Order',
    contactPerson: data.customer,
    email: data.email || 'sales@bricks.com',
    phone: data.phone || 'N/A',
    product: (data.products && data.products[0]?.productName) || 'Standard Clay Brick',
    quantity: String(quantityNum),
    totalPrice: totalAmt,
    status: data.deliveryStatus === 'Pending' ? 'Pending' : 
            data.deliveryStatus === 'Shipped' ? 'Out for Delivery' : 
            data.deliveryStatus === 'Delivered' ? 'Delivered' : 'Rejected',
    isRead: true
  };
  return mapped;
};

// Auto-update inventory stocks when orders are booked
const updateInventoryOnSalesOrder = async (order, isCompleted = false) => {
  try {
    for (const item of order.products || []) {
      let inv = await Inventory.findOne({ product: item.productName });
      if (!inv) {
        inv = new Inventory({ product: item.productName, totalStock: 50000, reservedStock: 0, availableStock: 50000 });
      }
      if (isCompleted) {
        // If order delivered: subtract from total stock and reserved stock
        inv.reservedStock = Math.max(0, inv.reservedStock - item.quantity);
        inv.totalStock = Math.max(0, inv.totalStock - item.quantity);
      } else {
        // If order pending/placed: add to reserved stock
        inv.reservedStock += item.quantity;
      }
      inv.availableStock = Math.max(0, inv.totalStock - inv.reservedStock);
      await inv.save();
    }
  } catch (err) {
    console.error('Failed to update inventory from sales order:', err);
  }
};

export const getSalesOrders = async (req, res) => {
  try {
    const items = await OrderQuote.find({ orderNumber: { $exists: true, $ne: null } }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalesOrder = async (req, res) => {
  try {
    const existing = await OrderQuote.findOne({ orderNumber: req.body.orderNumber });
    if (existing) {
      return res.status(400).json({ message: 'Order number already exists' });
    }
    
    const mappedData = mapSalesOrderToOrderQuote(req.body);
    const item = new OrderQuote(mappedData);
    await item.save();

    // Trigger auto inventory updating hook
    const isCompleted = item.deliveryStatus === 'Delivered';
    await updateInventoryOnSalesOrder(item, isCompleted);

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSalesOrder = async (req, res) => {
  try {
    const originalOrder = await OrderQuote.findById(req.params.id);
    if (!originalOrder) return res.status(404).json({ message: 'Sales order not found' });

    const mappedData = mapSalesOrderToOrderQuote(req.body);

    const item = await OrderQuote.findByIdAndUpdate(req.params.id, mappedData, { new: true, runValidators: true });
    
    // If status changed to Delivered: adjust total stock
    if (originalOrder.deliveryStatus !== 'Delivered' && item.deliveryStatus === 'Delivered') {
      await updateInventoryOnSalesOrder(item, true);
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const item = await OrderQuote.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Sales order not found' });
    res.json({ message: 'Sales order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
