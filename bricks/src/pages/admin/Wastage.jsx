import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Clock, Trash2, X, Edit, Trash } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminWastage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    batch: '',
    materialOrProduct: 'Standard Clay Brick',
    quantityWasted: '',
    reason: 'Over-firing crack defects',
    recordedBy: 'Quality Inspector',
    wastageDate: ''
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/wastage');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch wastage records:', error);
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
        await apiFetch(`/wastage/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/wastage', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ batch: '', materialOrProduct: 'Standard Clay Brick', quantityWasted: '', reason: 'Over-firing crack defects', recordedBy: 'Quality Inspector', wastageDate: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      batch: item.batch || '',
      materialOrProduct: item.materialOrProduct,
      quantityWasted: item.quantityWasted,
      reason: item.reason || '',
      recordedBy: item.recordedBy || 'Quality Inspector',
      wastageDate: item.wastageDate ? new Date(item.wastageDate).toISOString().split('T')[0] : ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this wastage record?')) return;
    
    try {
      await apiFetch(`/wastage/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.materialOrProduct.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.batch && i.batch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Defect & Material Wastage Tracking</h2>
          <p className="text-gray-500 text-sm">Monitor rejects, over-fired cracks, spoiled batches, and raw clay losses to improve kiln yields</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setEditingId(null); setFormData({ batch: 'PB-' + Date.now().toString().slice(-4), materialOrProduct: 'Standard Clay Brick', quantityWasted: '', reason: 'Over-firing crack defects', recordedBy: 'Quality Inspector', wastageDate: new Date().toISOString().split('T')[0] }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Trash className="w-4 h-4" /> Log Wastage
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Trash className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Scrap logged</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.reduce((sum, item) => sum + (Number(item.quantityWasted) || 0), 0).toLocaleString()} Units
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Logs Filed</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">!</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Worst Wastage Category</p>
            <h3 className="text-xl font-bold text-brown-900 truncate">Clay Extrusion</h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Scrap Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading wastage...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No wastage records found. Log defects!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Material / Product</th>
                  <th className="px-6 py-4">Batch Ref</th>
                  <th className="px-6 py-4">Quantity Wasted</th>
                  <th className="px-6 py-4">Reason for Waste</th>
                  <th className="px-6 py-4">Recorded By</th>
                  <th className="px-6 py-4">Wastage Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.materialOrProduct}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold text-xs uppercase">
                      {item.batch || 'N/A'}
                    </td>
                    <td className="px-6 py-5 font-bold text-red-600">
                      {item.quantityWasted.toLocaleString()} Units
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs font-semibold max-w-[200px] truncate">
                      {item.reason || '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.recordedBy}
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      {item.wastageDate ? new Date(item.wastageDate).toLocaleDateString() : '--'}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Defect Record' : 'Record Defect / Scrap'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Material / Product</label>
                <select value={formData.materialOrProduct} onChange={e => setFormData({...formData, materialOrProduct: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                  <option>Standard Clay Brick</option>
                  <option>Fly Ash Brick</option>
                  <option>OPC Cement Bags</option>
                  <option>Silica Sand Ton</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Reference</label>
                  <input value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="PB-301" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wastage Date</label>
                  <input required value={formData.wastageDate} onChange={e => setFormData({...formData, wastageDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity Wasted</label>
                  <input required value={formData.quantityWasted} onChange={e => setFormData({...formData, quantityWasted: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="250" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inspector</label>
                  <input required value={formData.recordedBy} onChange={e => setFormData({...formData, recordedBy: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Quality Inspector" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason for Waste</label>
                <textarea rows="2" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none resize-none" placeholder="Kiln over-firing, crack damages..."></textarea>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Wastage' : 'Save Wastage'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
