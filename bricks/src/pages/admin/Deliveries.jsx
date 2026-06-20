import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Trash2, X, Edit, MapPin } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminDeliveries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    deliveryNumber: '',
    driver: '',
    vehicle: '',
    customerAddress: '',
    dispatchDate: '',
    deliveryDate: '',
    status: 'Pending'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/deliveries');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/deliveries/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/deliveries', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ deliveryNumber: '', driver: '', vehicle: '', customerAddress: '', dispatchDate: '', deliveryDate: '', status: 'Pending' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      deliveryNumber: item.deliveryNumber,
      driver: item.driver,
      vehicle: item.vehicle,
      customerAddress: item.customerAddress,
      dispatchDate: item.dispatchDate ? new Date(item.dispatchDate).toISOString().split('T')[0] : '',
      deliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toISOString().split('T')[0] : '',
      status: item.status
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this delivery record?')) return;
    
    try {
      await apiFetch(`/deliveries/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.vehicle && i.vehicle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (i.customerAddress && i.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportHeaders = ['Delivery ID', 'Driver', 'Vehicle', 'Customer Address', 'Dispatch Date', 'Delivery Date', 'Status'];
  const exportKeys = ['deliveryNumber', 'driver', 'vehicle', 'customerAddress', 'dispatchDate', 'deliveryDate', 'status'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Dispatch & Deliveries Tracking</h2>
          <p className="text-gray-500 text-sm">Organize cargo trucks, dispatch timings, driver assignments, and shipment route status</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={exportHeaders}
            keys={exportKeys}
            title="Shipment Deliveries Export"
            filename="deliveries"
          />
          <button onClick={() => { setEditingId(null); setFormData({ deliveryNumber: 'DEL-' + Date.now().toString().slice(-4), driver: '', vehicle: '', customerAddress: '', dispatchDate: new Date().toISOString().split('T')[0], deliveryDate: '', status: 'Pending' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer">
            <MapPin className="w-4 h-4" /> Dispatch Shipment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivered Shipments</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status === 'Delivered').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">In Transit / Dispatched</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status === 'In Transit' || i.status === 'Pending').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Deliveries Logged</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Shipment Manifest</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading deliveries...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No deliveries found. Dispatch one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Delivery ID</th>
                  <th className="px-6 py-4">Driver</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Destination Address</th>
                  <th className="px-6 py-4">Dispatch Date</th>
                  <th className="px-6 py-4">Delivered Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.deliveryNumber}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.driver}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold text-xs uppercase">
                      {item.vehicle}
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs max-w-[200px] truncate">
                      {item.customerAddress}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.dispatchDate ? new Date(item.dispatchDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.status === 'Delivered' ? 'bg-green-50 text-green-700' : item.status === 'In Transit' ? 'bg-blue-50 text-blue-700' : item.status === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : item.status === 'In Transit' ? 'bg-blue-500' : item.status === 'Failed' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button onClick={(e) => handleEditClick(item, e)} className="text-blue-500 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={(e) => handleDelete(item._id, e)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Delivery Details' : 'Dispatch Shipment'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Number</label>
                <input required value={formData.deliveryNumber} onChange={e => setFormData({...formData, deliveryNumber: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="DEL-801" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Driver Name</label>
                  <input required value={formData.driver} onChange={e => setFormData({...formData, driver: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Sher Khan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle / Truck Plate</label>
                  <input required value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="LHR-7762" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer Shipping Address</label>
                <input required value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="DHA Phase 6, Block C, Lahore" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dispatch Date</label>
                  <input required value={formData.dispatchDate} onChange={e => setFormData({...formData, dispatchDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Date (Est/Actual)</label>
                  <input value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                  <option>Pending</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                  <option>Failed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Delivery' : 'Dispatch Shipment'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
