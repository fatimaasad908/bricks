import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Zap } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../../utils/api';

export default function AdminEnergyConsumption() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    month: '2026-05',
    energyType: 'Electricity',
    quantityConsumed: '',
    cost: ''
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/energy-consumption');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch energy consumptions:', error);
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
        await apiFetch(`/energy-consumption/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/energy-consumption', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ month: '2026-05', energyType: 'Electricity', quantityConsumed: '', cost: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      month: item.month,
      energyType: item.energyType,
      quantityConsumed: item.quantityConsumed,
      cost: item.cost
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this energy consumption entry?')) return;
    
    try {
      await apiFetch(`/energy-consumption/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.energyType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.month.includes(searchTerm)
  );

  // Analytics preparation
  const chartData = items.slice().reverse().map(item => ({
    name: item.month + ' (' + item.energyType.substring(0, 3) + ')',
    cost: item.cost / 1000, // In Thousands
    quantity: item.quantityConsumed
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Energy Monitoring & Efficiency</h2>
          <p className="text-gray-500 text-sm">Track electricity, gas, coal, diesel costs, and efficiency ratios for kilns</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ month: '2026-05', energyType: 'Electricity', quantityConsumed: '', cost: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Zap className="w-4 h-4" /> Log Energy usage
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-brown-900 mb-4">Energy cost trends (₨ Thousands)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e25822" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e25822" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#e25822" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-brown-900 mb-4">Consumption volume levels</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="quantity" fill="#c14618" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Energy Outlay</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Logs Entered</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">idx</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Efficiency Ratio</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.length > 0 ? (items.reduce((sum, item) => sum + (Number(item.efficiencyRatio) || 0), 0) / items.length).toFixed(1) : '0.0'} / Unit
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Energy Ledger</h3>
          <input 
            type="text" 
            placeholder="Search fuel/month..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading energy consumptions...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No logs found. Enter utility usage!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Resource Month</th>
                  <th className="px-6 py-4">Energy Fuel Type</th>
                  <th className="px-6 py-4">Volume Consumed</th>
                  <th className="px-6 py-4">Utility Cost</th>
                  <th className="px-6 py-4">Cost Efficiency Index</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.month}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-semibold">
                      {item.energyType}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      {item.quantityConsumed.toLocaleString()} {item.energyType === 'Electricity' ? 'kWh' : item.energyType === 'Gas' ? 'MMBtu' : 'Liters'}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {Number(item.cost).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-terracotta-600 font-bold text-xs uppercase">
                      ₨ {item.efficiencyRatio || '--'} / Resource Unit
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Energy Log' : 'Log Energy usage'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Billing Month</label>
                  <input required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="2026-05" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Energy Type</label>
                  <select value={formData.energyType} onChange={e => setFormData({...formData, energyType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white">
                    <option>Electricity</option>
                    <option>Gas</option>
                    <option>Diesel</option>
                    <option>Coal</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Volume Consumed</label>
                  <input required value={formData.quantityConsumed} onChange={e => setFormData({...formData, quantityConsumed: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="45000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost incurred (₨)</label>
                  <input required value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="280000" />
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Log' : 'Save Energy Log'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
