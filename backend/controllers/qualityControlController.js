import QualityControl from '../models/QualityControl.js';

export const getQualityControlRecords = async (req, res) => {
  try {
    const items = await QualityControl.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQualityControlRecord = async (req, res) => {
  try {
    const item = new QualityControl(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQualityControlRecord = async (req, res) => {
  try {
    const item = await QualityControl.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'QC record not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQualityControlRecord = async (req, res) => {
  try {
    const item = await QualityControl.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'QC record not found' });
    res.json({ message: 'QC record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
