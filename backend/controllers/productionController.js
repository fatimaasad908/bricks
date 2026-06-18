import Production from '../models/Production.js';

export const getProductions = async (req, res) => {
  try {
    const productions = await Production.find().sort({ createdAt: -1 });
    res.json(productions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduction = async (req, res) => {
  try {
    const production = new Production(req.body);
    await production.save();
    res.status(201).json(production);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduction = async (req, res) => {
  try {
    const production = await Production.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    res.json(production);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduction = async (req, res) => {
  try {
    const production = await Production.findByIdAndDelete(req.params.id);
    if (!production) {
      return res.status(404).json({ message: 'Production record not found' });
    }
    res.json({ message: 'Production record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
