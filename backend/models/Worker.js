import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Contract', 'Daily Wage', 'Permanent']
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'On Leave', 'Inactive']
  },
  attendance: {
    type: String,
    required: true,
    default: '0/26'
  },
  earnings: {
    type: String,
    required: true,
    default: '₨ 0'
  }
}, { timestamps: true });

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
