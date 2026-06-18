import RawMaterial from '../models/RawMaterial.js';

export const getRawMaterials = async (req, res) => {
  try {
    const items = await RawMaterial.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRawMaterial = async (req, res) => {
  try {
    // Check if sku already exists
    const existing = await RawMaterial.findOne({ sku: req.body.sku });
    if (existing) {
      return res.status(400).json({ message: 'Raw material SKU already exists' });
    }
    const item = new RawMaterial(req.body);
    // Auto status determination
    if (item.stockQuantity <= 0) {
      item.status = 'Out of Stock';
    } else if (item.stockQuantity <= item.reorderLevel) {
      item.status = 'Low Stock';
    } else {
      item.status = 'In Stock';
    }
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRawMaterial = async (req, res) => {
  try {
    // Auto status check
    const body = { ...req.body };
    if (body.stockQuantity !== undefined && body.reorderLevel !== undefined) {
      if (Number(body.stockQuantity) <= 0) {
        body.status = 'Out of Stock';
      } else if (Number(body.stockQuantity) <= Number(body.reorderLevel)) {
        body.status = 'Low Stock';
      } else {
        body.status = 'In Stock';
      }
    }
    const item = await RawMaterial.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Raw material not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRawMaterial = async (req, res) => {
  try {
    const item = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Raw material not found' });
    res.json({ message: 'Raw material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
