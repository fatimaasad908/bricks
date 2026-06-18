import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Calendar } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminShifts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    shiftName: 'Morning Shift',
    supervisor: '',
    employeesCount: '',
    startTime: '08:00',
    endTime: '16:00',
    status: 'Active'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/shift-management');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch shifts:', error);
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
        await apiFetch(`/shift-management/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/shift-management', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ shiftName: 'Morning Shift', supervisor: '', employeesCount: '', startTime: '08:00', endTime: '16:00', status: 'Active' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      shiftName: item.shiftName,
      supervisor: item.supervisor,
      employeesCount: item.employeesCount,
      startTime: item.startTime,
      endTime: item.endTime,
      status: item.status
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this shift schedule?')) return;
    
    try {
      await apiFetch(`/shift-management/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.shiftName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Shift Management & Rosters</h2>
          <p className="text-gray-500 text-sm">Schedule daily plant labor shifts, supervisor controls, timing allocations, and workforce headcount volume</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ shiftName: 'Morning Shift', supervisor: '', employeesCount: '', startTime: '08:00', endTime: '16:00', status: 'Active' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Calendar className="w-4 h-4" /> Schedule Shift
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Shifts</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status === 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Inactive Shifts</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status !== 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Scheduled workers</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.reduce((sum, item) => sum + (Number(item.employeesCount) || 0), 0)} Employees
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Shift Roster</h3>
          <input 
            type="text" 
            placeholder="Search shifts..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading shifts...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No shifts scheduled. Create one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Shift Title</th>
                  <th className="px-6 py-4">Supervisor</th>
                  <th className="px-6 py-4">Timing Details</th>
                  <th className="px-6 py-4 text-center">Labor Headcount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.shiftName}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.supervisor}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold text-xs uppercase">
                      {item.startTime} - {item.endTime}
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-brown-900">
                      {item.employeesCount} Workers
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Shift Schedule' : 'Schedule Shift Timing'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shift Name</label>
                <select value={formData.shiftName} onChange={e => setFormData({...formData, shiftName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                  <option>Morning Shift</option>
                  <option>Evening Shift</option>
                  <option>Night Shift</option>
                  <option>Weekend Shift</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supervisor In Charge</label>
                <input required value={formData.supervisor} onChange={e => setFormData({...formData, supervisor: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Kamran Shah" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Time (24h)</label>
                  <input required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="08:00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Time (24h)</label>
                  <input required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="16:00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Worker Count</label>
                  <input required value={formData.employeesCount} onChange={e => setFormData({...formData, employeesCount: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="15" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shift Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Shift' : 'Save Shift'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
