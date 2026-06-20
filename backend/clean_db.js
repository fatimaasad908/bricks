import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Successfully connected to MongoDB Atlas for clean_db script");

    const res = await User.deleteMany({});
    console.log(`Deleted ${res.deletedCount} users to clean database.`);

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((e) => {
    console.error("MongoDB connection failed for clean_db script:", e);
    process.exit(1);
  });