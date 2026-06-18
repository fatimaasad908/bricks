import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, RefreshCcw, Edit, Trash2, X, Plus } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminFinance() {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'Income',
    amount: ''
  });

  const fetchFinances = async () => {
    try {
      const data = await apiFetch('/finance');
      setFinances(data);
    } catch (error) {
      console.error('Failed to fetch finances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/finance/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/finance', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'Income',
        amount: ''
      });
      fetchFinances();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (txn, e) => {
    e.stopPropagation();
    setFormData({
      transactionId: txn.transactionId,
      date: txn.date,
      description: txn.description,
      type: txn.type,
      amount: txn.amount
    });
    setEditingId(txn._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await apiFetch(`/finance/${id}`, { method: 'DELETE' });
      fetchFinances();
    } catch (error) {
      alert(error.message);
    }
  };

  const totalIncome = finances.filter(f => f.type === 'Income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = finances.filter(f => f.type === 'Expense').reduce((sum, f) => sum + f.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const formatCurrency = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '₨ 0';
    return '₨ ' + val.toLocaleString();
  };
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Financial Overview</h2>
          <p className="text-gray-500 text-sm">Track income, expenses, and pending dues in PKR.</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setFormData({
            transactionId: '', date: new Date().toISOString().split('T')[0],
            description: '', type: 'Income', amount: ''
          });
          setShowModal(true);
        }} className="flex items-center gap-2 bg-terracotta-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Record Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
             <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Net Balance</p>
          <h3 className="text-3xl font-bold text-brown-900">{formatCurrency(netBalance)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
             <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Total Income</p>
          <h3 className="text-3xl font-bold text-brown-900">{formatCurrency(totalIncome)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
             <TrendingDown className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold text-brown-900">{formatCurrency(totalExpenses)}</h3>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Recent Transactions</h3>
          <button onClick={fetchFinances} className="text-terracotta-600 hover:text-terracotta-700 text-xs font-bold flex items-center gap-1"><RefreshCcw className="w-3 h-3"/> Sync</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading finances...</td></tr>
              ) : finances.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No transactions found.</td></tr>
              ) : (
                finances.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-gray-500 font-medium">{txn.date}</td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-brown-900 block">{txn.description}</span>
                      <span className="text-[10px] text-gray-400">{txn.transactionId}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase
                        ${txn.type === 'Income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                      `}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`px-6 py-5 text-right font-bold ${txn.type === 'Income' ? 'text-green-600' : 'text-brown-900'}`}>
                      {txn.type === 'Income' ? '+' : '-'} {formatCurrency(txn.amount)}
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button onClick={(e) => handleEditClick(txn, e)} className="text-blue-500 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={(e) => handleDelete(txn._id, e)} className="text-red-500 hover:text-red-700">
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

      {/* Add/Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Transaction' : 'Record Transaction'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction ID</label>
                <input required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="TXN-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Payment received..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Income</option>
                    <option>Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (PKR)</label>
                  <input required min="0.01" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
