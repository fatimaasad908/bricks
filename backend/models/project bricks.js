import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be greater than 0']
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than 0']
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'In Production', 'Dispatched', 'Delivered', 'Cancelled']
    }
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
