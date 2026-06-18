import { useState, useEffect } from 'react';
import { ShoppingCart, Edit, Trash2, X, Eye, CheckCircle, Clock, Mail, Phone, MapPin, User, Package, Calendar, Truck, FileText } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'Pending',
    totalPrice: 0,
    statusNotes: '',
    estimatedDeliveryDate: '',
    assignedVehicle: '',
    assignedTruck: '',
    assignedDriver: '',
    dispatchDate: '',
    currentLocation: ''
  });

  const fetchAvailableFleet = async () => {
    try {
      const trucksData = await apiFetch('/transport/trucks?status=Available');
      const driversData = await apiFetch('/transport/drivers?status=Available');
      setAvailableTrucks(trucksData);
      setAvailableDrivers(driversData);
    } catch (error) {
      console.error('Failed to fetch available fleet:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await apiFetch('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/orders/${selectedOrder._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: statusUpdate.status,
          totalPrice: Number(statusUpdate.totalPrice),
          statusNotes: statusUpdate.statusNotes,
          estimatedDeliveryDate: statusUpdate.estimatedDeliveryDate || null,
          assignedVehicle: statusUpdate.assignedVehicle,
          assignedTruck: statusUpdate.assignedTruck || null,
          assignedDriver: statusUpdate.assignedDriver || null,
          dispatchDate: statusUpdate.dispatchDate || null,
          currentLocation: statusUpdate.currentLocation
        })
      });
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this order request?')) return;
    try {
      await apiFetch(`/orders/${id}`, { method: 'DELETE' });
      fetchOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Out for Delivery': return 'bg-orange-100 text-orange-700';
      case 'Ready for Delivery': return 'bg-teal-100 text-teal-700';
      case 'Quality Check Completed': return 'bg-emerald-100 text-emerald-700';
      case 'Bricks Under Manufacturing': case 'Production Started': return 'bg-blue-100 text-blue-700';
      case 'Raw Material Allocated': return 'bg-indigo-100 text-indigo-700';
      case 'Order Confirmed': return 'bg-cyan-100 text-cyan-700';
      case 'Order Placed': return 'bg-yellow-100 text-yellow-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Quoted': return 'bg-purple-100 text-purple-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const displayTrucks = [...availableTrucks];
  if (selectedOrder?.assignedTruck && !displayTrucks.some(t => t._id === (selectedOrder.assignedTruck._id || selectedOrder.assignedTruck))) {
    displayTrucks.push(selectedOrder.assignedTruck);
  }

  const displayDrivers = [...availableDrivers];
  if (selectedOrder?.assignedDriver && !displayDrivers.some(d => d._id === (selectedOrder.assignedDriver._id || selectedOrder.assignedDriver))) {
    displayDrivers.push(selectedOrder.assignedDriver);
  }

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.companyName && o.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    o.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportHeaders = ['Order ID', 'Customer Name', 'Company Name', 'Email', 'Phone', 'Product', 'Quantity', 'Location', 'Price (PKR)', 'Status', 'Date'];
  const exportKeys = ['_id', 'contactPerson', 'companyName', 'email', 'phone', 'product', 'quantity', 'location', 'totalPrice', 'status', 'createdAt'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-brown-900 mb-1">Customer Orders</h2>
           <p className="text-gray-500 text-sm">Review incoming requests and manage order lifecycle.</p>
        </div>
        <div className="flex gap-3 items-center">
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900 bg-white" 
          />
          <ExportButton 
            filteredData={filteredOrders}
            allData={orders}
            headers={exportHeaders}
            keys={exportKeys}
            title="Customer Orders Export"
            filename="customer_orders"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Truck</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No order requests found.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-5 font-bold text-terracotta-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-brown-900 group-hover:text-terracotta-600 transition-colors">{order.contactPerson}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{order.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-600">
                      {order.assignedTruck ? order.assignedTruck.truckId : 'Not Assigned Yet'}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      {order.assignedDriver ? order.assignedDriver.name : 'Not Assigned Yet'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusUpdate({
                            status: order.status || 'Order Placed',
                            totalPrice: order.totalPrice || 0,
                            statusNotes: order.statusNotes || '',
                            estimatedDeliveryDate: order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toISOString().split('T')[0] : '',
                            assignedVehicle: order.assignedVehicle || '',
                            assignedTruck: order.assignedTruck?._id || '',
                            assignedDriver: order.assignedDriver?._id || '',
                            dispatchDate: order.dispatchDate ? new Date(order.dispatchDate).toISOString().split('T')[0] : '',
                            currentLocation: order.currentLocation || ''
                          });
                          fetchAvailableFleet();
                          setShowModal(true);
                        }} 
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={(e) => handleDelete(order._id, e)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Update Order Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="flex h-[600px] overflow-y-auto">
              
              {/* Left Panel: Details */}
              <div className="w-1/2 bg-gray-50/50 p-10 overflow-y-auto border-r border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-brown-900 tracking-tight">Order Details</h3>
                  <span className="text-[10px] font-bold bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm text-gray-400 uppercase tracking-widest">#{selectedOrder._id.slice(-6)}</span>
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Contact</h4>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-terracotta-50 rounded-xl flex items-center justify-center text-terracotta-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-brown-900 leading-tight">{selectedOrder.contactPerson}</p>
                          <p className="text-xs text-gray-500 font-medium">{selectedOrder.companyName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-terracotta-500" />
                          {selectedOrder.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="w-3 h-3 text-terracotta-500" />
                          {selectedOrder.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3 text-terracotta-500" />
                          {selectedOrder.location || 'No location provided'}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Order Requirements</h4>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-terracotta-600 font-black text-xl leading-tight">{selectedOrder.product}</p>
                          <p className="text-sm font-bold text-brown-900 mt-1">{selectedOrder.quantity} Units Requested</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-xl">
                          <Package className="w-6 h-6 text-gray-300" />
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl italic text-xs text-gray-500 leading-relaxed border border-dashed border-gray-200">
                        "{selectedOrder.description || 'No additional details provided by customer.'}"
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Right Panel: Actions */}
              <div className="w-1/2 p-10 flex flex-col relative overflow-y-auto">
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-600 transition-colors cursor-pointer">
                  <X className="w-6 h-6" />
                </button>

                <div className="mt-6 flex-1 space-y-6">
                  <h3 className="text-xl font-bold text-brown-900 mb-4">Update Status & Pricing</h3>
                  
                  <form onSubmit={handleUpdateOrder} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Lifecycle Status</label>
                      <select
                        value={statusUpdate.status}
                        onChange={e => setStatusUpdate({...statusUpdate, status: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-bold text-brown-900"
                      >
                        {[
                          'Order Placed',
                          'Order Confirmed',
                          'Raw Material Allocated',
                          'Production Started',
                          'Bricks Under Manufacturing',
                          'Quality Check Completed',
                          'Ready for Delivery',
                          'Out for Delivery',
                          'Delivered',
                          'Pending',
                          'Reviewed',
                          'Quoted',
                          'Processing',
                          'Rejected',
                          'Driver Assigned',
                          'In Transit',
                          'Reached Site',
                          'Pending Assignment'
                        ].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Total Order Value (PKR)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rs.</span>
                        <input 
                          type="number"
                          value={statusUpdate.totalPrice}
                          onChange={e => setStatusUpdate({...statusUpdate, totalPrice: Number(e.target.value)})}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-black text-brown-900 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Status Notes / Comments</label>
                      <textarea
                        value={statusUpdate.statusNotes}
                        onChange={e => setStatusUpdate({...statusUpdate, statusNotes: e.target.value})}
                        rows="2"
                        placeholder="Add comments on this lifecycle update..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 resize-none text-[11px]"
                      />
                    </div>

                     <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Dispatch Date</label>
                        <input 
                          type="date"
                          value={statusUpdate.dispatchDate}
                          onChange={e => setStatusUpdate({...statusUpdate, dispatchDate: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Est. Delivery Date</label>
                        <input 
                          type="date"
                          value={statusUpdate.estimatedDeliveryDate}
                          onChange={e => setStatusUpdate({...statusUpdate, estimatedDeliveryDate: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Assigned Truck</label>
                        <select
                          value={statusUpdate.assignedTruck}
                          onChange={e => {
                            const val = e.target.value;
                            setStatusUpdate(prev => ({
                              ...prev,
                              assignedTruck: val,
                              status: val && prev.assignedDriver && (prev.status === 'Pending' || prev.status === 'Order Placed') ? 'Driver Assigned' : prev.status
                            }));
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-bold text-brown-900"
                        >
                          <option value="">Select Truck</option>
                          {displayTrucks.map(t => (
                            <option key={t._id} value={t._id}>
                              {t.truckId} ({t.truckNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Assigned Driver</label>
                        <select
                          value={statusUpdate.assignedDriver}
                          onChange={e => {
                            const val = e.target.value;
                            setStatusUpdate(prev => ({
                              ...prev,
                              assignedDriver: val,
                              status: val && prev.assignedTruck && (prev.status === 'Pending' || prev.status === 'Order Placed') ? 'Driver Assigned' : prev.status
                            }));
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-bold text-brown-900"
                        >
                          <option value="">Select Driver</option>
                          {displayDrivers.map(d => (
                            <option key={d._id} value={d._id}>
                              {d.name} ({d.driverId})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Current Location</label>
                      <input 
                        type="text"
                        placeholder="e.g. In Transit near City Center"
                        value={statusUpdate.currentLocation}
                        onChange={e => setStatusUpdate({...statusUpdate, currentLocation: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900"
                      />
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full bg-brown-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer">
                        Save Order Updates
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-yellow-700 leading-relaxed font-medium">
                      Updating the status will automatically trigger in-app notifications and email alerts to the customer.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
