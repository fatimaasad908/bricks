import SalesOrder from '../models/SalesOrder.js';
import Inventory from '../models/Inventory.js';

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
    const items = await SalesOrder.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalesOrder = async (req, res) => {
  try {
    const existing = await SalesOrder.findOne({ orderNumber: req.body.orderNumber });
    if (existing) {
      return res.status(400).json({ message: 'Order number already exists' });
    }
    const item = new SalesOrder(req.body);
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
    const originalOrder = await SalesOrder.findById(req.params.id);
    if (!originalOrder) return res.status(404).json({ message: 'Sales order not found' });

    const item = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
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
    const item = await SalesOrder.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Sales order not found' });
    res.json({ message: 'Sales order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
