import PurchaseOrder from '../models/PurchaseOrder.js';

export const getPurchaseOrders = async (req, res) => {
  try {
    const items = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchaseOrder = async (req, res) => {
  try {
    const existing = await PurchaseOrder.findOne({ poNumber: req.body.poNumber });
    if (existing) {
      return res.status(400).json({ message: 'PO Number already exists' });
    }
    const item = new PurchaseOrder(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const item = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Purchase order not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  try {
    const item = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Purchase order not found' });
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
