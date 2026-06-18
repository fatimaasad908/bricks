import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/* Auth Context & Protection */
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

/* Public Pages */
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs';
import HowItsMade from './pages/HowItsMade';
import ContactUs from './pages/ContactUs';
import OrderOnline from './pages/OrderOnline';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';

/* Admin Pages */
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminWorkers from './pages/admin/Workers';
import AdminProduction from './pages/admin/Production';
import AdminSuppliers from './pages/admin/Suppliers';
import AdminTransport from './pages/admin/Transport';
import AdminFinance from './pages/admin/Finance';
import AdminSales from './pages/admin/Sales';
import AdminOrders from './pages/admin/Orders';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

// New Admin Pages
import AdminRawMaterials from './pages/admin/RawMaterials';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';
import AdminSalesOrders from './pages/admin/SalesOrders';
import AdminProductionBatches from './pages/admin/ProductionBatches';
import AdminEmployees from './pages/admin/Employees';
import AdminEquipment from './pages/admin/Equipment';
import AdminQualityControl from './pages/admin/QualityControl';
import AdminInventory from './pages/admin/Inventory';
import AdminDeliveries from './pages/admin/Deliveries';
import AdminInvoices from './pages/admin/Invoices';
import AdminExpenses from './pages/admin/Expenses';
import AdminMaintenance from './pages/admin/Maintenance';
import AdminPurchaseOrders from './pages/admin/PurchaseOrders';
import AdminShifts from './pages/admin/Shifts';
import AdminWastage from './pages/admin/Wastage';
import AdminEnergyConsumption from './pages/admin/EnergyConsumption';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="products" element={<Products />} />
            <Route path="how-it-works" element={<HowItsMade />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="order" element={<OrderOnline />} />
          </Route>
          
          {/* Auth / Individual Entry */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="workers" element={<AdminWorkers />} />
              <Route path="production" element={<AdminProduction />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="transport" element={<AdminTransport />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="sales" element={<AdminSales />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              
              {/* New Admin Pages routes */}
              <Route path="raw-materials" element={<AdminRawMaterials />} />
              <Route path="products-admin" element={<AdminProducts />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="sales-orders" element={<AdminSalesOrders />} />
              <Route path="production-batches" element={<AdminProductionBatches />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="equipment" element={<AdminEquipment />} />
              <Route path="quality-control" element={<AdminQualityControl />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="deliveries" element={<AdminDeliveries />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="expenses" element={<AdminExpenses />} />
              <Route path="maintenance" element={<AdminMaintenance />} />
              <Route path="purchase-orders" element={<AdminPurchaseOrders />} />
              <Route path="shift-management" element={<AdminShifts />} />
              <Route path="wastage" element={<AdminWastage />} />
              <Route path="energy-consumption" element={<AdminEnergyConsumption />} />
            
            </Route>
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
