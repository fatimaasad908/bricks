import mongoose from 'mongoose';
import process from 'process';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/bricks_auth')
  .then(async () => {
    try {
      console.log('Connected');
      const user = await User.create({
        email: 'test_db_' + Date.now() + '@example.com',
        password: 'password123'
      });
      console.log('User created:', user);
    } catch (err) {
      console.error('Error creating user:', err);
    }
    process.exit(0);
  });
