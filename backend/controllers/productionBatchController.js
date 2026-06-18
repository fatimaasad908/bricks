import ProductionBatch from '../models/ProductionBatch.js';
import Inventory from '../models/Inventory.js';

// Auto-increase warehouse stocks when production finishes
const updateInventoryOnProduction = async (batch) => {
  try {
    if (batch.completionStatus !== 'Completed') return;
    
    // We assume the batch name or product name. We can map standard Red Bricks or a generic name.
    const productName = 'Standard Clay Brick';
    let inv = await Inventory.findOne({ product: productName });
    if (!inv) {
      inv = new Inventory({ product: productName, totalStock: 0, reservedStock: 0, availableStock: 0, warehouseLocation: 'Zone A' });
    }
    inv.totalStock += batch.quantityProduced;
    inv.availableStock = inv.totalStock - inv.reservedStock;
    await inv.save();
  } catch (err) {
    console.error('Failed to update inventory from production batch:', err);
  }
};

export const getProductionBatches = async (req, res) => {
  try {
    const items = await ProductionBatch.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductionBatch = async (req, res) => {
  try {
    const existing = await ProductionBatch.findOne({ batchNumber: req.body.batchNumber });
    if (existing) {
      return res.status(400).json({ message: 'Batch number already exists' });
    }
    const item = new ProductionBatch(req.body);
    await item.save();

    // Trigger inventory increase hook
    await updateInventoryOnProduction(item);

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProductionBatch = async (req, res) => {
  try {
    const originalBatch = await ProductionBatch.findById(req.params.id);
    if (!originalBatch) return res.status(404).json({ message: 'Production batch not found' });

    const item = await ProductionBatch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    // If status changed to Completed: update inventory
    if (originalBatch.completionStatus !== 'Completed' && item.completionStatus === 'Completed') {
      await updateInventoryOnProduction(item);
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductionBatch = async (req, res) => {
  try {
    const item = await ProductionBatch.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Production batch not found' });
    res.json({ message: 'Production batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
