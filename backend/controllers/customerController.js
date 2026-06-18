import Customer from '../models/Customer.js';
import User from '../models/User.js';

export const getCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' });
    for (const user of users) {
      if (user.email) {
        const existing = await Customer.findOne({ email: user.email });
        if (!existing) {
          await Customer.create({
            customerName: user.name || 'Valued Customer',
            phone: user.phone || 'N/A',
            email: user.email,
            address: user.address || '',
            creditLimit: 0,
            outstandingBalance: 0,
            status: 'Active'
          });
        }
      }
    }

    const items = await Customer.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const item = new Customer(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const item = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Customer not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const item = await Customer.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
