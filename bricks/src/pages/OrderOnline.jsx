import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function OrderOnline() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedProduct = searchParams.get('product') || 'red-brick';

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    product: preselectedProduct,
    quantity: '5,000 - 10,000 (Min. Order)',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactPerson: user.name || prev.contactPerson,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          userId: user?._id
        })
      });
      setSuccess(true);
      setFormData({
        companyName: '', contactPerson: user?.name || '', email: user?.email || '', phone: user?.phone || '',
        product: 'red-brick', quantity: '5,000 - 10,000 (Min. Order)',
        location: '', description: ''
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-bold text-terracotta-600 tracking-widest uppercase mb-3">WHOLESALE</p>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-6 tracking-tight">Request Bulk Quote</h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Fill out the form below with your project details and material requirements. Our sales team will get back to you within 24 hours with a customized quote.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white p-10 md:p-16 rounded-[2rem] shadow-xl border border-gray-100"
        >
          {success ? (
             <div className="bg-green-50 text-green-700 p-12 rounded-2xl flex flex-col items-center justify-center text-center">
               <CheckCircle className="w-20 h-20 mb-6 text-green-500" />
               <h3 className="text-3xl font-bold mb-4">Quote Request Submitted!</h3>
               <p className="text-lg mb-8 max-w-md">Thank you for considering us for your project. Our sales team will review your requirements and email you a personalized quote shortly.</p>
               <div className="flex gap-4">
                 <Link to="/products" className="bg-white border border-green-200 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors">Browse Products</Link>
                 <button onClick={() => setSuccess(false)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">Submit Another Request</button>
               </div>
             </div>
          ) : (
            <form className="space-y-10" onSubmit={handleSubmit}>
              
              {/* Section 1 */}
              <div>
                <h3 className="text-xl font-bold text-brown-900 border-b border-gray-100 pb-4 mb-6">1. Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Company Name *</label>
                    <input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Contact Person *</label>
                    <input required value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Email Address *</label>
                    <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Phone Number *</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-bold text-brown-900 border-b border-gray-100 pb-4 mb-6">2. Order Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Primary Product *</label>
                    <select 
                      value={formData.product} onChange={e => setFormData({...formData, product: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all text-brown-900 font-medium"
                    >
                      <option value="red-brick">Awaal (First class)</option>
                      <option value="clay-brick">Doem (Second class)</option>
                      <option value="fire-brick">Soem (Third-Class)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Estimated Quantity (Units) *</label>
                    <select value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all text-brown-900 font-medium">
                      <option>5,000 - 10,000 (Min. Order)</option>
                      <option>10,000 - 50,000</option>
                      <option>50,000 - 100,000</option>
                      <option>100,000+</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Delivery Location (City/State)</label>
                    <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-xl font-bold text-brown-900 border-b border-gray-100 pb-4 mb-6">3. Additional Details</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Project Description or Special Requirements</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 outline-none transition-all resize-none"></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-5 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] text-lg shadow-xl shadow-terracotta-600/20 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Quote Request'}
                </button>
              </div>

            </form>
          )}
        </motion.div>

      </div>
    </div>
  );
}
