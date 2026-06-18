import Worker from '../models/Worker.js';

export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorker = async (req, res) => {
  const { workerId, name, email, phone, role, type, status, attendance, earnings } = req.body;
  
  try {
    const existingWorker = await Worker.findOne({ workerId });
    if (existingWorker) {
      return res.status(400).json({ message: 'Worker with this ID already exists' });
    }

    const worker = new Worker({
      workerId, name, email, phone, role, type, status, attendance, earnings
    });

    await worker.save();
    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
