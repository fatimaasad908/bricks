import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, ShoppingBag } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminPurchaseOrders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    poNumber: '',
    supplier: '',
    materialName: 'High Grade Clay',
    quantity: '',
    costPerUnit: '1200',
    deliveryStatus: 'Pending',
    orderDate: ''
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/purchase-orders');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qtyVal = Number(formData.quantity);
    const costVal = Number(formData.costPerUnit);
    const totalVal = qtyVal * costVal;

    const payload = {
      poNumber: formData.poNumber,
      supplier: formData.supplier,
      materials: [{
        materialName: formData.materialName,
        quantity: qtyVal,
        costPerUnit: costVal
      }],
      quantity: qtyVal,
      totalAmount: totalVal,
      deliveryStatus: formData.deliveryStatus,
      orderDate: formData.orderDate ? new Date(formData.orderDate) : new Date()
    };

    try {
      if (editingId) {
        await apiFetch(`/purchase-orders/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/purchase-orders', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ poNumber: '', supplier: '', materialName: 'High Grade Clay', quantity: '', costPerUnit: '1200', deliveryStatus: 'Pending', orderDate: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    const firstMat = (item.materials && item.materials[0]) || { materialName: 'High Grade Clay', quantity: item.quantity, costPerUnit: 1200 };
    setFormData({
      poNumber: item.poNumber,
      supplier: item.supplier,
      materialName: firstMat.materialName,
      quantity: firstMat.quantity,
      costPerUnit: firstMat.costPerUnit,
      deliveryStatus: item.deliveryStatus,
      orderDate: item.orderDate ? new Date(item.orderDate).toISOString().split('T')[0] : ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;
    
    try {
      await apiFetch(`/purchase-orders/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Purchase Orders (Procurement)</h2>
          <p className="text-gray-500 text-sm">Issue procurement purchase orders for raw materials to active mining and cement suppliers</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ poNumber: 'PO-' + Date.now().toString().slice(-4), supplier: '', materialName: 'High Grade Clay', quantity: '', costPerUnit: '1200', deliveryStatus: 'Pending', orderDate: new Date().toISOString().split('T')[0] }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <ShoppingBag className="w-4 h-4" /> Issue Purchase Order
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Received Shipments</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.deliveryStatus === 'Received').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Arrivals</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              {items.filter(i => i.deliveryStatus === 'Pending' || i.deliveryStatus === 'Shipped').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Procurement Outflow</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Procurement manifest</h3>
          <input 
            type="text" 
            placeholder="Search POs..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading purchase orders...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No purchase orders found. Issue one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">PO Number</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Material Items</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Total Quantity</th>
                  <th className="px-6 py-4">Total Cost</th>
                  <th className="px-6 py-4">Arrival Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.poNumber}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-semibold">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs font-semibold">
                      {(item.materials && item.materials[0]?.materialName) || 'Raw Clay'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.orderDate ? new Date(item.orderDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      {item.quantity.toLocaleString()} Tons/Bags
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {Number(item.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.deliveryStatus === 'Received' ? 'bg-green-50 text-green-700' : item.deliveryStatus === 'Shipped' ? 'bg-blue-50 text-blue-700' : item.deliveryStatus === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.deliveryStatus === 'Received' ? 'bg-green-500' : item.deliveryStatus === 'Shipped' ? 'bg-blue-500' : item.deliveryStatus === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        {item.deliveryStatus}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Purchase Order' : 'Issue Purchase Order'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PO Number</label>
                  <input required value={formData.poNumber} onChange={e => setFormData({...formData, poNumber: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="PO-501" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order Date</label>
                  <input required value={formData.orderDate} onChange={e => setFormData({...formData, orderDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Supplier / Mining Agency</label>
                <input required value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Allied Minerals Co." />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
                <span className="block text-xs font-bold text-gray-400 uppercase">Material Specifications</span>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Select Raw Material</label>
                  <select value={formData.materialName} onChange={e => setFormData({...formData, materialName: e.target.value})} className="w-full px-3 py-1.5 border rounded-lg bg-white outline-none text-xs">
                    <option>High Grade Clay</option>
                    <option>Fine Silica Sand</option>
                    <option>Crushed Coal</option>
                    <option>OPC Cement Bags</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Quantity (Tons/Bags)</label>
                    <input required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} type="number" className="w-full px-3 py-1.5 border rounded-lg bg-white outline-none text-xs" placeholder="150" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Cost Per Unit (₨)</label>
                    <input required value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: e.target.value})} type="number" className="w-full px-3 py-1.5 border rounded-lg bg-white outline-none text-xs" placeholder="1200" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Arrival / Delivery Status</label>
                <select value={formData.deliveryStatus} onChange={e => setFormData({...formData, deliveryStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Received</option>
                  <option>Cancelled</option>
                </select>
              </div>

              {formData.quantity && formData.costPerUnit && (
                <div className="pt-2 text-right">
                  <span className="text-xs text-gray-500 font-bold">Estimated Cost Total: </span>
                  <span className="text-sm font-extrabold text-terracotta-600 font-mono">₨ {(Number(formData.quantity) * Number(formData.costPerUnit)).toLocaleString()}</span>
                </div>
              )}

              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Purchase Order' : 'Issue Purchase Order'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
