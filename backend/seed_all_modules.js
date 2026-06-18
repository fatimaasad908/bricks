import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models
import RawMaterial from './models/RawMaterial.js';
import Customer from './models/Customer.js';
import SalesOrder from './models/SalesOrder.js';
import ProductionBatch from './models/ProductionBatch.js';
import Employee from './models/Employee.js';
import Equipment from './models/Equipment.js';
import QualityControl from './models/QualityControl.js';
import Inventory from './models/Inventory.js';
import Delivery from './models/Delivery.js';
import Invoice from './models/Invoice.js';
import Expense from './models/Expense.js';
import Maintenance from './models/Maintenance.js';
import PurchaseOrder from './models/PurchaseOrder.js';
import Shift from './models/Shift.js';
import Report from './models/Report.js';
import Wastage from './models/Wastage.js';
import EnergyConsumption from './models/EnergyConsumption.js';
import PriceList from './models/PriceList.js';
import Product from './models/Product.js';
import Truck from './models/Truck.js';
import Driver from './models/Driver.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bricks_auth';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Raw Materials
    await RawMaterial.deleteMany({});
    await RawMaterial.create([
      { materialName: 'High Grade Clay', sku: 'RM-CLAY-01', unit: 'Tons', stockQuantity: 250, reorderLevel: 50, supplier: 'Allied Mining Co.', costPerUnit: 1500, status: 'In Stock' },
      { materialName: 'Fine Silica Sand', sku: 'RM-SAND-02', unit: 'Tons', stockQuantity: 30, reorderLevel: 40, supplier: 'Sindh Sand Ltd.', costPerUnit: 800, status: 'Low Stock' },
      { materialName: 'Crushed Coal', sku: 'RM-COAL-03', unit: 'Tons', stockQuantity: 0, reorderLevel: 20, supplier: 'Quetta Coal Mines', costPerUnit: 12000, status: 'Out of Stock' }
    ]);
    console.log('Seeded Raw Materials');

    // 2. Customers
    await Customer.deleteMany({});
    await Customer.create([
      { customerName: 'Kashif Contractors', phone: '+92 300 1234567', email: 'kashif@contractors.com', address: 'Lahore Cantt, Pakistan', creditLimit: 500000, outstandingBalance: 120000, status: 'Active' },
      { customerName: 'Lahore Construction Group', phone: '+92 321 9876543', email: 'info@lahoreconst.com', address: 'Gulberg III, Lahore', creditLimit: 1000000, outstandingBalance: 0, status: 'Active' },
      { customerName: 'Decon Builders', phone: '+92 312 4567890', email: 'decon@builders.com', address: 'DHA Phase 5, Lahore', creditLimit: 200000, outstandingBalance: 250000, status: 'Suspended' }
    ]);
    console.log('Seeded Customers');

    // 3. Sales Orders
    await SalesOrder.deleteMany({});
    await SalesOrder.create([
      { orderNumber: 'SO-1001', customer: 'Kashif Contractors', products: [{ productName: 'Standard Clay Brick', quantity: 15000, unitPrice: 20 }], quantity: 15000, totalAmount: 300000, paymentStatus: 'Partial', deliveryStatus: 'Pending' },
      { orderNumber: 'SO-1002', customer: 'Lahore Construction Group', products: [{ productName: 'Fly Ash Brick', quantity: 20000, unitPrice: 25 }], quantity: 20000, totalAmount: 500000, paymentStatus: 'Paid', deliveryStatus: 'Delivered' }
    ]);
    console.log('Seeded Sales Orders');

    // 4. Production Batches
    await ProductionBatch.deleteMany({});
    await ProductionBatch.create([
      { batchNumber: 'PB-501', operator: 'Muhammad Ali', quantityProduced: 35000, kilnStatus: 'Firing', completionStatus: 'In Progress' },
      { batchNumber: 'PB-502', operator: 'Sajid Mehmood', quantityProduced: 40000, kilnStatus: 'Cooling', completionStatus: 'Completed' }
    ]);
    console.log('Seeded Production Batches');

    // 5. Employees
    await Employee.deleteMany({});
    await Employee.create([
      { employeeName: 'Kamran Shah', role: 'Plant Supervisor', department: 'Operations', salary: 75000, shift: 'Morning Shift', status: 'Active', contactDetails: '+92 321 1122334' },
      { employeeName: 'Nadeem Abbas', role: 'Kiln Operator', department: 'Operations', salary: 45000, shift: 'Night Shift', status: 'Active', contactDetails: '+92 333 4455667' }
    ]);
    console.log('Seeded Employees');

    // 6. Equipment
    await Equipment.deleteMany({});
    await Equipment.create([
      { equipmentName: 'Clay Extruder A', type: 'Extruder', location: 'Zone A', operationalStatus: 'Operational', purchaseDate: new Date('2024-01-15'), maintenanceSchedule: 'Monthly' },
      { equipmentName: 'Rotary Kiln Structure', type: 'Kiln structure', location: 'Zone B', operationalStatus: 'Operational', purchaseDate: new Date('2023-06-10'), maintenanceSchedule: 'Bi-Annually' },
      { equipmentName: 'Conveyor Belt C', type: 'Conveyor Belt', location: 'Zone A', operationalStatus: 'Under Maintenance', purchaseDate: new Date('2024-11-20'), maintenanceSchedule: 'Weekly' }
    ]);
    console.log('Seeded Equipment');

    // 7. Quality Control
    await QualityControl.deleteMany({});
    await QualityControl.create([
      { batchReference: 'PB-502', strengthTest: '32 MPa', absorptionRate: '7.5%', defectPercentage: 1.2, remarks: 'Compressive strength exceeds grade-A criteria', passFailStatus: 'Pass' },
      { batchReference: 'PB-503', strengthTest: '18 MPa', absorptionRate: '14%', defectPercentage: 6.5, remarks: 'High liquid absorption, micro-cracks present', passFailStatus: 'Fail' }
    ]);
    console.log('Seeded Quality Control');

    // 8. Inventory
    await Inventory.deleteMany({});
    await Inventory.create([
      { product: 'Standard Clay Brick', totalStock: 120000, reservedStock: 15000, availableStock: 105000, warehouseLocation: 'Zone A, Bay 1' },
      { product: 'Fly Ash Brick', totalStock: 80000, reservedStock: 20000, availableStock: 60000, warehouseLocation: 'Zone B, Bay 3' },
      { product: 'Refractory Fire Brick', totalStock: 15000, reservedStock: 0, availableStock: 15000, warehouseLocation: 'Zone A, Bay 4' }
    ]);
    console.log('Seeded Inventory');

    // 9. Deliveries
    await Delivery.deleteMany({});
    await Delivery.create([
      { deliveryNumber: 'DEL-901', driver: 'Sher Khan', vehicle: 'LHR-7762', customerAddress: 'Lahore Cantt, Pakistan', dispatchDate: new Date(), status: 'In Transit' },
      { deliveryNumber: 'DEL-902', driver: 'Zaman Shah', vehicle: 'KHI-9981', customerAddress: 'Gulberg III, Lahore', dispatchDate: new Date(), deliveryDate: new Date(), status: 'Delivered' }
    ]);
    console.log('Seeded Deliveries');

    // 10. Invoices
    await Invoice.deleteMany({});
    await Invoice.create([
      { invoiceNumber: 'INV-1001', customer: 'Kashif Contractors', orderReference: 'SO-1001', subtotal: 300000, tax: 42500, grandTotal: 342500, dueDate: new Date(Date.now() + 7*24*60*60*1000), paymentStatus: 'Unpaid' },
      { invoiceNumber: 'INV-1002', customer: 'Lahore Construction Group', orderReference: 'SO-1002', subtotal: 500000, tax: 85000, grandTotal: 585000, dueDate: new Date(), paymentStatus: 'Paid' }
    ]);
    console.log('Seeded Invoices');

    // 11. Expenses
    await Expense.deleteMany({});
    await Expense.create([
      { category: 'Fuel & Gas', amount: 180000, description: 'Generators diesel fuel refill', expenseDate: new Date(), approvalStatus: 'Approved', approvedBy: 'Admin' },
      { category: 'Raw Materials Purchase', amount: 450000, description: 'High grade clay bulk purchase', expenseDate: new Date(), approvalStatus: 'Pending' }
    ]);
    console.log('Seeded Expenses');

    // 12. Maintenance
    await Maintenance.deleteMany({});
    await Maintenance.create([
      { equipment: 'Conveyor Belt C', maintenanceType: 'Emergency', priority: 'High', assignedTechnician: 'Engr. Sajid Ali', scheduledDate: new Date(), status: 'In Progress' },
      { equipment: 'Clay Mixer A', maintenanceType: 'Routine', priority: 'Medium', assignedTechnician: 'Asif Mehmood', scheduledDate: new Date(), completionDate: new Date(), status: 'Completed' }
    ]);
    console.log('Seeded Maintenance');

    // 13. Purchase Orders
    await PurchaseOrder.deleteMany({});
    await PurchaseOrder.create([
      { poNumber: 'PO-2001', supplier: 'Allied Mining Co.', materials: [{ materialName: 'High Grade Clay', quantity: 150, costPerUnit: 1500 }], quantity: 150, totalAmount: 225000, deliveryStatus: 'Pending' },
      { poNumber: 'PO-2002', supplier: 'Sindh Sand Ltd.', materials: [{ materialName: 'Fine Silica Sand', quantity: 80, costPerUnit: 800 }], quantity: 80, totalAmount: 64000, deliveryStatus: 'Received' }
    ]);
    console.log('Seeded Purchase Orders');

    // 14. Shifts
    await Shift.deleteMany({});
    await Shift.create([
      { shiftName: 'Morning Shift', supervisor: 'Kamran Shah', employeesCount: 18, startTime: '08:00', endTime: '16:00', status: 'Active' },
      { shiftName: 'Night Shift', supervisor: 'Nadeem Abbas', employeesCount: 12, startTime: '00:00', endTime: '08:00', status: 'Active' }
    ]);
    console.log('Seeded Shifts');

    // 15. Reports
    await Report.deleteMany({});
    await Report.create([
      { reportName: 'Q1 Financial Audit Ledger', category: 'Financial', status: 'Published', createdBy: 'System Admin', date: new Date() },
      { reportName: 'Weekly Kiln Yield Log', category: 'Operational', status: 'Draft', createdBy: 'Plant Supervisor', date: new Date() }
    ]);
    console.log('Seeded Reports');

    // 16. Wastage
    await Wastage.deleteMany({});
    await Wastage.create([
      { batch: 'PB-502', materialOrProduct: 'Standard Clay Brick', quantityWasted: 480, reason: 'Over-firing crack defects', recordedBy: 'Quality Inspector', wastageDate: new Date() },
      { batch: 'PB-503', materialOrProduct: 'Fly Ash Brick', quantityWasted: 120, reason: 'Molding shape deformities', recordedBy: 'Plant Supervisor', wastageDate: new Date() }
    ]);
    console.log('Seeded Wastage');

    // 17. Energy Consumption
    await EnergyConsumption.deleteMany({});
    await EnergyConsumption.create([
      { month: '2026-05', energyType: 'Electricity', quantityConsumed: 45000, cost: 280000, efficiencyRatio: 6.2 },
      { month: '2026-05', energyType: 'Gas', quantityConsumed: 12000, cost: 150000, efficiencyRatio: 12.5 },
      { month: '2026-04', energyType: 'Diesel', quantityConsumed: 8000, cost: 320000, efficiencyRatio: 40.0 }
    ]);
    console.log('Seeded Energy Consumption');

    
    // 19. Extended Products Catalog
    await Product.deleteMany({});
    await Product.create([
      { productId: 'BRK-001', name: 'Standard Clay Brick', tag: 'Premium', price: '₨ 25 / Unit', iconName: 'Box', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=400&auto=format&fit=crop', desc: 'Durable, hand-formed standard red clay bricks suited for outer facing load-bearing structures.', specs: { dimensions: '9" x 4.5" x 3"', weight: '3.2 kg', compressiveStrength: '30 MPa', waterAbsorption: '8%' }, sku: 'SKU-CLY-01', dimensions: '9" x 4.5" x 3"', weight: '3.2 kg', color: 'Terracotta Red', category: 'Clay Bricks', unitPrice: 25, wholesalePrice: 20, stockStatus: 'In Stock' },
      { productId: 'BRK-002', name: 'Fly Ash Brick', tag: 'Eco Friendly', price: '₨ 30 / Unit', iconName: 'Activity', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop', desc: 'Environmentally sustainable fly ash brick with extreme uniform sizing and dimensional stability.', specs: { dimensions: '9" x 4" x 3"', weight: '2.8 kg', compressiveStrength: '25 MPa', waterAbsorption: '12%' }, sku: 'SKU-ASH-02', dimensions: '9" x 4" x 3"', weight: '2.8 kg', color: 'Cement Gray', category: 'Fly Ash Bricks', unitPrice: 30, wholesalePrice: 24, stockStatus: 'In Stock' }
    ]);
    console.log('Seeded Extended Products Catalog');

    // 20. Trucks
    await Truck.deleteMany({});
    await Truck.create([
      { truckId: 'T001', truckNumber: 'LHR-1122', availability_status: 'Available' },
      { truckId: 'T002', truckNumber: 'LHR-3344', availability_status: 'Available' },
      { truckId: 'T003', truckNumber: 'LHR-5566', availability_status: 'Available' },
      { truckId: 'T004', truckNumber: 'LHR-7788', availability_status: 'Available' },
      { truckId: 'T005', truckNumber: 'LHR-9900', availability_status: 'Available' }
    ]);
    console.log('Seeded Trucks');

    // 21. Drivers
    await Driver.deleteMany({});
    await Driver.create([
      { driverId: 'D001', name: 'Ali Khan', contactNumber: '+92 300 1111111', availability_status: 'Available' },
      { driverId: 'D002', name: 'Ahmed Khan', contactNumber: '+92 300 2222222', availability_status: 'Available' },
      { driverId: 'D003', name: 'Sajid Shah', contactNumber: '+92 300 3333333', availability_status: 'Available' },
      { driverId: 'D004', name: 'Sher Khan', contactNumber: '+92 300 4444444', availability_status: 'Available' },
      { driverId: 'D005', name: 'Zaman Shah', contactNumber: '+92 300 5555555', availability_status: 'Available' }
    ]);
    console.log('Seeded Drivers');

    console.log('All 21 modules seeded successfully!');
    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

seed();
