import mongoose from 'mongoose';
import process from 'process';
import User from './models/User.js';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    try {
      console.log('Successfully connected to MongoDB Atlas for test_db script');
      const user = await User.create({
        email: 'test_db_' + Date.now() + '@example.com',
        password: 'password123'
      });
      console.log('User created:', user);
    } catch (err) {
      console.error('Error creating user:', err);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Atlas connection failed for test_db script:', err);
    process.exit(1);
  });
