import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  operationalStatus: {
    type: String,
    enum: ['Operational', 'Under Maintenance', 'Broken', 'Retired'],
    default: 'Operational'
  },
  purchaseDate: {
    type: Date
  },
  maintenanceSchedule: {
    type: String
  }
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
