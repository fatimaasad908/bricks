import mongoose from 'mongoose';

const rawMaterialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  unit: {
    type: String,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 0
  },
  supplier: {
    type: String
  },
  costPerUnit: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);
export default RawMaterial;
