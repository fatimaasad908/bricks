import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/contacts', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[10px] font-bold text-terracotta-600 tracking-widest uppercase mb-3">GET IN TOUCH</p>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 mb-6 tracking-tight">We're Here to Help</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Have questions about our products, need a custom quote, or want to discuss a large-scale project? Our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="space-y-8"
          >
            <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-terracotta-50 rounded-xl flex items-center justify-center text-terracotta-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brown-900 mb-2">Corporate Office & Main Plant</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Chak 90/6R Road<br/>
                  Near Arratula Road<br />
                  Sahiwal
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-terracotta-50 rounded-xl flex items-center justify-center text-terracotta-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brown-900 mb-2">Phone Lines</h3>
                <p className="text-gray-500 leading-relaxed text-sm mb-1">Sales & Orders: <strong>0313-6884162</strong></p>
                <p className="text-gray-500 leading-relaxed text-sm">Support: <strong>0313-6884162</strong></p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-terracotta-50 rounded-xl flex items-center justify-center text-terracotta-600 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brown-900 mb-2">Email Directory</h3>
                <p className="text-gray-500 leading-relaxed text-sm mb-1">General Inquiries: <strong>info@bricks.com</strong></p>
                <p className="text-gray-500 leading-relaxed text-sm">Sales Team: <strong>sales@bricks.com</strong></p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-10 md:p-12 rounded-[2rem] shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-brown-900 mb-8 tracking-tight">Send us a message</h3>
            
            {success ? (
               <div className="bg-green-50 text-green-700 p-8 rounded-xl flex flex-col items-center justify-center text-center">
                 <CheckCircle className="w-16 h-16 mb-4 text-green-500" />
                 <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                 <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                 <button onClick={() => setSuccess(false)} className="mt-6 text-green-700 font-bold underline text-sm">Send another message</button>
               </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">First Name</label>
                    <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Last Name</label>
                    <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Work Email</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all" placeholder="john@company.com" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Subject</label>
                  <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all text-gray-600">
                    <option>General Inquiry</option>
                    <option>Bulk Order Request</option>
                    <option>Partnership</option>
                    <option>Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Message</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-95 text-[15px] shadow-lg shadow-terracotta-600/20 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
