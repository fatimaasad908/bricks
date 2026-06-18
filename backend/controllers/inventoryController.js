import Inventory from '../models/Inventory.js';

export const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    const item = new Inventory(req.body);
    item.availableStock = item.totalStock - item.reservedStock;
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.totalStock !== undefined || body.reservedStock !== undefined) {
      const current = await Inventory.findById(req.params.id);
      const total = body.totalStock !== undefined ? Number(body.totalStock) : current.totalStock;
      const reserved = body.reservedStock !== undefined ? Number(body.reservedStock) : current.reservedStock;
      body.availableStock = total - reserved;
    }
    const item = await Inventory.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Inventory not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Inventory not found' });
    res.json({ message: 'Inventory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
