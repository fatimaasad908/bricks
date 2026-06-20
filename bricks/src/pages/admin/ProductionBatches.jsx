import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Layers } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminProductionBatches() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    batchNumber: '',
    productionDate: '',
    operator: '',
    quantityProduced: '',
    kilnStatus: 'Loading',
    completionStatus: 'In Progress'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/production-batches');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch production batches:', error);
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
        await apiFetch(`/production-batches/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/production-batches', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ batchNumber: '', productionDate: '', operator: '', quantityProduced: '', kilnStatus: 'Loading', completionStatus: 'In Progress' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      batchNumber: item.batchNumber,
      productionDate: item.productionDate ? new Date(item.productionDate).toISOString().split('T')[0] : '',
      operator: item.operator,
      quantityProduced: item.quantityProduced,
      kilnStatus: item.kilnStatus,
      completionStatus: item.completionStatus
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this production batch?')) return;
    
    try {
      await apiFetch(`/production-batches/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Production Batches & Kilns</h2>
          <p className="text-gray-500 text-sm">Monitor daily kiln loading, operator shifts, firing progress, and output yield logs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setEditingId(null); setFormData({ batchNumber: 'PB-' + Date.now().toString().slice(-4), productionDate: new Date().toISOString().split('T')[0], operator: '', quantityProduced: '', kilnStatus: 'Loading', completionStatus: 'In Progress' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Layers className="w-4 h-4" /> Record New Batch
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed Batches</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.completionStatus === 'Completed').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Batches In Firing / Loading</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.completionStatus === 'In Progress').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">#</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Bricks Produced</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.reduce((sum, item) => sum + (Number(item.quantityProduced) || 0), 0).toLocaleString()} Bricks
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Kiln yield tracking</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading batches...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No production batches found. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Batch ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Operator</th>
                  <th className="px-6 py-4">Quantity Produced</th>
                  <th className="px-6 py-4">Kiln Status</th>
                  <th className="px-6 py-4">Completion Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.batchNumber}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.productionDate ? new Date(item.productionDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.operator}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      {item.quantityProduced.toLocaleString()} Bricks
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.kilnStatus === 'Firing' ? 'bg-red-50 text-red-700 animate-pulse' : item.kilnStatus === 'Cooling' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}
                      `}>
                        {item.kilnStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.completionStatus === 'Completed' ? 'bg-green-50 text-green-700' : item.completionStatus === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        {item.completionStatus}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Batch Details' : 'Record Production Batch'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Number</label>
                <input required value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="PB-401" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Production Date</label>
                  <input required value={formData.productionDate} onChange={e => setFormData({...formData, productionDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity Produced</label>
                  <input required value={formData.quantityProduced} onChange={e => setFormData({...formData, quantityProduced: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="25000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Operator In Charge</label>
                <input required value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Muhammad Ali" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kiln Status</label>
                  <select value={formData.kilnStatus} onChange={e => setFormData({...formData, kilnStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Loading</option>
                    <option>Firing</option>
                    <option>Cooling</option>
                    <option>Empty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Completion Status</label>
                  <select value={formData.completionStatus} onChange={e => setFormData({...formData, completionStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Failed</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Batch' : 'Save Batch'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
