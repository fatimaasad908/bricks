import mongoose from 'mongoose';

const qualityControlSchema = new mongoose.Schema({
  batchReference: {
    type: String,
    required: true
  },
  strengthTest: {
    type: String
  },
  absorptionRate: {
    type: String
  },
  defectPercentage: {
    type: Number,
    default: 0
  },
  inspectionDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String
  },
  passFailStatus: {
    type: String,
    enum: ['Pass', 'Fail'],
    default: 'Pass'
  }
}, { timestamps: true });

const QualityControl = mongoose.model('QualityControl', qualityControlSchema);
export default QualityControl;
