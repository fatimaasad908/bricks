import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Clock, Trash2, X, Edit } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    workerId: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    type: 'Contract',
    status: 'Active',
    attendance: '0/26',
    earnings: '₨ 0'
  });

  const fetchWorkers = async () => {
    try {
      const data = await apiFetch('/workers');
      setWorkers(data);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/workers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/workers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ workerId: '', name: '', email: '', phone: '', role: '', type: 'Contract', status: 'Active', attendance: '0/26', earnings: '₨ 0' });
      fetchWorkers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (worker, e) => {
    e.stopPropagation();
    setFormData({
      workerId: worker.workerId,
      name: worker.name,
      email: worker.email || '',
      phone: worker.phone || '',
      role: worker.role,
      type: worker.type,
      status: worker.status,
      attendance: worker.attendance,
      earnings: worker.earnings
    });
    setEditingId(worker._id);
    setShowModal(true);
  };

  const handleDeleteWorker = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this worker?')) return;
    
    try {
      await apiFetch(`/workers/${id}`, { method: 'DELETE' });
      fetchWorkers();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (w.email && w.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (w.phone && w.phone.toLowerCase().includes(searchTerm.toLowerCase())) || 
    w.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportHeaders = ['Worker ID', 'Name', 'Email', 'Phone', 'Role', 'Type', 'Status', 'Attendance', 'Earnings'];
  const exportKeys = ['workerId', 'name', 'email', 'phone', 'role', 'type', 'status', 'attendance', 'earnings'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Worker Management</h2>
          <p className="text-gray-500 text-sm">Minimalist overview of your plant workforce</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredWorkers}
            allData={workers}
            headers={exportHeaders}
            keys={exportKeys}
            title="Worker Directory Export"
            filename="workers"
          />
          <button onClick={() => { setEditingId(null); setFormData({ workerId: '', name: '', email: '', phone: '', role: '', type: 'Contract', status: 'Active', attendance: '0/26', earnings: '₨ 0' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer">
            <UserPlus className="w-4 h-4" /> Add Worker
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Workers</p>
            <h3 className="text-2xl font-bold text-brown-900">{workers.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">On Leave / Absent</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {workers.filter(w => w.status !== 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Monthly Payroll</p>
            <h3 className="text-2xl font-bold text-brown-900">
              ₨ {workers.reduce((sum, w) => {
                const num = parseInt(String(w.earnings).replace(/[^0-9]/g, '')) || 0;
                return sum + num;
              }, 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Directory</h3>
          <input 
            type="text" 
            placeholder="Search workers..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading workers...</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No workers found.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Worker Info</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Month Attendance</th>
                  <th className="px-6 py-4 text-right">Est. Earnings</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredWorkers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                          {worker.name}
                        </span>
                        <span className="text-xs text-gray-400">ID: {worker.workerId} • {worker.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col text-xs text-gray-600">
                        <span>{worker.email || '--'}</span>
                        <span className="text-gray-400">{worker.phone || '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {worker.role}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${worker.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}
                       `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${worker.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {worker.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-brown-900">
                      {worker.attendance}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-brown-900">
                      {worker.earnings}
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button onClick={(e) => handleEditClick(worker, e)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={(e) => handleDeleteWorker(worker._id, e)} className="text-red-500 hover:text-red-700 cursor-pointer">
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

      {/* Add Worker Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Worker' : 'Add New Worker'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Worker ID</label>
                  <input required value={formData.workerId} onChange={e => setFormData({...formData, workerId: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" placeholder="W-005" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" placeholder="+92 300 0000000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" placeholder="Loader" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs">
                    <option>Contract</option>
                    <option>Daily Wage</option>
                    <option>Permanent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Earnings Estimation</label>
                  <input value={formData.earnings} onChange={e => setFormData({...formData, earnings: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-xs" placeholder="₨ 25,000" />
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6 cursor-pointer">
                {editingId ? 'Update Worker' : 'Save Worker'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
