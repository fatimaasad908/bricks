import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Trash2, X, Edit, Users, UserPlus, Eye, 
  ChevronUp, ChevronDown, Calendar, Phone, Mail, MapPin, 
  DollarSign, ArrowUpDown, ChevronLeft, ChevronRight, ShoppingBag, Receipt
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import ExportButton from '../../components/ExportButton';

export default function AdminCustomers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting State
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Customer Details Modal State
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerQuotes, setCustomerQuotes] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState('orders'); // 'orders' or 'quotes'

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: '',
    outstandingBalance: '',
    status: 'Active'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/customers');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure numbers are sent correctly to avoid CastErrors
    const payload = {
      ...formData,
      creditLimit: Number(formData.creditLimit) || 0,
      outstandingBalance: Number(formData.outstandingBalance) || 0
    };

    try {
      if (editingId) {
        await apiFetch(`/customers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/customers', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ customerName: '', phone: '', email: '', address: '', creditLimit: '', outstandingBalance: '', status: 'Active' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      customerName: item.customerName,
      phone: item.phone,
      email: item.email || '',
      address: item.address || '',
      creditLimit: item.creditLimit,
      outstandingBalance: item.outstandingBalance,
      status: item.status
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await apiFetch(`/customers/${id}`, { method: 'DELETE' });
      fetchItems();
      if (selectedCustomer && selectedCustomer._id === id) {
        setShowDetailsModal(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewDetails = async (customer, e) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
    setLoadingHistory(true);
    try {
      // Fetch sales orders and quotes concurrently
      const [allSalesOrders, allQuotes] = await Promise.all([
        apiFetch('/sales-orders').catch(() => []),
        apiFetch('/orders').catch(() => [])
      ]);
      
      const filteredOrders = allSalesOrders.filter(o => 
        o.customer && o.customer.toLowerCase() === customer.customerName.toLowerCase()
      );
      
      const filteredQuotes = allQuotes.filter(q => 
        (q.contactPerson && q.contactPerson.toLowerCase() === customer.customerName.toLowerCase()) ||
        q.phone === customer.phone ||
        (q.email && customer.email && q.email.toLowerCase() === customer.email.toLowerCase())
      );
      
      setCustomerOrders(filteredOrders);
      setCustomerQuotes(filteredQuotes);
    } catch (err) {
      console.error("Failed to load customer history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Search and Filter logic with safety checks
  const filteredItems = items.filter(i => {
    const nameStr = i.customerName || '';
    const phoneStr = i.phone || '';
    const emailStr = i.email || '';
    const addrStr = i.address || '';
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      nameStr.toLowerCase().includes(searchLower) ||
      phoneStr.toLowerCase().includes(searchLower) ||
      emailStr.toLowerCase().includes(searchLower) ||
      addrStr.toLowerCase().includes(searchLower);
      
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (sortField === 'createdAt') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB || '').toLowerCase();
    } else {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    }
    
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Reset page to 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const exportHeaders = ['Customer Name', 'Phone', 'Email', 'Address', 'Credit Limit', 'Outstanding Balance', 'Status'];
  const exportKeys = ['customerName', 'phone', 'email', 'address', 'creditLimit', 'outstandingBalance', 'status'];

  const renderSortArrow = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 ml-1" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-3.5 h-3.5 text-terracotta-600 ml-1 font-bold" /> : 
      <ChevronDown className="w-3.5 h-3.5 text-terracotta-600 ml-1 font-bold" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Customer Accounts (CRM)</h2>
          <p className="text-gray-500 text-sm">Manage credit limits, active outstanding balances, and order histories</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            filteredData={filteredItems}
            allData={items}
            headers={exportHeaders}
            keys={exportKeys}
            title="Customers CRM Export"
            filename="customers_crm"
          />
          <button 
            onClick={() => { 
              setEditingId(null); 
              setFormData({ customerName: '', phone: '', email: '', address: '', creditLimit: '', outstandingBalance: '', status: 'Active' }); 
              setShowModal(true); 
            }} 
            className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add Customer Account
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Accounts</p>
            <h3 className="text-2xl font-bold text-brown-900">{items.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Suspended / Inactive</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(c => c.status !== 'Active').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Outstanding Receivables</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + (Number(item.outstandingBalance) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search, Filter & Page size Controls */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Customer Directory</h3>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 bg-white text-brown-900"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading customers...</div>
          ) : currentItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No customers found matching the criteria.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('customerName')}>
                    <div className="flex items-center">
                      Customer Details {renderSortArrow('customerName')}
                    </div>
                  </th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('creditLimit')}>
                    <div className="flex items-center">
                      Credit Limit {renderSortArrow('creditLimit')}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('outstandingBalance')}>
                    <div className="flex items-center">
                      Outstanding Balance {renderSortArrow('outstandingBalance')}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status {renderSortArrow('status')}
                    </div>
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                          {item.customerName}
                        </span>
                        <span className="text-xs text-gray-400">{item.address || 'No Address Listed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      <div className="flex flex-col text-xs">
                        <span>Tel: {item.phone}</span>
                        <span>Email: {item.email || '--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-brown-900">
                      ₨ {Number(item.creditLimit).toLocaleString()}
                    </td>
                    <td className={`px-6 py-5 font-bold ${Number(item.outstandingBalance) > Number(item.creditLimit) ? 'text-red-600 font-black' : 'text-brown-900'}`}>
                      ₨ {Number(item.outstandingBalance).toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.status === 'Active' ? 'bg-green-50 text-green-700' : item.status === 'Inactive' ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-500' : item.status === 'Inactive' ? 'bg-gray-400' : 'bg-red-500'}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                       <button 
                         onClick={(e) => handleViewDetails(item, e)} 
                         className="p-1.5 text-terracotta-600 hover:text-white hover:bg-terracotta-600 rounded-lg transition-colors border border-terracotta-100" 
                         title="View Customer Details & History"
                       >
                          <Eye className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={(e) => handleEditClick(item, e)} 
                         className="p-1.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded-lg transition-colors border border-blue-100" 
                         title="Edit Customer"
                       >
                          <Edit className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={(e) => handleDelete(item._id, e)} 
                         className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-100" 
                         title="Delete Customer"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {sortedItems.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-terracotta-500 text-brown-900"
              >
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
                <option value={50}>50 items</option>
              </select>
              <span>of {sortedItems.length} records</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-100 hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:text-gray-500 bg-white transition-colors cursor-pointer"
                title="First Page"
              >
                <ChevronLeft className="w-4 h-4 double-arrow" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-100 hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:text-gray-500 bg-white transition-colors cursor-pointer"
              >
                Prev
              </button>
              
              <span className="px-3 py-1 bg-terracotta-50 text-terracotta-700 rounded-lg font-bold">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-gray-100 hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:text-gray-500 bg-white transition-colors cursor-pointer"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-gray-100 hover:border-terracotta-500 hover:text-terracotta-600 disabled:opacity-40 disabled:hover:border-gray-100 disabled:hover:text-gray-500 bg-white transition-colors cursor-pointer"
                title="Last Page"
              >
                <ChevronRight className="w-4 h-4 double-arrow" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
            
            {/* Left Sidebar: Profile Details */}
            <div className="w-full md:w-2/5 bg-gray-50 p-6 border-r border-gray-100 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-terracotta-50 text-terracotta-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Customer Profile
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${selectedCustomer.status === 'Active' ? 'bg-green-100 text-green-800' : selectedCustomer.status === 'Inactive' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-800'}
                  `}>
                    {selectedCustomer.status}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-brown-900 tracking-tight leading-tight">
                      {selectedCustomer.customerName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> Registered: {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Phone className="w-4 h-4 text-terracotta-500 shrink-0" />
                      <span className="font-bold">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Mail className="w-4 h-4 text-terracotta-500 shrink-0" />
                      <span className="truncate">{selectedCustomer.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <MapPin className="w-4 h-4 text-terracotta-500 shrink-0" />
                      <span className="whitespace-normal leading-normal">{selectedCustomer.address || 'No address provided'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financial Ratios & Limits</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-gray-100">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Credit Limit</span>
                        <span className="text-sm font-black text-brown-900 font-mono mt-0.5 block">
                          ₨ {Number(selectedCustomer.creditLimit).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Receivable</span>
                        <span className="text-sm font-black text-brown-900 font-mono mt-0.5 block">
                          ₨ {Number(selectedCustomer.outstandingBalance).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Limit Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mb-1">
                        <span>Limit Usage Ratio</span>
                        <span>
                          {selectedCustomer.creditLimit > 0 ? 
                            Math.round((selectedCustomer.outstandingBalance / selectedCustomer.creditLimit) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${selectedCustomer.outstandingBalance > selectedCustomer.creditLimit ? 'bg-red-500' : 'bg-terracotta-600'}`}
                          style={{ width: `${Math.min(100, selectedCustomer.creditLimit > 0 ? (selectedCustomer.outstandingBalance / selectedCustomer.creditLimit) * 100 : 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 bg-brown-900 text-white p-4 rounded-2xl flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-brown-200 uppercase">
                  <span>Customer Summary</span>
                  <ShoppingBag className="w-3.5 h-3.5 text-terracotta-400" />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-brown-100">Total Booked Spend</span>
                  <span className="text-base font-black font-mono">
                    ₨ {customerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brown-100 border-t border-brown-800 pt-2">
                  <span>Sales Orders</span>
                  <span className="font-bold">{customerOrders.length}</span>
                </div>
                <div className="flex justify-between text-xs text-brown-100">
                  <span>Quote Requests</span>
                  <span className="font-bold">{customerQuotes.length}</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Tabs & History Lists */}
            <div className="w-full md:w-3/5 p-6 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4 shrink-0">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setHistoryTab('orders')} 
                    className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${historyTab === 'orders' ? 'border-terracotta-600 text-terracotta-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    Sales Orders ({customerOrders.length})
                  </button>
                  <button 
                    onClick={() => setHistoryTab('quotes')} 
                    className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${historyTab === 'quotes' ? 'border-terracotta-600 text-terracotta-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    Quotes & Requests ({customerQuotes.length})
                  </button>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable History List */}
              <div className="flex-1 overflow-y-auto">
                {loadingHistory ? (
                  <div className="py-12 text-center text-gray-400 text-sm">Loading order ledger history...</div>
                ) : historyTab === 'orders' ? (
                  customerOrders.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm italic">No booked sales orders found for this customer.</div>
                  ) : (
                    <div className="space-y-3">
                      {customerOrders.map(order => (
                        <div key={order._id} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-terracotta-100 transition-colors flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brown-900 text-sm">{order.orderNumber}</span>
                              <span className="text-[10px] text-gray-400 font-semibold">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}</span>
                            </div>
                            <div className="text-gray-500 font-medium font-mono">
                              {(order.products && order.products[0]?.productName) || 'Standard Clay Brick'} × {order.quantity?.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1 shrink-0">
                            <div className="font-bold text-brown-900 text-sm">₨ {Number(order.totalAmount).toLocaleString()}</div>
                            <div className="flex gap-1.5 justify-end">
                              <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-wider
                                ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : order.paymentStatus === 'Partial' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}
                              `}>
                                {order.paymentStatus}
                              </span>
                              <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-wider
                                ${order.deliveryStatus === 'Delivered' ? 'bg-green-50 text-green-700' : order.deliveryStatus === 'Shipped' ? 'bg-blue-50 text-blue-700' : order.deliveryStatus === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                              `}>
                                {order.deliveryStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  customerQuotes.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm italic">No incoming quotes or requests found for this customer.</div>
                  ) : (
                    <div className="space-y-3">
                      {customerQuotes.map(quote => (
                        <div key={quote._id} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-terracotta-100 transition-colors flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-terracotta-600">REQ-{quote._id.slice(-6).toUpperCase()}</span>
                              <span className="text-[10px] text-gray-400 font-semibold">{new Date(quote.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-gray-500 font-medium">
                              {quote.product} • {quote.quantity} units
                            </div>
                            <div className="text-[10px] text-gray-400 italic truncate max-w-xs">
                              "{quote.description || 'No notes'}"
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1 shrink-0">
                            <div className="font-bold text-brown-900 text-sm">₨ {Number(quote.totalPrice || 0).toLocaleString()}</div>
                            <span className="inline-block px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
                              {quote.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Customer' : 'Add Customer'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer / Agency Name</label>
                <input 
                  required 
                  value={formData.customerName} 
                  onChange={e => setFormData({...formData, customerName: e.target.value})} 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-brown-900" 
                  placeholder="Allied Builders / Rahim Khan" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-brown-900" 
                    placeholder="+92 300 1234567" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    type="email" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-brown-900" 
                    placeholder="rahim@gmail.com" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Credit Limit (₨)</label>
                  <input 
                    required 
                    value={formData.creditLimit} 
                    onChange={e => setFormData({...formData, creditLimit: e.target.value})} 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-brown-900" 
                    placeholder="500000" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Outstanding Balance (₨)</label>
                  <input 
                    required 
                    value={formData.outstandingBalance} 
                    onChange={e => setFormData({...formData, outstandingBalance: e.target.value})} 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-brown-900" 
                    placeholder="120000" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Address</label>
                <input 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none text-brown-900" 
                  placeholder="Office 4, Ground Floor, Plaza-10, Lahore" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none bg-white text-brown-900"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6 cursor-pointer">
                {editingId ? 'Update Customer' : 'Save Customer'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
