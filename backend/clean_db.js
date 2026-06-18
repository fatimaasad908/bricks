import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/bricks_auth').then(async () => {
  const res = await User.deleteMany({});
  console.log(`Deleted ${res.deletedCount} users to clean test DB.`);
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
