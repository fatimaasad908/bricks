import Shift from '../models/Shift.js';

export const getShifts = async (req, res) => {
  try {
    const items = await Shift.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShift = async (req, res) => {
  try {
    const item = new Shift(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    const item = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Shift not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    const item = await Shift.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Shift not found' });
    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
