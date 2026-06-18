import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  totalStock: {
    type: Number,
    default: 0
  },
  reservedStock: {
    type: Number,
    default: 0
  },
  availableStock: {
    type: Number,
    default: 0
  },
  warehouseLocation: {
    type: String
  }
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
