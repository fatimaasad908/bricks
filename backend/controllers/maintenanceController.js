import Maintenance from '../models/Maintenance.js';

export const getMaintenanceRecords = async (req, res) => {
  try {
    const items = await Maintenance.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMaintenanceRecord = async (req, res) => {
  try {
    const item = new Maintenance(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMaintenanceRecord = async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const item = await Maintenance.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
