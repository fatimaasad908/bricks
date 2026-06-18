import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/bricks_auth')
  .then(async () => {
    const resAdmin = await User.updateMany({ email: 'asadfatima93@gmail.com' }, { $set: { role: 'admin' } });
    console.log(`Successfully set asadfatima93@gmail.com to Admin role! (Modified: ${resAdmin.modifiedCount})`);

    const resCust = await User.updateMany({ email: { $ne: 'asadfatima93@gmail.com' } }, { $set: { role: 'customer' } });
    console.log(`Downgraded other accounts to Customer role! (Modified: ${resCust.modifiedCount})`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
