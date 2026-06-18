import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplier: {
    type: String,
    required: true
  },
  materials: [{
    materialName: String,
    quantity: Number,
    costPerUnit: Number
  }],
  quantity: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Received', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
export default PurchaseOrder;
