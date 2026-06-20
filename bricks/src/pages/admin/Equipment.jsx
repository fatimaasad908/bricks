import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Wrench } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminEquipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    equipmentName: '',
    type: 'Clay Mixer',
    location: '',
    operationalStatus: 'Operational',
    purchaseDate: '',
    maintenanceSchedule: 'Monthly'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/equipment');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
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
        await apiFetch(`/equipment/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/equipment', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ equipmentName: '', type: 'Clay Mixer', location: '', operationalStatus: 'Operational', purchaseDate: '', maintenanceSchedule: 'Monthly' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      equipmentName: item.equipmentName,
      type: item.type,
      location: item.location || '',
      operationalStatus: item.operationalStatus,
      purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
      maintenanceSchedule: item.maintenanceSchedule || 'Monthly'
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this equipment record?')) return;
    
    try {
      await apiFetch(`/equipment/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Industrial Machinery & Equipment</h2>
          <p className="text-gray-500 text-sm">Monitor operational status, schedules, plant positions, and downtime details of mixers and kilns</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={['Equipment Name', 'Type', 'Location', 'Operational Status', 'Purchase Date', 'Maintenance Schedule']}
            keys={['equipmentName', 'type', 'location', 'operationalStatus', 'purchaseDate', 'maintenanceSchedule']}
            title="Machinery Equipment Export"
            filename="machinery_equipment_export"
          />
          <button onClick={() => { setEditingId(null); setFormData({ equipmentName: '', type: 'Clay Mixer', location: 'Zone A', operationalStatus: 'Operational', purchaseDate: new Date().toISOString().split('T')[0], maintenanceSchedule: 'Monthly' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Wrench className="w-4 h-4" /> Register Machinery
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Operational Machines</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.operationalStatus === 'Operational').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Down / Under Maintenance</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.operationalStatus === 'Under Maintenance' || i.operationalStatus === 'Broken').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">#</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Machinery Assets</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Asset Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading equipment...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No machinery registered. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Machinery Asset</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Maintenance Schedule</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.equipmentName}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.type}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.location || '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold">
                      {item.maintenanceSchedule}
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.operationalStatus === 'Operational' ? 'bg-green-50 text-green-700' : item.operationalStatus === 'Under Maintenance' ? 'bg-orange-50 text-orange-700' : item.operationalStatus === 'Retired' ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.operationalStatus === 'Operational' ? 'bg-green-500' : item.operationalStatus === 'Under Maintenance' ? 'bg-orange-500' : item.operationalStatus === 'Retired' ? 'bg-gray-400' : 'bg-red-500'}`}></span>
                        {item.operationalStatus}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Machinery' : 'Register Machinery'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Equipment Name</label>
                <input required value={formData.equipmentName} onChange={e => setFormData({...formData, equipmentName: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Clay Extruder A" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Clay Mixer</option>
                    <option>Extruder</option>
                    <option>Kiln structure</option>
                    <option>Conveyor Belt</option>
                    <option>Packaging Machine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Zone A" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Purchase Date</label>
                  <input required value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Maintenance Schedule</label>
                  <select value={formData.maintenanceSchedule} onChange={e => setFormData({...formData, maintenanceSchedule: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Bi-Annually</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Operational Status</label>
                <select value={formData.operationalStatus} onChange={e => setFormData({...formData, operationalStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                  <option>Operational</option>
                  <option>Under Maintenance</option>
                  <option>Broken</option>
                  <option>Retired</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Machinery' : 'Register Machinery'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
