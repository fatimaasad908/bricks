import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bricks_auth';

const products = [
  {
    productId: 'P-004',
    name: 'Awaal',
    tag: 'STANDARD',
    price: '3000 / 100 unit',
    iconName: 'Box',
    image: '/images/red_brick.png',
    desc: 'Awaal description.',
    specs: {}
  },
  {
    productId: 'P-005',
    name: 'Doem',
    tag: 'REFRACTORY',
    price: '4500 / 100 unit',
    iconName: 'Flame',
    image: '/images/fire_brick.png',
    desc: 'Doem description.',
    specs: {}
  },
  {
    productId: 'P-006',
    name: 'Soem',
    tag: 'NATURAL',
    price: '5000 / 100 unit',
    iconName: 'Layers',
    image: '/images/clay_brick.png',
    desc: 'Soem description.',
    specs: {}
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
