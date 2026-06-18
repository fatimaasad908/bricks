import Report from '../models/Report.js';

export const getReports = async (req, res) => {
  try {
    const items = await Report.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const item = new Report(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const item = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Report not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const item = await Report.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
