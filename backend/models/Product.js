import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  tag: {
    type: String,
  },
  price: {
    type: String,
    required: true
  },
  iconName: {
    type: String, // Store lucide-react icon name as string e.g. 'ShieldCheck'
  },
  image: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  specs: {
    type: Map,
    of: String // Used to store key-value pairs for technical specs dynamically
  },
  sku: {
    type: String
  },
  dimensions: {
    type: String
  },
  weight: {
    type: String
  },
  color: {
    type: String
  },
  category: {
    type: String
  },
  unitPrice: {
    type: Number
  },
  wholesalePrice: {
    type: Number
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
