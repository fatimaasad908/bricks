import Delivery from '../models/Delivery.js';

export const getDeliveries = async (req, res) => {
  try {
    const items = await Delivery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDelivery = async (req, res) => {
  try {
    const existing = await Delivery.findOne({ deliveryNumber: req.body.deliveryNumber });
    if (existing) {
      return res.status(400).json({ message: 'Delivery number already exists' });
    }
    const item = new Delivery(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDelivery = async (req, res) => {
  try {
    const item = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Delivery not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDelivery = async (req, res) => {
  try {
    const item = await Delivery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
