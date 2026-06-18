import Wastage from '../models/Wastage.js';

export const getWastageRecords = async (req, res) => {
  try {
    const items = await Wastage.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWastageRecord = async (req, res) => {
  try {
    const item = new Wastage(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWastageRecord = async (req, res) => {
  try {
    const item = await Wastage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Wastage record not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWastageRecord = async (req, res) => {
  try {
    const item = await Wastage.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Wastage record not found' });
    res.json({ message: 'Wastage record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
