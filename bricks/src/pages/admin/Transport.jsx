import { useState, useEffect } from 'react';
import { Truck, User, Plus, Edit, Trash2, X, Phone, Shield } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminTransport() {
  const [activeTab, setActiveTab] = useState('trucks'); // 'trucks' | 'drivers'
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [truckForm, setTruckForm] = useState({
    truckId: '',
    truckNumber: '',
    availability_status: 'Available'
  });

  const [driverForm, setDriverForm] = useState({
    driverId: '',
    name: '',
    contactNumber: '',
    availability_status: 'Available'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const trucksData = await apiFetch('/transport/trucks');
      const driversData = await apiFetch('/transport/drivers');
      setTrucks(trucksData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Failed to fetch fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTruckSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/transport/trucks/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(truckForm)
        });
      } else {
        await apiFetch('/transport/trucks', {
          method: 'POST',
          body: JSON.stringify(truckForm)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setTruckForm({ truckId: '', truckNumber: '', availability_status: 'Available' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDriverSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/transport/drivers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(driverForm)
        });
      } else {
        await apiFetch('/transport/drivers', {
          method: 'POST',
          body: JSON.stringify(driverForm)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setDriverForm({ driverId: '', name: '', contactNumber: '', availability_status: 'Available' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteTruck = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this truck?')) return;
    try {
      await apiFetch(`/transport/trucks/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteDriver = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      await apiFetch(`/transport/drivers/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Assigned': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'On Delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Unavailable': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredTrucks = trucks.filter(t => 
    t.truckId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.availability_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = drivers.filter(d => 
    d.driverId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.availability_status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Logistics & Fleet Management</h2>
          <p className="text-gray-500 text-sm">Monitor cargo trucks availability, register drivers, and track active statuses.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setTruckForm({ truckId: '', truckNumber: '', availability_status: 'Available' });
            setDriverForm({ driverId: '', name: '', contactNumber: '', availability_status: 'Available' });
            setShowModal(true);
          }} 
          className="flex items-center gap-2 bg-terracotta-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-terracotta-700 transition-all shadow-lg shadow-terracotta-600/20"
        >
          <Plus className="w-4 h-4" /> Add {activeTab === 'trucks' ? 'Vehicle' : 'Driver'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex p-1 bg-gray-50 rounded-xl">
          <button
            onClick={() => { setActiveTab('trucks'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'trucks' ? 'bg-white text-terracotta-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Truck className="w-4 h-4" />
            Truck Fleet ({trucks.length})
          </button>
          <button
            onClick={() => { setActiveTab('drivers'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'drivers' ? 'bg-white text-terracotta-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <User className="w-4 h-4" />
            Driver Registry ({drivers.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading details...</div>
        ) : activeTab === 'trucks' ? (
          /* TRUCKS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Truck ID</th>
                  <th className="px-6 py-4">Truck Number (Plate)</th>
                  <th className="px-6 py-4">Availability Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTrucks.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No trucks found.</td></tr>
                ) : (
                  filteredTrucks.map(truck => (
                    <tr key={truck._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-terracotta-600 flex items-center gap-3">
                        <div className="p-2 bg-terracotta-50 rounded-lg">
                          <Truck className="w-4 h-4 text-terracotta-500" />
                        </div>
                        {truck.truckId}
                      </td>
                      <td className="px-6 py-5 font-bold text-brown-900">{truck.truckNumber}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getStatusColor(truck.availability_status)}`}>
                          {truck.availability_status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => {
                            setEditingId(truck._id);
                            setTruckForm({
                              truckId: truck.truckId,
                              truckNumber: truck.truckNumber,
                              availability_status: truck.availability_status
                            });
                            setShowModal(true);
                          }} 
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteTruck(truck._id, e)} 
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* DRIVERS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Driver ID</th>
                  <th className="px-6 py-4">Driver Name</th>
                  <th className="px-6 py-4">Contact Number</th>
                  <th className="px-6 py-4">Availability Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDrivers.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No drivers found.</td></tr>
                ) : (
                  filteredDrivers.map(driver => (
                    <tr key={driver._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-terracotta-600 flex items-center gap-3">
                        <div className="p-2 bg-terracotta-50 rounded-lg">
                          <User className="w-4 h-4 text-terracotta-500" />
                        </div>
                        {driver.driverId}
                      </td>
                      <td className="px-6 py-5 font-bold text-brown-900">{driver.name}</td>
                      <td className="px-6 py-5 font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {driver.contactNumber}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getStatusColor(driver.availability_status)}`}>
                          {driver.availability_status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => {
                            setEditingId(driver._id);
                            setDriverForm({
                              driverId: driver.driverId,
                              name: driver.name,
                              contactNumber: driver.contactNumber,
                              availability_status: driver.availability_status
                            });
                            setShowModal(true);
                          }} 
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteDriver(driver._id, e)} 
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-brown-900 mb-6">
              {editingId ? 'Edit' : 'Add New'} {activeTab === 'trucks' ? 'Truck' : 'Driver'}
            </h3>

            {activeTab === 'trucks' ? (
              <form onSubmit={handleTruckSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Truck ID</label>
                  <input 
                    required 
                    value={truckForm.truckId} 
                    onChange={e => setTruckForm({...truckForm, truckId: e.target.value})} 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 text-sm" 
                    placeholder="e.g. T006" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Truck License Plate</label>
                  <input 
                    required 
                    value={truckForm.truckNumber} 
                    onChange={e => setTruckForm({...truckForm, truckNumber: e.target.value})} 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 text-sm" 
                    placeholder="e.g. LHR-7762" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Status</label>
                  <select 
                    value={truckForm.availability_status} 
                    onChange={e => setTruckForm({...truckForm, availability_status: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-bold text-brown-900 text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-4 rounded-xl hover:bg-terracotta-700 transition-colors shadow-lg shadow-terracotta-600/20 text-sm mt-6">
                  {editingId ? 'Update Truck' : 'Save Truck'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleDriverSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Driver ID</label>
                  <input 
                    required 
                    value={driverForm.driverId} 
                    onChange={e => setDriverForm({...driverForm, driverId: e.target.value})} 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 text-sm" 
                    placeholder="e.g. D006" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Driver Name</label>
                  <input 
                    required 
                    value={driverForm.name} 
                    onChange={e => setDriverForm({...driverForm, name: e.target.value})} 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 text-sm" 
                    placeholder="e.g. Ahmed Khan" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Contact Number</label>
                  <input 
                    required 
                    value={driverForm.contactNumber} 
                    onChange={e => setDriverForm({...driverForm, contactNumber: e.target.value})} 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-medium text-brown-900 text-sm" 
                    placeholder="e.g. +92 300 1234567" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Status</label>
                  <select 
                    value={driverForm.availability_status} 
                    onChange={e => setDriverForm({...driverForm, availability_status: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-terracotta-500/20 focus:bg-white outline-none transition-all font-bold text-brown-900 text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-4 rounded-xl hover:bg-terracotta-700 transition-colors shadow-lg shadow-terracotta-600/20 text-sm mt-6">
                  {editingId ? 'Update Driver' : 'Save Driver'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
