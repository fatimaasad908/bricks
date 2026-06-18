import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  shift: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Terminated'],
    default: 'Active'
  },
  contactDetails: {
    type: String
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
