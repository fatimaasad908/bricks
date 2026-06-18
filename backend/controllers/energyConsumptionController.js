import EnergyConsumption from '../models/EnergyConsumption.js';

export const getEnergyConsumptions = async (req, res) => {
  try {
    const items = await EnergyConsumption.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEnergyConsumption = async (req, res) => {
  try {
    const item = new EnergyConsumption(req.body);
    // Simple efficiency: cost / quantity consumed
    if (item.quantityConsumed > 0) {
      item.efficiencyRatio = Number((item.cost / item.quantityConsumed).toFixed(2));
    }
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEnergyConsumption = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.cost !== undefined || body.quantityConsumed !== undefined) {
      const current = await EnergyConsumption.findById(req.params.id);
      const cost = body.cost !== undefined ? Number(body.cost) : current.cost;
      const qty = body.quantityConsumed !== undefined ? Number(body.quantityConsumed) : current.quantityConsumed;
      if (qty > 0) {
        body.efficiencyRatio = Number((cost / qty).toFixed(2));
      }
    }
    const item = await EnergyConsumption.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Energy log not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEnergyConsumption = async (req, res) => {
  try {
    const item = await EnergyConsumption.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Energy log not found' });
    res.json({ message: 'Energy log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
