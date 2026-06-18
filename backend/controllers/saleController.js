import Sale from '../models/Sale.js';

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sale) {
      return res.status(404).json({ message: 'Sale order not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale order not found' });
    }
    res.json({ message: 'Sale order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
