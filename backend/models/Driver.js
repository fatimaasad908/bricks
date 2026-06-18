import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  availability_status: {
    type: String,
    required: true,
    enum: ['Available', 'Assigned', 'On Delivery', 'Unavailable'],
    default: 'Available'
  }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
