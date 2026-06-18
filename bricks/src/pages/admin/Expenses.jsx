import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Wallet } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminExpenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    category: 'Fuel & Gas',
    amount: '',
    description: '',
    expenseDate: '',
    approvalStatus: 'Pending',
    approvedBy: ''
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/expenses');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
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
        await apiFetch(`/expenses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/expenses', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ category: 'Fuel & Gas', amount: '', description: '', expenseDate: '', approvalStatus: 'Pending', approvedBy: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      category: item.category,
      amount: item.amount,
      description: item.description || '',
      expenseDate: item.expenseDate ? new Date(item.expenseDate).toISOString().split('T')[0] : '',
      approvalStatus: item.approvalStatus,
      approvedBy: item.approvedBy || ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    
    try {
      await apiFetch(`/expenses/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.description && i.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Expense Tracking System</h2>
          <p className="text-gray-500 text-sm">Log and monitor operations expenses, utility bills, fuel, maintenance, and administrative outlays</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ category: 'Fuel & Gas', amount: '', description: '', expenseDate: new Date().toISOString().split('T')[0], approvalStatus: 'Pending', approvedBy: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Wallet className="w-4 h-4" /> Record Expense
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Approved Expenses</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.filter(i => i.approvalStatus === 'Approved').reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.filter(i => i.approvalStatus === 'Pending').reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total outflow booked</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Expense Registry</h3>
          <input 
            type="text" 
            placeholder="Search category or description..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading expenses...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No expenses logged. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Expense category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Expense Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Approved By</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.category}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {Number(item.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs font-semibold max-w-[200px] truncate">
                      {item.description || '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      {item.approvedBy || '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.approvalStatus === 'Approved' ? 'bg-green-50 text-green-700' : item.approvalStatus === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.approvalStatus === 'Approved' ? 'bg-green-500' : item.approvalStatus === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        {item.approvalStatus}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Expense Record' : 'Record Expense'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expense Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                  <option>Fuel & Gas</option>
                  <option>Raw Materials Purchase</option>
                  <option>Electricity & Utility</option>
                  <option>Equipment Maintenance</option>
                  <option>Staff salaries</option>
                  <option>Office & Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₨)</label>
                  <input required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="15000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expense Date</label>
                  <input required value={formData.expenseDate} onChange={e => setFormData({...formData, expenseDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expense Details / Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none resize-none" placeholder="Generator fuel refill..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Approval status</label>
                  <select value={formData.approvalStatus} onChange={e => setFormData({...formData, approvalStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Approved By (Supervisor)</label>
                  <input value={formData.approvedBy} onChange={e => setFormData({...formData, approvedBy: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Admin" />
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Expense' : 'Save Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
