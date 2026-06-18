import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminQualityControl() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    batchReference: '',
    strengthTest: '30 MPa',
    absorptionRate: '8%',
    defectPercentage: '',
    inspectionDate: '',
    remarks: '',
    passFailStatus: 'Pass'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/quality-control');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch quality control records:', error);
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
        await apiFetch(`/quality-control/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/quality-control', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ batchReference: '', strengthTest: '30 MPa', absorptionRate: '8%', defectPercentage: '', inspectionDate: '', remarks: '', passFailStatus: 'Pass' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      batchReference: item.batchReference,
      strengthTest: item.strengthTest || '30 MPa',
      absorptionRate: item.absorptionRate || '8%',
      defectPercentage: item.defectPercentage,
      inspectionDate: item.inspectionDate ? new Date(item.inspectionDate).toISOString().split('T')[0] : '',
      remarks: item.remarks || '',
      passFailStatus: item.passFailStatus
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this QC inspection record?')) return;
    
    try {
      await apiFetch(`/quality-control/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.batchReference.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.remarks && i.remarks.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Quality Control (QC) & Inspection</h2>
          <p className="text-gray-500 text-sm">Record brick batch strength testing, liquid absorption rates, defect rates, and pass/fail audits</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ batchReference: 'PB-' + Date.now().toString().slice(-4), strengthTest: '30 MPa', absorptionRate: '8%', defectPercentage: '0.5', inspectionDate: new Date().toISOString().split('T')[0], remarks: '', passFailStatus: 'Pass' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <ShieldCheck className="w-4 h-4" /> File Inspection Report
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Passed Inspections</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.passFailStatus === 'Pass').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <X className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Failed Audits</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.passFailStatus === 'Fail').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Average Defect rate</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.length > 0 ? (items.reduce((sum, item) => sum + (Number(item.defectPercentage) || 0), 0) / items.length).toFixed(2) : '0.0'}%
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">QC Inspection logs</h3>
          <input 
            type="text" 
            placeholder="Search batches..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading records...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No QC inspection logs found. Add one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Batch Reference</th>
                  <th className="px-6 py-4">Inspection Date</th>
                  <th className="px-6 py-4">Compressive Strength</th>
                  <th className="px-6 py-4">Water Absorption</th>
                  <th className="px-6 py-4">Defect Rate</th>
                  <th className="px-6 py-4">Inspection Remarks</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.batchReference}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.inspectionDate ? new Date(item.inspectionDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold">
                      {item.strengthTest || '30 MPa'}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.absorptionRate || '8%'}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      {item.defectPercentage || 0}%
                    </td>
                    <td className="px-6 py-5 text-gray-400 font-medium max-w-[200px] truncate">
                      {item.remarks || '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.passFailStatus === 'Pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.passFailStatus === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {item.passFailStatus}
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Inspection Data' : 'Record Quality Audit'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Reference</label>
                  <input required value={formData.batchReference} onChange={e => setFormData({...formData, batchReference: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="PB-302" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inspection Date</label>
                  <input required value={formData.inspectionDate} onChange={e => setFormData({...formData, inspectionDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Strength Test (MPa)</label>
                  <input required value={formData.strengthTest} onChange={e => setFormData({...formData, strengthTest: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="32 MPa" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Absorption Rate (%)</label>
                  <input required value={formData.absorptionRate} onChange={e => setFormData({...formData, absorptionRate: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="7.5%" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Defect Percentage (%)</label>
                  <input required value={formData.defectPercentage} onChange={e => setFormData({...formData, defectPercentage: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="1.2" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pass / Fail Status</label>
                  <select value={formData.passFailStatus} onChange={e => setFormData({...formData, passFailStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Pass</option>
                    <option>Fail</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inspection Remarks</label>
                <textarea rows="2" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none resize-none" placeholder="Structural integrity verified..."></textarea>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Report' : 'Save Report'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
