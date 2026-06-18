import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  Truck, 
  Users, 
  Settings, 
  Files, 
  LineChart, 
  DollarSign, 
  ShoppingCart,
  Search,
  Bell,
  Plus,
  Boxes,
  Package,
  UserCheck,
  ClipboardList,
  Grid,
  Contact,
  Wrench,
  ShieldCheck,
  Archive,
  MapPin,
  Receipt,
  Wallet,
  Hammer,
  ShoppingBag,
  Calendar,
  BarChart3,
  Trash2,
  Zap,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await apiFetch('/orders/unread');
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error('Failed to fetch unread orders:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    if (unreadCount === 0) {
      navigate('/admin/orders');
      return;
    }
    try {
      await apiFetch('/orders/mark-read', { method: 'PUT' });
      setUnreadCount(0);
      navigate('/admin/orders');
    } catch (error) {
      console.error('Failed to mark orders as read:', error);
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Transport', href: '/admin/transport', icon: Truck },
    { name: 'Production', href: '/admin/production', icon: Building2 },
    { name: 'Workers', href: '/admin/workers', icon: Users },
    { name: 'Suppliers', href: '/admin/suppliers', icon: Files },
    { name: 'Finance', href: '/admin/finance', icon: DollarSign },
    { name: 'Sales', href: '/admin/sales', icon: LineChart },
  
    // New modules
    { name: 'Raw Materials', href: '/admin/raw-materials', icon: Boxes },
    { name: 'Products Catalog', href: '/admin/products-admin', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: UserCheck },
    { name: 'Sales Orders', href: '/admin/sales-orders', icon: ClipboardList },
    { name: 'Production Batches', href: '/admin/production-batches', icon: Grid },
    { name: 'Employees', href: '/admin/employees', icon: Contact },
    { name: 'Equipment', href: '/admin/equipment', icon: Wrench },
    { name: 'Quality Control', href: '/admin/quality-control', icon: ShieldCheck },
    { name: 'Inventory', href: '/admin/inventory', icon: Archive },
    { name: 'Deliveries', href: '/admin/deliveries', icon: MapPin },
    { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
    { name: 'Expenses', href: '/admin/expenses', icon: Wallet },
    { name: 'Maintenance', href: '/admin/maintenance', icon: Hammer },
    { name: 'Purchase Orders', href: '/admin/purchase-orders', icon: ShoppingBag },
    { name: 'Shift Management', href: '/admin/shift-management', icon: Calendar },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Wastage', href: '/admin/wastage', icon: Trash2 },
    { name: 'Energy Consumption', href: '/admin/energy-consumption', icon: Zap },
  
     { name: 'Settings', href: '/admin/settings', icon: Settings }
    
  ];


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-[13px]">
      
      {/* Sidebar - BrickFlow styled */}
      <div 
        className={`bg-white border-r border-gray-100 transition-all duration-300 flex flex-col z-20 shadow-sm
        ${isSidebarOpen ? 'w-[240px]' : 'w-[80px]'}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 gap-3">
          <div className="bg-terracotta-600 rounded-lg p-2 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-base text-brown-900 leading-tight">BrickFlow</span>
              <span className="text-[10px] text-terracotta-600 font-medium tracking-wide uppercase">Manufacturing Pro</span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-terracotta-600 text-white shadow-sm shadow-terracotta-600/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-brown-900'
                  }`}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-terracotta-500'}`} 
                />
                {isSidebarOpen && (
                  <span className="font-medium tracking-tight whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="font-bold text-red-600 text-sm tracking-tighter">Exit</span>
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="font-semibold text-sm text-brown-900 truncate">{user?.email?.split('@')[0] || 'Admin'}</span>
                <span className="text-xs text-red-600 font-bold truncate">Logout</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 relative z-10 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.05)]">
          
          <div className="flex items-center">
             <h1 className="text-xl font-bold text-brown-900">
                {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Dashboard'}
             </h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Omni-Search */}
            <div className="relative group w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-terracotta-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search data..."
                className="block w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 focus:bg-white transition-all"
              />
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <button 
              onClick={handleMarkRead}
              className="relative p-2 text-gray-400 hover:text-terracotta-600 transition-colors bg-gray-50 rounded-lg hover:bg-terracotta-50"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsNewEntryOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-terracotta-600/20"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8 scrollbar-hide relative">
          <Outlet />
        </main>
      </div>

      {/* New Entry Modal */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">Quick New Entry</h3>
              <button onClick={() => setIsNewEntryOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Entry saved!'); setIsNewEntryOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Enter title" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                  <option>Worker</option>
                  <option>Product</option>
                  <option>Supplier</option>
                  <option>Order</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Details</label>
                <textarea rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none resize-none" placeholder="Enter details..."></textarea>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsNewEntryOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="bg-terracotta-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-terracotta-700 transition-colors">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
