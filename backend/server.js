import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import productionRoutes from './routes/productionRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// New Imports
import rawMaterialRoutes from './routes/rawMaterialRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import salesOrderRoutes from './routes/salesOrderRoutes.js';
import productionBatchRoutes from './routes/productionBatchRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import qualityControlRoutes from './routes/qualityControlRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import wastageRoutes from './routes/wastageRoutes.js';
import energyConsumptionRoutes from './routes/energyConsumptionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { protect, admin } from './middleware/authMiddleware.js';
import path from 'path';
import User from './models/User.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bricks_auth';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed default admin if no authorized admin exists
    try {
      const adminExists = await User.findOne({ email: 'asadfatima93@gmail.com' });
      if (!adminExists) {
        await User.create({
          email: 'asadfatima93@gmail.com',
          password: 'admin123',
          role: 'admin',
          isVerified: true
        });
        console.log('Default authorized admin account created: asadfatima93@gmail.com / admin123');
      }
    } catch (seedErr) {
      console.error('Error seeding default admin:', seedErr.message);
    }

    // Convert any other accounts having role = "admin" to role = "customer"
    try {
      const updateRes = await User.updateMany(
        { email: { $ne: 'asadfatima93@gmail.com' }, role: 'admin' },
        { $set: { role: 'customer' } }
      );
      if (updateRes.modifiedCount > 0) {
        console.log(`Converted ${updateRes.modifiedCount} unauthorized admin accounts to customer role.`);
      }
    } catch (updateErr) {
      console.error('Error converting unauthorized admin accounts:', updateErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', protect, admin, workerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', protect, admin, supplierRoutes);
app.use('/api/production', protect, admin, productionRoutes);
app.use('/api/finance', protect, admin, financeRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/dashboard', protect, admin, dashboardRoutes);

// New Routes
app.use('/api/raw-materials', protect, admin, rawMaterialRoutes);
app.use('/api/customers', protect, admin, customerRoutes);
app.use('/api/sales-orders', protect, admin, salesOrderRoutes);
app.use('/api/production-batches', protect, admin, productionBatchRoutes);
app.use('/api/employees', protect, admin, employeeRoutes);
app.use('/api/equipment', protect, admin, equipmentRoutes);
app.use('/api/quality-control', protect, admin, qualityControlRoutes);
app.use('/api/inventory', protect, admin, inventoryRoutes);
app.use('/api/deliveries', protect, admin, deliveryRoutes);
app.use('/api/invoices', protect, admin, invoiceRoutes);
app.use('/api/expenses', protect, admin, expenseRoutes);
app.use('/api/maintenance', protect, admin, maintenanceRoutes);
app.use('/api/purchase-orders', protect, admin, purchaseOrderRoutes);
app.use('/api/shift-management', protect, admin, shiftRoutes);
app.use('/api/reports', protect, admin, reportRoutes);
app.use('/api/wastage', protect, admin, wastageRoutes);
app.use('/api/energy-consumption', protect, admin, energyConsumptionRoutes);
app.use('/api/notifications', protect, admin, notificationRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});
