import Transport from '../models/Transport.js';
import Truck from '../models/Truck.js';
import Driver from '../models/Driver.js';

export const getTrucks = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { availability_status: status } : {};
    const trucks = await Truck.find(query).sort({ createdAt: -1 });
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTruck = async (req, res) => {
  try {
    const { truckId, truckNumber, availability_status } = req.body;
    const existing = await Truck.findOne({ truckId });
    if (existing) {
      return res.status(400).json({ message: 'Truck ID already exists' });
    }
    const truck = new Truck({ truckId, truckNumber, availability_status });
    await truck.save();
    res.status(201).json(truck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { availability_status: status } : {};
    const drivers = await Driver.find(query).sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { driverId, name, contactNumber, availability_status } = req.body;
    const existing = await Driver.findOne({ driverId });
    if (existing) {
      return res.status(400).json({ message: 'Driver ID already exists' });
    }
    const driver = new Driver({ driverId, name, contactNumber, availability_status });
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransports = async (req, res) => {
  try {
    const transports = await Transport.find().sort({ createdAt: -1 });
    res.json(transports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransport = async (req, res) => {
  try {
    const { truckId, driverName, status, assignedOrder, deliveryStatus } = req.body;
    
    const existing = await Transport.findOne({ truckId });
    if (existing) {
      return res.status(400).json({ message: 'Truck ID already exists' });
    }

    const transport = new Transport({
      truckId, driverName, status, assignedOrder, deliveryStatus
    });

    await transport.save();
    res.status(201).json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json(truck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) return res.status(404).json({ message: 'Truck not found' });
    res.json({ message: 'Truck deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
