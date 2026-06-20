import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { PlusCircle, Search, Filter, Check, MoreHorizontal, Edit, Trash2, X } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const efficiencyData = [
  { value: 800 },
  { value: 810 },
  { value: 790 },
  { value: 820 },
  { value: 815 },
  { value: 835 },
  { value: 842 },
];

export default function AdminProduction() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    batchId: '',
    rawMaterial: 0,
    bricksShaped: 0,
    bricksFired: 0,
    qcPassed: 'Pending',
    rejectionRate: 0,
    status: 'MIXING'
  });

  const fetchProductions = async () => {
    try {
      const data = await apiFetch('/production');
      setProductions(data);
    } catch (error) {
      console.error('Failed to fetch productions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/production/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/production', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        batchId: '',
        rawMaterial: 0,
        bricksShaped: 0,
        bricksFired: 0,
        qcPassed: 'Pending',
        rejectionRate: 0,
        status: 'MIXING'
      });
      fetchProductions();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (prod, e) => {
    e.stopPropagation();
    setFormData({
      date: prod.date,
      batchId: prod.batchId,
      rawMaterial: prod.rawMaterial,
      bricksShaped: prod.bricksShaped,
      bricksFired: prod.bricksFired,
      qcPassed: prod.qcPassed,
      rejectionRate: prod.rejectionRate,
      status: prod.status
    });
    setEditingId(prod._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await apiFetch(`/production/${id}`, { method: 'DELETE' });
      fetchProductions();
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': case 'READY': return 'bg-green-100 text-green-700';
      case 'FIRING': case 'MIXING': case 'SHAPING': case 'DRYING': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const latestProduction = productions.length > 0 ? productions[0] : null;

  const getStepIndex = (status) => {
    const mapping = {
      'MIXING': 1,
      'SHAPING': 2,
      'DRYING': 3,
      'FIRING': 4,
      'QC INSPECTION': 5,
      'READY': 6,
      'COMPLETED': 6
    };
    return mapping[status] || 1;
  };

  const latestStep = latestProduction ? getStepIndex(latestProduction.status) : 1;
  const progressPercent = latestProduction ? ((latestStep - 1) / 5) * 100 : 0;
  const progressWidth = `${progressPercent}%`;

  const totalRawMaterial = productions.reduce((sum, p) => sum + (Number(p.rawMaterial) || 0), 0);
  const totalBricksShaped = productions.reduce((sum, p) => sum + (Number(p.bricksShaped) || 0), 0);
  const avgEfficiency = totalRawMaterial > 0 ? Math.round(totalBricksShaped / totalRawMaterial) : 0;

  const efficiencyChartData = productions.length > 0
    ? [...productions].reverse().map(p => ({
        value: p.rawMaterial > 0 ? Math.round(p.bricksShaped / p.rawMaterial) : 0,
        date: p.date
      }))
    : [{ value: 0 }];

  const steps = ['MIXING', 'SHAPING', 'DRYING', 'FIRING', 'QC INSPECTION', 'READY'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Daily Production Log</h2>
          <p className="text-gray-500 text-sm">Monitor unit efficiency and output quality across all active batches.</p>
        </div>
        <button onClick={() => {
            setEditingId(null);
            setFormData({
              date: new Date().toISOString().split('T')[0],
              batchId: '', rawMaterial: 0, bricksShaped: 0, bricksFired: 0,
              qcPassed: 'Pending', rejectionRate: 0, status: 'MIXING'
            });
            setShowModal(true);
        }} className="flex items-center gap-2 bg-terracotta-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
          <PlusCircle className="w-4 h-4" /> Log New Production
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Batch Tracker */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase">
              Current Batch Tracker: {latestProduction ? latestProduction.batchId : 'No Batch Active'}
            </h3>
          </div>
          
          <div className="relative flex justify-between items-center w-full px-4 text-[10px] font-bold text-gray-400 tracking-wider">
            {/* Connecting Lines */}
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-100 -z-10">
              <div className="h-full bg-terracotta-600 transition-all duration-500" style={{ width: progressWidth }}></div>
            </div>

            {/* Steps */}
            {steps.map((stepName, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < latestStep;
              const isActive = stepNum === latestStep;
              return (
                <div key={stepName} className="flex flex-col gap-3 items-center">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white flex items-center justify-center border-4 border-white shadow-sm ring-2 ring-terracotta-100">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : isActive ? (
                    <div className="w-8 h-8 rounded-full bg-white text-terracotta-600 flex items-center justify-center border-2 border-terracotta-600 shadow-sm ring-4 ring-terracotta-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                      <Check className="w-4 h-4 opacity-50" />
                    </div>
                  )}
                  <span className={isActive ? "text-terracotta-600" : isCompleted ? "text-brown-900" : ""}>{stepName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Efficiency Rate */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Efficiency Rate</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-3xl font-black text-brown-900">{avgEfficiency}</h2>
            <span className="text-gray-500 font-medium text-sm">bricks/ton</span>
          </div>
          <div className="h-16 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#e25822" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#e25822" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#e25822" strokeWidth={2} fill="url(#colorEff)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex gap-4 items-center">
            <select className="bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-terracotta-500 shadow-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
            <div className="h-6 w-px bg-gray-200"></div>
            <select className="bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-terracotta-500 shadow-sm">
              <option>All Batch Statuses</option>
              <option>Completed</option>
              <option>Firing</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-brown-900 transition-colors">Clear</button>
            <button className="px-5 py-2 text-sm font-bold bg-terracotta-100 text-terracotta-700 rounded-lg hover:bg-terracotta-200 transition-colors">Apply Filters</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold tracking-wider text-[11px] uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Batch ID</th>
                <th className="px-6 py-4 text-center">Raw Material (Tons)</th>
                <th className="px-6 py-4 text-center">Bricks Shaped</th>
                <th className="px-6 py-4 text-center">Bricks Fired</th>
                <th className="px-6 py-4 text-center">QC Passed</th>
                <th className="px-6 py-4 text-center">Rejection Rate</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading production records...</td></tr>
              ) : productions.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-4 text-center text-gray-500">No production records found.</td></tr>
              ) : (
                productions.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-brown-900">{log.date}</td>
                    <td className="px-6 py-4 font-bold text-terracotta-600">{log.batchId}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{log.rawMaterial}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{log.bricksShaped.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{log.bricksFired.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-center ${log.qcPassed === 'Pending' ? 'text-green-500' : 'text-green-600 font-bold'}`}>{log.qcPassed}</td>
                    <td className="px-6 py-4 text-center text-red-500">{log.rejectionRate}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-3">
                         <button onClick={(e) => handleEditClick(log, e)} className="text-blue-500 hover:text-blue-700">
                            <Edit className="w-4 h-4" />
                         </button>
                         <button onClick={(e) => handleDelete(log._id, e)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="px-6 py-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 bg-gray-50/30">
          <span>Showing 1 to 5 of 48 entries</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-400 bg-white">&lt;</button>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-white bg-terracotta-600 font-medium shadow-sm">1</button>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-600 bg-white hover:bg-gray-50">2</button>
            <button className="px-2.5 py-1 border border-gray-200 rounded text-gray-600 bg-white hover:bg-gray-50">3</button>
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-600 bg-white hover:bg-gray-50">&gt;</button>
          </div>
        </div>

      </div>

      {/* Add/Edit Production Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Production' : 'Log New Production'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch ID</label>
                  <input required value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="#B205" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Raw Material (Tons)</label>
                  <input required min="0" step="0.1" value={formData.rawMaterial} onChange={e => setFormData({...formData, rawMaterial: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bricks Shaped</label>
                  <input required min="0" value={formData.bricksShaped} onChange={e => setFormData({...formData, bricksShaped: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bricks Fired</label>
                  <input required min="0" value={formData.bricksFired} onChange={e => setFormData({...formData, bricksFired: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">QC Passed</label>
                  <input required value={formData.qcPassed} onChange={e => setFormData({...formData, qcPassed: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="125,000 or Pending" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rejection Rate (%)</label>
                  <input required min="0" max="100" step="0.01" value={formData.rejectionRate} onChange={e => setFormData({...formData, rejectionRate: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>MIXING</option>
                    <option>SHAPING</option>
                    <option>DRYING</option>
                    <option>FIRING</option>
                    <option>QC INSPECTION</option>
                    <option>READY</option>
                    <option>COMPLETED</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Production' : 'Save Production'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
