import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Clock, Trash2, X, Edit, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminRawMaterials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    materialName: '',
    sku: '',
    unit: 'Tons',
    stockQuantity: '',
    reorderLevel: '',
    supplier: '',
    costPerUnit: ''
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/raw-materials');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch raw materials:', error);
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
        await apiFetch(`/raw-materials/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/raw-materials', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ materialName: '', sku: '', unit: 'Tons', stockQuantity: '', reorderLevel: '', supplier: '', costPerUnit: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      materialName: item.materialName,
      sku: item.sku,
      unit: item.unit,
      stockQuantity: item.stockQuantity,
      reorderLevel: item.reorderLevel,
      supplier: item.supplier || '',
      costPerUnit: item.costPerUnit
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this raw material?')) return;
    
    try {
      await apiFetch(`/raw-materials/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const lowStockItems = items.filter(i => Number(i.stockQuantity) <= Number(i.reorderLevel));
  const filteredItems = items.filter(i => 
    i.materialName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.supplier && i.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportHeaders = ['Material Name', 'SKU', 'Unit', 'Stock Quantity', 'Reorder Level', 'Supplier', 'Cost Per Unit', 'Status'];
  const exportKeys = ['materialName', 'sku', 'unit', 'stockQuantity', 'reorderLevel', 'supplier', 'costPerUnit', 'status'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Raw Materials Tracking</h2>
          <p className="text-gray-500 text-sm">Monitor stock level and suppliers of clay, sand, cement, coal, and fuel</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={exportHeaders}
            keys={exportKeys}
            title="Raw Materials Export"
            filename="raw_materials"
          />
          <button onClick={() => { setEditingId(null); setFormData({ materialName: '', sku: '', unit: 'Tons', stockQuantity: '', reorderLevel: '', supplier: '', costPerUnit: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer">
            <UserPlus className="w-4 h-4" /> Add Material
          </button>
        </div>
      </div>

      {/* Alert Banner for Low Stock */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Low Stock Alert!</h4>
            <p className="text-xs text-red-600 mt-0.5">The following materials are below their minimum reorder thresholds: {lowStockItems.map(i => `${i.materialName} (${i.stockQuantity} ${i.unit})`).join(', ')}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Materials</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-brown-900">{lowStockItems.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Assets value</p>
            <h3 className="text-2xl font-bold text-brown-900">
              ₨ {items.reduce((sum, item) => sum + (Number(item.stockQuantity) * Number(item.costPerUnit)), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Materials Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading materials...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No materials found. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Material Info</th>
                  <th className="px-6 py-4">Stock Quantity</th>
                  <th className="px-6 py-4">Reorder level</th>
                  <th className="px-6 py-4">Cost per unit</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                          {item.materialName}
                        </span>
                        <span className="text-xs text-gray-400">SKU: {item.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-brown-900">
                      {item.stockQuantity} {item.unit}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {Number(item.costPerUnit).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.supplier || '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.status === 'In Stock' ? 'bg-green-50 text-green-700' : item.status === 'Low Stock' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'In Stock' ? 'bg-green-500' : item.status === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Raw Material' : 'Add Raw Material'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Material Name</label>
                <input required value={formData.materialName} onChange={e => setFormData({...formData, materialName: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Clay / Sand / Coal / Cement" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU</label>
                  <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="RAW-001" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
                  <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Tons</option>
                    <option>Kg</option>
                    <option>Bags</option>
                    <option>Liters</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Quantity</label>
                  <input required value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="250" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reorder level</label>
                  <input required value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost Per Unit (₨)</label>
                  <input required value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="1500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier</label>
                  <input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Allied Mining Co." />
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Material' : 'Save Material'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
