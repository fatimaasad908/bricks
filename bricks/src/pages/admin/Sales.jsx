import { useState, useEffect } from 'react';
import { ShoppingCart, Edit, Trash2, X } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    customer: '',
    qty: '',
    amount: '',
    status: 'Pending'
  });

  const fetchSales = async () => {
    try {
      const data = await apiFetch('/sales');
      setSales(data);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/sales/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/sales', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        orderId: '', customer: '', qty: '', amount: '', status: 'Pending'
      });
      fetchSales();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (sale, e) => {
    e.stopPropagation();
    setFormData({
      orderId: sale.orderId,
      customer: sale.customer,
      qty: sale.qty,
      amount: sale.amount,
      status: sale.status
    });
    setEditingId(sale._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await apiFetch(`/sales/${id}`, { method: 'DELETE' });
      fetchSales();
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Dispatched': case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'In Production': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (val) => {
    return '₨ ' + val.toLocaleString();
  };
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-brown-900 mb-1">Sales & Orders</h2>
           <p className="text-gray-500 text-sm">Manage bulk orders, clients, and dispatch statuses.</p>
        </div>
        <button onClick={() => {
            setEditingId(null);
            setFormData({ orderId: '', customer: '', qty: '', amount: '', status: 'Pending' });
            setShowModal(true);
        }} className="flex items-center gap-2 bg-terracotta-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm">
          <ShoppingCart className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4 text-right">Value (PKR)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading orders...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-5 font-bold text-terracotta-600">{sale.orderId}</td>
                    <td className="px-6 py-5 font-bold text-brown-900">{sale.customer}</td>
                    <td className="px-6 py-5 text-center text-gray-600 font-semibold">{sale.qty.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right font-bold text-brown-900">{formatCurrency(sale.amount)}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase ${getStatusColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button onClick={(e) => handleEditClick(sale, e)} className="text-blue-500 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={(e) => handleDelete(sale._id, e)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Order' : 'New Order'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order ID</label>
                <input required value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="ORD-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Client Name</label>
                <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Al-Kabir Developers" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                  <input required min="1" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (PKR)</label>
                  <input required min="0.01" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                  <option>Pending</option>
                  <option>In Production</option>
                  <option>Dispatched</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Order' : 'Save Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
