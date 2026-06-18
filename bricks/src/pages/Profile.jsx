import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Package, Clock, CheckCircle, ChevronRight, Edit, X, 
  MapPin, Truck, Calendar, ChevronDown, ChevronUp, Info, ShieldAlert 
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUserInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const data = await apiFetch('/orders/my-orders');
        setOrders(data);
        // Expand the first order by default if available
        if (data && data.length > 0) {
          setExpandedOrderId(data[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
    
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updatedUser = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address
        })
      });
      
      updateUserInfo(updatedUser); 
      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Driver Assigned': return <User className="w-5 h-5 text-yellow-500" />;
      case 'In Transit': case 'Out for Delivery': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Reached Site': return <MapPin className="w-5 h-5 text-orange-500" />;
      case 'Pending': case 'Pending Assignment': return <Clock className="w-5 h-5 text-gray-400 animate-pulse" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Driver Assigned': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'In Transit': case 'Out for Delivery': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Reached Site': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Pending': case 'Pending Assignment': return 'bg-gray-50 text-gray-700 border-gray-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getTimelineStep = (status) => {
    switch (status) {
      case 'Delivered': return 4;
      case 'Reached Site': return 3;
      case 'In Transit': case 'Out for Delivery': return 2;
      case 'Driver Assigned': return 1;
      default: return 0; // Pending or pending assignment
    }
  };

  const timelineSteps = [
    { label: 'Pending', desc: 'Order received & confirmed' },
    { label: 'Driver Assigned', desc: 'Fleet and driver booked' },
    { label: 'In Transit', desc: 'Materials on the road' },
    { label: 'Reached Site', desc: 'Arrived at delivery location' },
    { label: 'Delivered', desc: 'Materials unloaded successfully' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 text-center relative overflow-hidden"
            >
              <button 
                onClick={() => setShowEditModal(true)}
                className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-terracotta-600 transition-all"
              >
                <Edit className="w-4 h-4" />
              </button>

              <div className="w-24 h-24 bg-terracotta-100 rounded-full flex items-center justify-center text-terracotta-600 mx-auto mb-6 text-3xl font-bold border-4 border-white shadow-inner">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-brown-900 mb-1">{profileData.name || 'Set Name'}</h2>
              <p className="text-gray-500 mb-8">{user?.role === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
              
              <div className="space-y-4 text-left border-t border-gray-50 pt-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Customer Profile Information</h4>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Mail className="w-4 h-4 text-terracotta-500 shrink-0" />
                  <span className="text-xs truncate font-medium">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Phone className="w-4 h-4 text-terracotta-500 shrink-0" />
                  <span className="text-xs font-medium">{profileData.phone || 'Add phone number'}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-terracotta-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium leading-relaxed">{profileData.address || 'Add shipping address'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Calendar className="w-4 h-4 text-terracotta-500 shrink-0" />
                  <span className="text-xs font-medium">Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </motion.div>

            <div className="bg-brown-900 p-8 rounded-[2rem] shadow-xl text-white">
              <h3 className="font-bold mb-4">Account Status</h3>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-400 tracking-wide uppercase">Verified Member</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Thank you for being a part of BrickFlow. Your account is active and verified.</p>
            </div>
          </div>

          {/* Main Content - Order History */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-end mb-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
            >
              <div>
                <h1 className="text-3xl font-bold text-brown-900 tracking-tight">Order Tracking</h1>
                <p className="text-gray-500 text-sm mt-1">Real-time status of your materials and logistics.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Total Orders</span>
                <p className="text-3xl font-black text-terracotta-600">{orders.length}</p>
              </div>
            </motion.div>

            <div className="space-y-6">
              {loading ? (
                <div className="bg-white p-12 rounded-[2rem] text-center text-gray-400 border border-gray-100 shadow-sm">
                  Loading order history...
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] text-center border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-brown-900 mb-2">No Orders Found</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">You haven't placed any orders yet. Once you place an order, it will appear here.</p>
                  <a href="/products" className="inline-flex items-center gap-2 bg-terracotta-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-terracotta-700 transition-all shadow-lg shadow-terracotta-600/20">
                    Explore Catalog
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                orders.map((order, idx) => {
                  const isExpanded = expandedOrderId === order._id;
                  const currentStep = getTimelineStep(order.status);
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={order._id}
                      className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                    >
                      {/* Accordion Trigger */}
                      <div 
                        onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                        className="p-6 md:p-8 flex justify-between items-center cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`p-4 rounded-2xl border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: #{order._id.slice(-6).toUpperCase()}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                            </div>
                            <h3 className="font-bold text-brown-900 text-lg leading-tight">{order.product}</h3>
                            <p className="text-sm font-bold text-terracotta-600 mt-1">{order.quantity} Units</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="hidden md:flex flex-col items-end gap-1.5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wider border uppercase ${getStatusColor(order.status)}`}>
                              {order.status === 'Pending' && !order.assignedDriver ? 'Pending Assignment' : order.status}
                            </span>
                            <p className="text-lg font-black text-brown-900">
                              Rs. {order.totalPrice?.toLocaleString() || '0'}
                            </p>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>

                      {/* Accordion Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-50 bg-gray-50/20"
                          >
                            <div className="p-6 md:p-8 space-y-8">
                              
                              {/* Detailed tracking header */}
                              <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-12 text-sm">
                                
                                {/* Order specifications */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Order Details</h4>
                                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 font-medium">Project Name:</span>
                                      <span className="text-brown-900 font-bold">{order.companyName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 font-medium">Material Type:</span>
                                      <span className="text-brown-900 font-bold">{order.product}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 font-medium">Quantity:</span>
                                      <span className="text-terracotta-600 font-bold">{order.quantity} Units</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-50 pt-3">
                                      <span className="text-gray-400 font-medium">Order Status:</span>
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${getStatusColor(order.status)}`}>
                                        {order.status === 'Pending' && !order.assignedDriver ? 'Pending Assignment' : order.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Logistics details */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Logistics & Driver Information</h4>
                                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                    {order.assignedDriver && order.assignedTruck ? (
                                      <>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-400 font-medium">Driver Name:</span>
                                          <span className="text-brown-900 font-bold flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-terracotta-500" />
                                            {order.assignedDriver.name}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-400 font-medium">Driver Contact:</span>
                                          <span className="text-brown-900 font-bold flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-terracotta-500" />
                                            {order.assignedDriver.contactNumber}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-400 font-medium">Truck ID & Number:</span>
                                          <span className="text-brown-900 font-bold flex items-center gap-1.5">
                                            <Truck className="w-3.5 h-3.5 text-terracotta-500" />
                                            {order.assignedTruck.truckId} ({order.assignedTruck.truckNumber})
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-400 font-medium">Current Location:</span>
                                          <span className="text-brown-900 font-bold flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                                            {order.currentLocation || 'N/A'}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-6 text-center">
                                        <ShieldAlert className="w-8 h-8 text-yellow-500 mb-2" />
                                        <p className="font-bold text-brown-900 text-xs">Driver & Truck Not Assigned Yet</p>
                                        <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">We are securing the best logistics team for your project.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>

                              {/* Dates Section */}
                              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-around gap-4 text-xs font-semibold text-center">
                                <div className="space-y-1">
                                  <p className="text-gray-400 uppercase tracking-wider text-[9px]">Dispatch Date</p>
                                  <p className="text-brown-900 font-bold text-sm">
                                    {order.dispatchDate ? new Date(order.dispatchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not Dispatched Yet'}
                                  </p>
                                </div>
                                <div className="hidden sm:block border-r border-gray-100 my-1"></div>
                                <div className="space-y-1">
                                  <p className="text-gray-400 uppercase tracking-wider text-[9px]">Expected Delivery Date</p>
                                  <p className="text-terracotta-600 font-bold text-sm">
                                    {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pending Assignment'}
                                  </p>
                                </div>
                              </div>

                              {/* Visual Status Timeline */}
                              <div className="space-y-6 pt-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Delivery status Timeline</h4>
                                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 pl-6 md:pl-0">
                                  
                                  {/* Background Line */}
                                  <div className="absolute left-2.5 md:left-0 top-0 md:top-5 bottom-0 md:bottom-auto md:w-full h-full md:h-[3px] bg-gray-200 -z-10">
                                    <div 
                                      className="bg-terracotta-500 transition-all duration-500 h-full md:h-full w-[3px] md:w-full"
                                      style={{
                                        height: window.innerWidth < 768 ? `${(currentStep / 4) * 100}%` : '100%',
                                        width: window.innerWidth >= 768 ? `${(currentStep / 4) * 100}%` : '3px'
                                      }}
                                    />
                                  </div>

                                  {timelineSteps.map((step, sIdx) => {
                                    const isActive = sIdx <= currentStep;
                                    const isCurrent = sIdx === currentStep;

                                    return (
                                      <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-3 md:text-center md:flex-1 relative">
                                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all z-10 
                                          ${isCurrent ? 'bg-terracotta-600 border-white ring-4 ring-terracotta-200 scale-125' : isActive ? 'bg-terracotta-500 border-white' : 'bg-white border-gray-200'}
                                        `}>
                                          {isActive && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                          <p className={`font-bold text-xs ${isActive ? 'text-terracotta-600' : 'text-gray-400'}`}>
                                            {step.label}
                                          </p>
                                          <p className="text-[9px] text-gray-400 leading-tight mt-0.5 max-w-[130px] hidden md:block">
                                            {step.desc}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}

                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-brown-900">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  required 
                  value={profileData.name} 
                  onChange={e => setProfileData({...profileData, name: e.target.value})} 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900" 
                  placeholder="Enter your name" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                <input 
                  value={profileData.phone} 
                  onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                  type="tel" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900" 
                  placeholder="+92 300 0000000" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Shipping Address</label>
                <textarea 
                  value={profileData.address} 
                  onChange={e => setProfileData({...profileData, address: e.target.value})} 
                  rows="3"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 resize-none" 
                  placeholder="Enter your shipping address" 
                />
              </div>
              
              <div className="pt-4">
                <button 
                  disabled={updateLoading}
                  type="submit" 
                  className="w-full bg-terracotta-600 text-white font-bold py-5 rounded-2xl hover:bg-terracotta-700 transition-all shadow-xl shadow-terracotta-600/20 disabled:opacity-50"
                >
                  {updateLoading ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
