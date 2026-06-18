import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  deliveryNumber: {
    type: String,
    required: true,
    unique: true
  },
  driver: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  dispatchDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Failed'],
    default: 'Pending'
  }
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
