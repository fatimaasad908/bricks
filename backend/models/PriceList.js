import mongoose from 'mongoose';

const priceListSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  retailPrice: {
    type: Number,
    required: true
  },
  wholesalePrice: {
    type: Number,
    required: true
  },
  bulkDiscountRules: {
    type: String
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Scheduled'],
    default: 'Active'
  }
}, { timestamps: true });

const PriceList = mongoose.model('PriceList', priceListSchema);
export default PriceList;
