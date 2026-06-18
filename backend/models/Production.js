import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    required: true,
    unique: true
  },
  rawMaterial: {
    type: Number,
    required: true,
    min: [0, 'Raw material cannot be negative']
  },
  bricksShaped: {
    type: Number,
    required: true,
    min: [0, 'Bricks shaped cannot be negative']
  },
  bricksFired: {
    type: Number,
    required: true,
    min: [0, 'Bricks fired cannot be negative']
  },
  qcPassed: {
    type: String,
    required: true
  },
  rejectionRate: {
    type: Number,
    required: true,
    min: [0, 'Rejection rate cannot be negative'],
    max: [100, 'Rejection rate cannot exceed 100']
  },
  status: {
    type: String,
    required: true,
    enum: ['FIRING', 'COMPLETED', 'MIXING', 'SHAPING', 'DRYING', 'READY']
  }
}, { timestamps: true });

const Production = mongoose.model('Production', productionSchema);
export default Production;
