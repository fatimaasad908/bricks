import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
}, { timestamps: true });

// Pre-save hook: Hash password and enforce single admin constraint
userSchema.pre('save', async function() {
  // Enforce role constraints
  if (this.email === 'asadfatima93@gmail.com') {
    this.role = 'admin';
  } else {
    this.role = 'customer';
  }

  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Pre-update hooks: prevent modifying or updating user roles to admin
userSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function() {
  const update = this.getUpdate();
  if (update) {
    const isTargetingAdminEmail = this.getQuery() && this.getQuery().email === 'asadfatima93@gmail.com';
    if (!isTargetingAdminEmail) {
      if (update.role) {
        update.role = 'customer';
      }
      if (update.$set && update.$set.role) {
        update.$set.role = 'customer';
      }
    }
  }
});

// Method to verify password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
