import mongoose from 'mongoose';

const wastageSchema = new mongoose.Schema({
  batch: {
    type: String
  },
  materialOrProduct: {
    type: String,
    required: true
  },
  quantityWasted: {
    type: Number,
    required: true
  },
  reason: {
    type: String
  },
  recordedBy: {
    type: String,
    required: true
  },
  wastageDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Wastage = mongoose.model('Wastage', wastageSchema);
export default Wastage;
