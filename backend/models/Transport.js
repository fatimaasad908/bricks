import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  truckId: {
    type: String,
    required: true,
    unique: true
  },
  driverName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On Delivery'],
    default: 'Available'
  },
  assignedOrder: {
    type: String, // Can be Order ID or Client Name
    default: 'None'
  },
  deliveryStatus: {
    type: String,
    default: 'Idle'
  }
}, { timestamps: true });

const Transport = mongoose.model('Transport', transportSchema);
export default Transport;
