import mongoose from 'mongoose';

const productionBatchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  productionDate: {
    type: Date,
    default: Date.now
  },
  operator: {
    type: String,
    required: true
  },
  quantityProduced: {
    type: Number,
    required: true
  },
  kilnStatus: {
    type: String,
    enum: ['Loading', 'Firing', 'Cooling', 'Empty'],
    default: 'Loading'
  },
  completionStatus: {
    type: String,
    enum: ['In Progress', 'Completed', 'Failed'],
    default: 'In Progress'
  }
}, { timestamps: true });

const ProductionBatch = mongoose.model('ProductionBatch', productionBatchSchema);
export default ProductionBatch;
