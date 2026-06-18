import Invoice from '../models/Invoice.js';

export const getInvoices = async (req, res) => {
  try {
    const items = await Invoice.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const existing = await Invoice.findOne({ invoiceNumber: req.body.invoiceNumber });
    if (existing) {
      return res.status(400).json({ message: 'Invoice number already exists' });
    }
    const item = new Invoice(req.body);
    item.grandTotal = Number(item.subtotal) + (Number(item.tax) || 0);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.subtotal !== undefined || body.tax !== undefined) {
      const current = await Invoice.findById(req.params.id);
      const sub = body.subtotal !== undefined ? Number(body.subtotal) : current.subtotal;
      const tax = body.tax !== undefined ? Number(body.tax) : current.tax;
      body.grandTotal = sub + tax;
    }
    const item = await Invoice.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Invoice not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const item = await Invoice.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
