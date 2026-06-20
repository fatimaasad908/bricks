import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, ClipboardList } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminSalesOrders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    orderNumber: '',
    customer: '',
    productName: 'Standard Clay Brick',
    quantity: '',
    unitPrice: 20,
    paymentStatus: 'Unpaid',
    deliveryStatus: 'Pending',
    orderDate: ''
  });

  const getOrderTotal = (item) => {
    if (!item) return 0;
    const amount = Number(item.totalAmount);
    if (isNaN(amount)) {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || (item.products && item.products[0] && Number(item.products[0].unitPrice)) || 0;
      return qty * price;
    }
    return amount;
  };

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/sales-orders');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch sales orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qtyVal = Number(formData.quantity) || 0;
    const priceVal = Number(formData.unitPrice) || 0;
    const amountVal = qtyVal * priceVal;

    const payload = {
      orderNumber: formData.orderNumber,
      customer: formData.customer,
      products: [{
        productName: formData.productName,
        quantity: qtyVal,
        unitPrice: priceVal
      }],
      quantity: qtyVal,
      totalAmount: amountVal,
      paymentStatus: formData.paymentStatus,
      deliveryStatus: formData.deliveryStatus,
      orderDate: formData.orderDate ? new Date(formData.orderDate) : new Date()
    };

    try {
      if (editingId) {
        await apiFetch(`/sales-orders/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/sales-orders', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ orderNumber: '', customer: '', productName: 'Standard Clay Brick', quantity: '', unitPrice: 20, paymentStatus: 'Unpaid', deliveryStatus: 'Pending', orderDate: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    const firstProduct = (item.products && item.products[0]) || { productName: 'Standard Clay Brick', quantity: item.quantity, unitPrice: 20 };
    
    setFormData({
      orderNumber: item.orderNumber,
      customer: item.customer,
      productName: firstProduct.productName,
      quantity: firstProduct.quantity,
      unitPrice: firstProduct.unitPrice,
      paymentStatus: item.paymentStatus,
      deliveryStatus: item.deliveryStatus,
      orderDate: item.orderDate ? new Date(item.orderDate).toISOString().split('T')[0] : ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this sales order?')) return;
    
    try {
      await apiFetch(`/sales-orders/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Sales Orders & Dispatch Tracking</h2>
          <p className="text-gray-500 text-sm">Create customer sales orders, track delivery dispatches, and check payment status</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setEditingId(null); setFormData({ orderNumber: 'SO-' + Date.now().toString().slice(-4), customer: '', productName: 'Standard Clay Brick', quantity: '', unitPrice: 20, paymentStatus: 'Unpaid', deliveryStatus: 'Pending', orderDate: new Date().toISOString().split('T')[0] }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <ClipboardList className="w-4 h-4" /> Book New Order
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders Booked</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Dispatches</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Shipped').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sales Revenue</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + getOrderTotal(item), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Sales ledger</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No sales orders found. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Delivery Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                          {item.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400">{item.orderDate ? new Date(item.orderDate).toLocaleDateString() : '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.customer}
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs font-semibold">
                      {(item.products && item.products[0]?.productName) || 'Standard Clay Brick'}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      {(Number(item.quantity) || 0).toLocaleString()} Units
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {getOrderTotal(item).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold
                        ${item.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : item.paymentStatus === 'Partial' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}
                      `}>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.deliveryStatus === 'Delivered' ? 'bg-green-50 text-green-700' : item.deliveryStatus === 'Shipped' ? 'bg-blue-50 text-blue-700' : item.deliveryStatus === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.deliveryStatus === 'Delivered' ? 'bg-green-500' : item.deliveryStatus === 'Shipped' ? 'bg-blue-500' : item.deliveryStatus === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Sales Order' : 'Book Sales Order'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order Number</label>
                  <input required value={formData.orderNumber} onChange={e => setFormData({...formData, orderNumber: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="SO-101" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order Date</label>
                  <input required value={formData.orderDate} onChange={e => setFormData({...formData, orderDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer / Agency Name</label>
                <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Kashif Contractors / Allied Co." />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
                <span className="block text-xs font-bold text-gray-400 uppercase">Product Item</span>
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Select Brick Variant</label>
                  <select value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} className="w-full px-3 py-1.5 border rounded-lg bg-white outline-none text-xs">
                    <option>Standard Clay Brick</option>
                    <option>Fly Ash Brick</option>
                    <option>Refractory Fire Brick</option>
                    <option>Concrete Hollow Block</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Quantity (Units)</label>
                    <input required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} type="number" className="w-full px-3 py-1.5 border rounded-lg bg-white outline-none text-xs" placeholder="10000" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Unit Price (₨)</label>
                    <input required value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: e.target.value})} type="number" className="w-full px-3 py-1.5 border rounded-lg bg-white outline-none text-xs" placeholder="20" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Status</label>
                  <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Unpaid</option>
                    <option>Partial</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Status</label>
                  <select value={formData.deliveryStatus} onChange={e => setFormData({...formData, deliveryStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {formData.quantity && formData.unitPrice && (
                <div className="pt-2 text-right">
                  <span className="text-xs text-gray-500 font-bold">Estimated Total Amount: </span>
                  <span className="text-sm font-extrabold text-terracotta-600 font-mono">₨ {(Number(formData.quantity) * Number(formData.unitPrice)).toLocaleString()}</span>
                </div>
              )}

              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Order Details' : 'Book Order'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
