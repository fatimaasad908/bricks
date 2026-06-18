import { User, Globe, Save } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
           <h2 className="text-2xl font-bold text-brown-900 mb-1">System Settings</h2>
           <p className="text-gray-500 text-sm">Manage plant preferences, localized options, and your admin profile.</p>
        </div>
        <button className="flex items-center gap-2 bg-terracotta-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-terracotta-700 transition-colors shadow-lg shadow-terracotta-600/20 active:scale-95">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-terracotta-600 shadow-sm border border-gray-100 flex-row translate-x-1' 
                      : 'text-gray-500 hover:text-brown-900 border border-transparent hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            
            {activeTab === 'general' && (
              <div className="space-y-8 max-w-2xl animate-in fade-in relative">
                <div>
                  <h3 className="text-lg font-bold text-brown-900 mb-6 font-display">Regional Settings (Pakistan)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Base Currency</label>
                       <select className="w-full bg-gray-50 border border-gray-200 text-brown-900 font-semibold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all">
                         <option>Pakistani Rupee (PKR - ₨)</option>
                         <option>US Dollar (USD - $)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timezone</label>
                       <select className="w-full bg-gray-50 border border-gray-200 text-brown-900 font-semibold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all">
                         <option>(GMT+05:00) Islamabad, Karachi</option>
                       </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-brown-900 mb-6 font-display">Plant Information</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plant Name</label>
                       <input type="text" defaultValue="BRICKS Mega Plant Alpha" className="w-full bg-gray-50 border border-gray-200 text-brown-900 font-semibold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capacity (Bricks/Month)</label>
                       <input type="number" defaultValue="5000000" className="w-full bg-gray-50 border border-gray-200 text-brown-900 font-semibold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8 max-w-2xl animate-in fade-in">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 bg-orange-100 border-2 border-white shadow-lg rounded-full flex items-center justify-center text-terracotta-600 font-bold text-2xl font-display">
                    T
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brown-900">Talha</h3>
                    <p className="text-sm text-gray-500 mb-3">Plant Manager</p>
                    <button className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 shadow-sm text-gray-700">Change Photo</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                     <input type="text" defaultValue="Talha" className="w-full bg-gray-50 border border-gray-200 text-brown-900 font-semibold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                     <input type="email" defaultValue="talha@bricks.pk" className="w-full bg-gray-50 border border-gray-200 text-brown-900 font-semibold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all" />
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'general' && activeTab !== 'profile' && (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                  <Globe className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-brown-900 mb-2">Options Coming Soon</h3>
                <p className="text-gray-500 text-sm max-w-xs">The {activeTab} configuration options are scheduled for the next release.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}