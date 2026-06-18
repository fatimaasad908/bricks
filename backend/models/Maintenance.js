import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  equipment: {
    type: String,
    required: true
  },
  maintenanceType: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  assignedTechnician: {
    type: String
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, { timestamps: true });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
