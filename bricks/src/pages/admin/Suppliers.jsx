import { useState, useEffect } from 'react';
import { Truck, Plus, Package, X, Star, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    vendorName: '',
    supplierId: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    primaryCategory: 'River Sand',
    supplyType: 'Raw Material',
    qualityRating: 5,
    status: 'Active',
    lastDeliveryDate: '',
    deliveryFrequency: 'Weekly',
    notes: ''
  });

  const fetchSuppliers = async () => {
    try {
      const data = await apiFetch('/suppliers');
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await apiFetch(`/suppliers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        alert('Supplier successfully updated!');
      } else {
        await apiFetch('/suppliers', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        alert('Supplier successfully added!');
      }
      setShowModal(false);
      setEditingId(null);
      
      // Reset form
      setFormData({
        vendorName: '', supplierId: '', companyName: '', contactPerson: '',
        email: '', phone: '', address: '', primaryCategory: 'River Sand',
        supplyType: 'Raw Material', qualityRating: 5, status: 'Active',
        lastDeliveryDate: '', deliveryFrequency: 'Weekly', notes: ''
      });
      
      fetchSuppliers();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (supplier, e) => {
    e.stopPropagation();
    setFormData({
      vendorName: supplier.vendorName,
      supplierId: supplier.supplierId,
      companyName: supplier.companyName,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      primaryCategory: supplier.primaryCategory,
      supplyType: supplier.supplyType,
      qualityRating: supplier.qualityRating,
      status: supplier.status,
      lastDeliveryDate: supplier.lastDeliveryDate,
      deliveryFrequency: supplier.deliveryFrequency,
      notes: supplier.notes
    });
    setEditingId(supplier._id);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await apiFetch(`/suppliers/${id}`, { method: 'DELETE' });
      fetchSuppliers();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.companyName && s.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.primaryCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.contactPerson && s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportHeaders = ['Supplier ID', 'Vendor Name', 'Company Name', 'Contact Person', 'Email', 'Phone', 'Address', 'Primary Category', 'Supply Type', 'Quality Rating', 'Status', 'Delivery Frequency', 'Last Delivery Date'];
  const exportKeys = ['supplierId', 'vendorName', 'companyName', 'contactPerson', 'email', 'phone', 'address', 'primaryCategory', 'supplyType', 'qualityRating', 'status', 'deliveryFrequency', 'lastDeliveryDate'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Supplier Network</h2>
          <p className="text-gray-500 text-sm">Manage raw material vendors and transport partners.</p>
        </div>
        <div className="flex gap-3 items-center">
          <ExportButton 
            filteredData={filteredSuppliers}
            allData={suppliers}
            headers={exportHeaders}
            keys={exportKeys}
            title="Supplier Network Export"
            filename="suppliers"
          />
          <button 
            onClick={() => { 
              setEditingId(null); 
              setFormData({
                vendorName: '', supplierId: '', companyName: '', contactPerson: '',
                email: '', phone: '', address: '', primaryCategory: 'River Sand',
                supplyType: 'Raw Material', qualityRating: 5, status: 'Active',
                lastDeliveryDate: '', deliveryFrequency: 'Weekly', notes: ''
              });
              setShowModal(true); 
            }}
            className="flex items-center gap-2 bg-terracotta-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Important Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Vendors</p>
              <h3 className="text-2xl font-bold text-brown-900">
                {suppliers.filter(s => s.status === 'Active').length}
              </h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Suppliers</p>
              <h3 className="text-2xl font-bold text-brown-900">{suppliers.length}</h3>
            </div>
          </div>
        </div>

        {/* Vendors List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
               <div className="p-8 text-center text-gray-500">Loading suppliers...</div>
            ) : suppliers.length === 0 ? (
               <div className="p-8 text-center text-gray-500">No suppliers found. Click Add Supplier to create one!</div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-4">Vendor Name</th>
                    <th className="px-6 py-4">Primary Category</th>
                    <th className="px-6 py-4">Last Delivery</th>
                    <th className="px-6 py-4 text-center">Quality Rating</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredSuppliers.map((sup) => (
                    <tr key={sup._id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-brown-900">{sup.vendorName}</div>
                        <div className="text-xs text-gray-400">ID: {sup.supplierId} • {sup.companyName}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-semibold text-gray-600">
                          {sup.primaryCategory}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-500 font-medium">{sup.lastDeliveryDate || 'N/A'}</td>
                      <td className="px-6 py-5 text-center flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-brown-900">{sup.qualityRating}</span>
                        <span className="text-xs text-gray-400">/5</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase
                          ${sup.status === 'Active' ? 'bg-green-50 text-green-700' : 
                            sup.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}
                        `}>
                          {sup.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex justify-end gap-3">
                           <button onClick={(e) => handleEditClick(sup, e)} className="text-blue-500 hover:text-blue-700">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={(e) => handleDeleteSupplier(sup._id, e)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Full Supplier Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto flex flex-col max-h-full">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-2xl font-bold text-brown-900">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                <p className="text-gray-500 text-sm mt-1">Enter complete vendor and business details.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide flex-1">
              <form id="supplierForm" onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-terracotta-600 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Vendor Name *</label>
                      <input required name="vendorName" value={formData.vendorName} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" placeholder="E.g., Ravi Sand Miners" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Supplier ID</label>
                      <input name="supplierId" value={formData.supplierId} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" placeholder="Leave empty to auto-generate" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Company Name *</label>
                      <input required name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" placeholder="Legal Company Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Contact Person *</label>
                      <input required name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" placeholder="Full Name" />
                    </div>
                  </div>
                </div>

                {/* 2. Contact Details */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-terracotta-600 uppercase tracking-widest border-b border-gray-100 pb-2">Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Email Address *</label>
                      <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" placeholder="vendor@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Phone Number *</label>
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" placeholder="+1 (234) 567-8900" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Physical Address</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} rows="2" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm resize-none" placeholder="Full street address, City, Zip"></textarea>
                    </div>
                  </div>
                </div>

                {/* 3. Business Details & Performance */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-terracotta-600 uppercase tracking-widest border-b border-gray-100 pb-2">Business & Performance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Primary Category *</label>
                      <select required name="primaryCategory" value={formData.primaryCategory} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm">
                        <option>River Sand</option>
                        <option>Industrial Coal</option>
                        <option>Clay</option>
                        <option>Transport Services</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Supply Type *</label>
                      <select required name="supplyType" value={formData.supplyType} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm">
                        <option>Raw Material</option>
                        <option>Transport</option>
                        <option>Equipment</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Quality Rating</label>
                      <div className="relative">
                         <input name="qualityRating" value={formData.qualityRating} onChange={handleInputChange} type="number" min="1" max="5" step="0.1" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" />
                         <Star className="w-4 h-4 absolute left-3 top-3 text-yellow-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Status *</label>
                      <select required name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm font-semibold">
                        <option className="text-green-600">Active</option>
                        <option className="text-yellow-600">Pending</option>
                        <option className="text-red-600">Blocked</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Delivery Frequency</label>
                      <select name="deliveryFrequency" value={formData.deliveryFrequency} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>On Demand</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Last Delivery</label>
                      <input name="lastDeliveryDate" value={formData.lastDeliveryDate} onChange={handleInputChange} type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm" />
                    </div>
                  </div>
                </div>

                {/* 4. Extras */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-terracotta-600 uppercase tracking-widest border-b border-gray-100 pb-2">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Notes / Description</label>
                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all text-sm resize-none" placeholder="Any internal notes..."></textarea>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-6 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="supplierForm"
                disabled={submitting}
                className="bg-terracotta-600 text-white font-bold text-sm px-8 py-2.5 rounded-xl hover:bg-terracotta-700 transition-colors shadow-lg shadow-terracotta-600/20 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : (editingId ? 'Update Supplier' : 'Save Supplier')}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
