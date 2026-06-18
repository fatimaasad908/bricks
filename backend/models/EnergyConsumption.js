import mongoose from 'mongoose';

const energyConsumptionSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  energyType: {
    type: String,
    required: true,
    enum: ['Electricity', 'Gas', 'Diesel', 'Coal']
  },
  quantityConsumed: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  efficiencyRatio: {
    type: Number
  }
}, { timestamps: true });

const EnergyConsumption = mongoose.model('EnergyConsumption', energyConsumptionSchema);
export default EnergyConsumption;
