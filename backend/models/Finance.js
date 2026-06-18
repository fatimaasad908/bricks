import mongoose from 'mongoose';

const financeSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Income', 'Expense']
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be greater than 0']
  }
}, { timestamps: true });

const Finance = mongoose.model('Finance', financeSchema);
export default Finance;
