import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bricks_auth';

const products = [
  {
    productId: 'P-001',
    name: 'Awaal (First Class)',
    tag: 'STANDARD',
    price: '16000 / 1000 unit',
    iconName: 'Box',
    image: '/src/assets/first.png',
    desc: 'Premium quality bricks with high strength, smooth finish, and excellent durability.',
    specs: {
      dimensions: '9" x 4.5" x 3"', weight: '3.2 kg'
    }
  },
  {
    productId: 'P-002',
    name: 'Doem (Second Class)',
    tag: 'NATURAL',
    price: '13000 / 1000 unit',
    iconName: 'Box',
    image: '/src/assets/second.png',
    desc: 'Good quality bricks suitable for general construction at an economical cost.',
    specs: {
      dimensions: '9" x 4.5" x 3"', weight: '3.0 kg'
    }
  },
  {
    productId: 'P-003',
    name: 'Soem (Third Class)',
    tag: 'NATURAL',
    price: '10000 / 1000 unit',
    iconName: 'Box',
    image: '/src/assets/third.png',
    desc: 'Basic quality bricks ideal for temporary structures and low-cost projects.',
    specs: {
      dimensions: '9" x 4.5" x 3"', weight: '2.8 kg'
    }
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Product.deleteMany(); // Clear existing
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
