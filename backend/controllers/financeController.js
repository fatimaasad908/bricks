import Finance from '../models/Finance.js';

export const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find().sort({ createdAt: -1 });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFinance = async (req, res) => {
  try {
    const finance = new Finance(req.body);
    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFinance = async (req, res) => {
  try {
    const finance = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!finance) {
      return res.status(404).json({ message: 'Finance transaction not found' });
    }
    res.json(finance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findByIdAndDelete(req.params.id);
    if (!finance) {
      return res.status(404).json({ message: 'Finance transaction not found' });
    }
    res.json({ message: 'Finance transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
