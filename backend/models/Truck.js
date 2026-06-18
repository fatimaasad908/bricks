import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
  truckId: {
    type: String,
    required: true,
    unique: true
  },
  truckNumber: {
    type: String,
    required: true,
    unique: true
  },
  availability_status: {
    type: String,
    required: true,
    enum: ['Available', 'Assigned', 'On Delivery', 'Unavailable'],
    default: 'Available'
  }
}, { timestamps: true });

const Truck = mongoose.model('Truck', truckSchema);
export default Truck;
