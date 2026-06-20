import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas for make_admin script');
    const resAdmin = await User.updateMany({ email: 'asadfatima93@gmail.com' }, { $set: { role: 'admin' } });
    console.log(`Successfully set asadfatima93@gmail.com to Admin role! (Modified: ${resAdmin.modifiedCount})`);

    const resCust = await User.updateMany({ email: { $ne: 'asadfatima93@gmail.com' } }, { $set: { role: 'customer' } });
    console.log(`Downgraded other accounts to Customer role! (Modified: ${resCust.modifiedCount})`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Atlas connection failed for make_admin script:', err);
    process.exit(1);
  });
