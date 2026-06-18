import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Hammer } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminMaintenance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    equipment: '',
    maintenanceType: 'Routine',
    priority: 'Low',
    assignedTechnician: '',
    scheduledDate: '',
    completionDate: '',
    status: 'Scheduled'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/maintenance');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch maintenance records:', error);
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
        await apiFetch(`/maintenance/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/maintenance', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ equipment: '', maintenanceType: 'Routine', priority: 'Low', assignedTechnician: '', scheduledDate: '', completionDate: '', status: 'Scheduled' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      equipment: item.equipment,
      maintenanceType: item.maintenanceType,
      priority: item.priority,
      assignedTechnician: item.assignedTechnician || '',
      scheduledDate: item.scheduledDate ? new Date(item.scheduledDate).toISOString().split('T')[0] : '',
      completionDate: item.completionDate ? new Date(item.completionDate).toISOString().split('T')[0] : '',
      status: item.status
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this maintenance schedule?')) return;
    
    try {
      await apiFetch(`/maintenance/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.equipment.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.assignedTechnician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Equipment Maintenance & Downtime logs</h2>
          <p className="text-gray-500 text-sm">Schedule plant repairs, assign technicians, monitor ticket priority, and log completion records</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ equipment: '', maintenanceType: 'Routine', priority: 'Low', assignedTechnician: '', scheduledDate: new Date().toISOString().split('T')[0], completionDate: '', status: 'Scheduled' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Hammer className="w-4 h-4" /> Schedule Repair
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed tickets</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status === 'Completed').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active / Pending tasks</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status === 'Scheduled' || i.status === 'In Progress').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Maintenance tickets</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Repair ledger</h3>
          <input 
            type="text" 
            placeholder="Search equipment or tech..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading schedules...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No maintenance tasks scheduled. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Machinery Equipment</th>
                  <th className="px-6 py-4">Repair Type</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Assigned Technician</th>
                  <th className="px-6 py-4">Scheduled Date</th>
                  <th className="px-6 py-4">Completion Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.equipment}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium text-xs uppercase">
                      {item.maintenanceType}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase
                        ${item.priority === 'Critical' ? 'bg-red-100 text-red-800' : item.priority === 'High' ? 'bg-orange-100 text-orange-800' : item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-semibold">
                      {item.assignedTechnician || '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.completionDate ? new Date(item.completionDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.status === 'Completed' ? 'bg-green-50 text-green-700' : item.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : item.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Completed' ? 'bg-green-500' : item.status === 'In Transit' ? 'bg-blue-500' : item.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Maintenance Task' : 'Schedule Repair Ticket'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Machinery / Equipment</label>
                <input required value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Clay Mixer A / Conveyor B" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Repair Type</label>
                  <select value={formData.maintenanceType} onChange={e => setFormData({...formData, maintenanceType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                    <option>Routine</option>
                    <option>Emergency</option>
                    <option>Downtime Overhaul</option>
                    <option>Calibration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Technician</label>
                <input required value={formData.assignedTechnician} onChange={e => setFormData({...formData, assignedTechnician: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Engr. Sajid Ali" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Scheduled Date</label>
                  <input required value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Completion Date (Actual)</label>
                  <input value={formData.completionDate} onChange={e => setFormData({...formData, completionDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Task Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                  <option>Scheduled</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Ticket' : 'Schedule Repair'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
