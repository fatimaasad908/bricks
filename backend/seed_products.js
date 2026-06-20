import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

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

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas for seeding products...');
    await Product.deleteMany(); // Clear existing
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB Atlas connection failed for seed_products script:', err);
    process.exit(1);
  });
