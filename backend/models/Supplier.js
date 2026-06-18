import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  vendorName: { type: String, required: true },
  supplierId: { type: String },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  primaryCategory: { 
    type: String, 
    required: true,
    enum: ['River Sand', 'Industrial Coal', 'Clay', 'Transport Services', 'Other']
  },
  supplyType: {
    type: String,
    required: true,
    enum: ['Raw Material', 'Transport', 'Equipment', 'Other']
  },
  qualityRating: { type: Number, min: 1, max: 5 },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Pending', 'Blocked']
  },
  lastDeliveryDate: { type: String },
  deliveryFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'On Demand']
  },
  notes: { type: String }
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
