import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  shiftName: {
    type: String,
    required: true
  },
  supervisor: {
    type: String,
    required: true
  },
  employeesCount: {
    type: Number,
    default: 0
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

const Shift = mongoose.model('Shift', shiftSchema);
export default Shift;
