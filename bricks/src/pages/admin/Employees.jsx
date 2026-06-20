import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Contact } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminEmployees() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    employeeName: '',
    role: '',
    department: 'Operations',
    salary: '',
    joiningDate: '',
    shift: 'Day Shift',
    status: 'Active',
    contactDetails: ''
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/employees');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
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
        await apiFetch(`/employees/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/employees', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ employeeName: '', role: '', department: 'Operations', salary: '', joiningDate: '', shift: 'Day Shift', status: 'Active', contactDetails: '' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      employeeName: item.employeeName,
      role: item.role,
      department: item.department,
      salary: item.salary,
      joiningDate: item.joiningDate ? new Date(item.joiningDate).toISOString().split('T')[0] : '',
      shift: item.shift || 'Day Shift',
      status: item.status,
      contactDetails: item.contactDetails || ''
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this employee record?')) return;
    
    try {
      await apiFetch(`/employees/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Human Resources (HR) & Employees</h2>
          <p className="text-gray-500 text-sm">Manage company administrative roles, salaries, contract updates, and shifts</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={['Employee Name', 'Role', 'Department', 'Salary', 'Joining Date', 'Shift', 'Status', 'Contact Details']}
            keys={['employeeName', 'role', 'department', 'salary', 'joiningDate', 'shift', 'status', 'contactDetails']}
            title="Employees CRM Export"
            filename="employees_crm_export"
          />
          <button onClick={() => { setEditingId(null); setFormData({ employeeName: '', role: '', department: 'Operations', salary: '', joiningDate: new Date().toISOString().split('T')[0], shift: 'Day Shift', status: 'Active', contactDetails: '' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <UserPlus className="w-4 h-4" /> Onboard Employee
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Staff</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status === 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">On Leave / Terminated</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.status !== 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Staff Payroll</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + (Number(item.salary) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Staff Roster</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading employees...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No employees found. Onboard one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4">Shift & Contacts</th>
                  <th className="px-6 py-4">Monthly Salary</th>
                  <th className="px-6 py-4">Joining Date</th>
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
                          {item.employeeName}
                        </span>
                        <span className="text-xs text-gray-400">Dept: {item.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.role}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      <div className="flex flex-col text-xs">
                        <span>{item.shift}</span>
                        <span>Contact: {item.contactDetails || '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {Number(item.salary).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.joiningDate ? new Date(item.joiningDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.status === 'Active' ? 'bg-green-50 text-green-700' : item.status === 'On Leave' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-500' : item.status === 'On Leave' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
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
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Employee Details' : 'Onboard New Employee'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input required value={formData.employeeName} onChange={e => setFormData({...formData, employeeName: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Kamran Shah" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role / Designation</label>
                  <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Supervisor" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Operations</option>
                    <option>Logistics</option>
                    <option>Finance</option>
                    <option>HR & Management</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Salary (₨)</label>
                  <input required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="75000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Joining Date</label>
                  <input required value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Shift</label>
                  <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Morning Shift</option>
                    <option>Evening Shift</option>
                    <option>Night Shift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Terminated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Details</label>
                <input value={formData.contactDetails} onChange={e => setFormData({...formData, contactDetails: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Tel/Email e.g. +92 321 9876543" />
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Employee' : 'Onboard Employee'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
