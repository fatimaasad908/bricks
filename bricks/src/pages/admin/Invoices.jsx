import { useState, useEffect } from 'react';
import { UserPlus, Download, CheckCircle2, Clock, Trash2, X, Edit, Receipt, Printer } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function AdminInvoices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customer: '',
    orderReference: '',
    subtotal: '',
    tax: '0',
    dueDate: '',
    paymentStatus: 'Unpaid'
  });

  const fetchItems = async () => {
    try {
      const data = await apiFetch('/invoices');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
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
        await apiFetch(`/invoices/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/invoices', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ invoiceNumber: '', customer: '', orderReference: '', subtotal: '', tax: '0', dueDate: '', paymentStatus: 'Unpaid' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditClick = (item, e) => {
    e.stopPropagation();
    setFormData({
      invoiceNumber: item.invoiceNumber,
      customer: item.customer,
      orderReference: item.orderReference,
      subtotal: item.subtotal,
      tax: item.tax || '0',
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
      paymentStatus: item.paymentStatus
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await apiFetch(`/invoices/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePrint = (item, e) => {
    e.stopPropagation();
    setActivePrintInvoice(item);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredItems = items.filter(i => 
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      
      {/* CSS print style to only show invoice sheet while printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice-area, #printable-invoice-area * {
            visibility: visible;
          }
          #printable-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 20px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-brown-900 mb-1">Billing, Invoices & Receivables</h2>
          <p className="text-gray-500 text-sm">Generate tax invoices, track client payment states, and download printable PDFs</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-brown-900 px-4 py-2 rounded-lg text-sm font-semibold hover:border-terracotta-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export List
          </button>
          <button onClick={() => { setEditingId(null); setFormData({ invoiceNumber: 'INV-' + Date.now().toString().slice(-4), customer: '', orderReference: 'SO-' + Date.now().toString().slice(-4), subtotal: '', tax: '0', dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], paymentStatus: 'Unpaid' }); setShowModal(true); }} className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-700 transition-colors shadow-sm shadow-terracotta-600/20">
            <Receipt className="w-4 h-4" /> Issue Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Paid Invoices</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.paymentStatus === 'Paid').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Unpaid / Overdue</p>
            <h3 className="text-2xl font-bold text-brown-900">
              {items.filter(i => i.paymentStatus !== 'Paid').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-terracotta-200 transition-colors">
          <div className="w-12 h-12 bg-terracotta-50 text-terracotta-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xl font-bold">₨</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Receivables</p>
            <h3 className="text-2xl font-bold text-brown-900 font-mono">
              ₨ {items.reduce((sum, item) => sum + (Number(item.grandTotal) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Active Invoices ledger</h3>
          <input 
            type="text" 
            placeholder="Search invoice number..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta-500 w-64 text-brown-900" 
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading invoices...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No invoices found. Generate one!</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 font-bold tracking-wider text-[11px] uppercase border-b border-gray-50">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Order Ref</th>
                  <th className="px-6 py-4">Subtotal</th>
                  <th className="px-6 py-4">Sales Tax</th>
                  <th className="px-6 py-4">Grand Total</th>
                  <th className="px-6 py-4">Due date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-bold text-brown-900 text-[15px] group-hover:text-terracotta-600 transition-colors">
                      {item.invoiceNumber}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">
                      {item.customer}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-bold text-xs uppercase">
                      {item.orderReference}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      ₨ {Number(item.subtotal).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      ₨ {Number(item.tax || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 font-bold text-brown-900">
                      ₨ {Number(item.grandTotal).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide
                        ${item.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700' : item.paymentStatus === 'Overdue' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.paymentStatus === 'Paid' ? 'bg-green-500' : item.paymentStatus === 'Overdue' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-2">
                       <button onClick={(e) => handlePrint(item, e)} className="text-gray-500 hover:text-terracotta-600 bg-gray-50 p-1.5 rounded" title="Print Invoice">
                          <Printer className="w-4 h-4" />
                       </button>
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

      {/* Printable Invoice Sheet (Hidden from screen view, only active during window.print) */}
      {activePrintInvoice && (
        <div id="printable-invoice-area" className="hidden print:block bg-white text-brown-900 font-sans p-10 max-w-3xl mx-auto border border-gray-100 rounded-xl">
          <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-terracotta-600 tracking-tight">BrickFlow</h1>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Manufacturing Pro ERP</span>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Industrial Area, Phase 4<br />
                Lahore, Pakistan<br />
                support@brickflow.com
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-brown-900 uppercase">Sales Invoice</h2>
              <span className="text-sm font-mono text-gray-400 font-semibold">{activePrintInvoice.invoiceNumber}</span>
              <p className="text-xs text-gray-500 mt-4">
                <strong>Due Date:</strong> {activePrintInvoice.dueDate ? new Date(activePrintInvoice.dueDate).toLocaleDateString() : '--'}<br />
                <strong>Order Ref:</strong> {activePrintInvoice.orderReference}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</span>
            <h3 className="text-base font-bold text-brown-900">{activePrintInvoice.customer}</h3>
          </div>

          <table className="w-full text-left text-sm mb-12">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 text-xs font-bold uppercase">
                <th className="py-3">Description</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 font-medium">Standard Brick Delivery Order Fulfillments</td>
                <td className="py-4 text-right font-semibold">₨ {Number(activePrintInvoice.subtotal).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <td className="py-3 text-right font-bold">Subtotal</td>
                <td className="py-3 text-right font-semibold">₨ {Number(activePrintInvoice.subtotal).toLocaleString()}</td>
              </tr>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <td className="py-3 text-right font-bold">General Sales Tax (GST)</td>
                <td className="py-3 text-right font-semibold">₨ {Number(activePrintInvoice.tax || 0).toLocaleString()}</td>
              </tr>
              <tr className="text-base text-brown-900 font-extrabold border-t border-gray-300">
                <td className="py-4 text-right">Grand Total</td>
                <td className="py-4 text-right text-terracotta-600">₨ {Number(activePrintInvoice.grandTotal).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            Thank you for your business! Payments are due within the scheduled window.
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-brown-900">{editingId ? 'Edit Invoice' : 'Issue Invoice'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Invoice Number</label>
                <input required value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="INV-201" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer / Agency</label>
                  <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="Alied Developers" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Order Reference</label>
                  <input required value={formData.orderReference} onChange={e => setFormData({...formData, orderReference: e.target.value})} type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="SO-101" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtotal (₨)</label>
                  <input required value={formData.subtotal} onChange={e => setFormData({...formData, subtotal: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="250000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sales Tax / GST (₨)</label>
                  <input required value={formData.tax} onChange={e => setFormData({...formData, tax: e.target.value})} type="number" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" placeholder="42500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due date</label>
                  <input required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} type="date" className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Status</label>
                  <select value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none">
                    <option>Unpaid</option>
                    <option>Paid</option>
                    <option>Overdue</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-terracotta-600 text-white font-bold py-3 rounded-lg hover:bg-terracotta-700 transition-colors mt-6">
                {editingId ? 'Update Invoice' : 'Issue Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
