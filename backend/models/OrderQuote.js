import mongoose from 'mongoose';

const orderQuoteSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for guest checkouts if any
  },
  status: {
    type: String,
    default: 'Order Placed',
    enum: [
      'Order Placed',
      'Order Confirmed',
      'Raw Material Allocated',
      'Production Started',
      'Bricks Under Manufacturing',
      'Quality Check Completed',
      'Ready for Delivery',
      'Out for Delivery',
      'Delivered',
      'Pending',
      'Reviewed',
      'Quoted',
      'Processing',
      'Rejected',
      'Driver Assigned',
      'In Transit',
      'Reached Site',
      'Pending Assignment'
    ]
  },
  statusNotes: {
    type: String,
    default: ''
  },
  estimatedDeliveryDate: {
    type: Date
  },
  assignedVehicle: {
    type: String,
    default: ''
  },
  assignedTruck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    default: null
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  dispatchDate: {
    type: Date,
    default: null
  },
  currentLocation: {
    type: String,
    default: ''
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      note: { type: String, default: '' },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  },
  isRead: {
    type: Boolean,
    default: false
  },
  orderNumber: {
    type: String,
    sparse: true,
    unique: true
  },
  customer: {
    type: String
  },
  products: [{
    productName: String,
    quantity: Number,
    unitPrice: Number
  }],
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const OrderQuote = mongoose.model('OrderQuote', orderQuoteSchema);
export default OrderQuote;
