import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Trash2, X, Edit, Archive } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    product: 'Standard Clay Brick',
    totalStock: '',
    reservedStock: '',
    warehouseLocation: 'Zone A'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/inventory');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
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
        await apiFetch(`/inventory/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/inventory', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ product: 'Standard Clay Brick', totalStock: '', reservedStock: '', warehouseLocation: 'Zone A' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      product: item.product,
      totalStock: item.totalStock,
      reservedStock: item.reservedStock,
      warehouseLocation: item.warehouseLocation || ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this inventory record?')) return;
    
    try {
      await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.warehouseLocation && i.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportHeaders = ['Product', 'Total Stock', 'Reserved Stock', 'Available Stock', 'Warehouse Location', 'Last Sync'];
  const exportKeys = ['product', 'totalStock', 'reservedStock', 'availableStock', 'warehouseLocation', 'updatedAt'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Warehouse Inventory & Stock levels</h2>
          <p className="text-gray-500 text-sm">Real-time stock values automatically synchronized with production batch yields and sales dispatches</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={exportHeaders}
            keys={exportKeys}
            title="Inventory Ledger Export"
            filename="inventory_ledger"
          />
          <button onClick={() => { setEditingId(null); setFormData({ product: 'Standard Clay Brick', totalStock: '', reservedStock: '0', warehouseLocation: 'Zone A' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer">
            <Archive className="w-4 h-4" /> Initialize Stock
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Warehouse Stock</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.reduce((sum, item) => sum + (Number(item.totalStock) || 0), 0).toLocaleString()} Units
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Reserved Sales Stock</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.reduce((sum, item) => sum + (Number(item.reservedStock) || 0), 0).toLocaleString()} Units
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Net Available Stock</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.reduce((sum, item) => sum + (Number(item.availableStock) || 0), 0).toLocaleString()} Units
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Inventory Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No inventory found. Initialize stock levels!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Total Stock</th>
                  <th className="px-6 py-4">Reserved Stock</th>
                  <th className="px-6 py-4">Net Available Stock</th>
                  <th className="px-6 py-4">Warehouse Location</th>
                  <th className="px-6 py-4">Last Sync</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.product}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold">
                      {item.totalStock.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.reservedStock.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-bold text-terracotta-600">
                      {item.availableStock.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.warehouseLocation || 'N/A'}
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-xs">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '--'}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Stock Level' : 'Initialize Stock Level'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Product</label>
                <select value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                  <option>Standard Clay Brick</option>
                  <option>Fly Ash Brick</option>
                  <option>Refractory Fire Brick</option>
                  <option>Concrete Hollow Block</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Stock</label>
                  <input required value={formData.totalStock} onChange={e => setFormData({...formData, totalStock: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="100000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reserved Stock</label>
                  <input required value={formData.reservedStock} onChange={e => setFormData({...formData, reservedStock: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="15000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Warehouse location / Bay</label>
                <input required value={formData.warehouseLocation} onChange={e => setFormData({...formData, warehouseLocation: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Zone B, Shelf 4" />
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Stock' : 'Initialize Stock'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}