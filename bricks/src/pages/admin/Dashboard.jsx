import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, Users, AlertTriangle, UserPlus, ShoppingCart, Receipt, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';

const areaData = [
  { name: 'Week 1', value: 2000 },
  { name: 'Week 2', value: 3000 },
  { name: 'Week 3', value: 2500 },
  { name: 'Week 4', value: 7500 },
  { name: 'Week 5', value: 3000 },
];

const barData = [
  { name: 'JAN', revenue: 40, expenses: 24 },
  { name: 'FEB', revenue: 30, expenses: 13 },
  { name: 'MAR', revenue: 50, expenses: 30 },
  { name: 'APR', revenue: 55, expenses: 39 },
  { name: 'MAY', revenue: 48, expenses: 38 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalSalesAmount: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    inventoryStockLevels: 0,
    monthlySalesChart: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await apiFetch('/dashboard/stats');
        
        const revenue = statsData.revenue || 0;
        setStats({
          totalWorkers: statsData.totalWorkers || 0,
          totalSalesAmount: revenue,
          totalIncome: revenue,
          totalExpenses: revenue * 0.6, // estimate or fallback
          netBalance: revenue * 0.4, // estimate or fallback
          inventoryStockLevels: statsData.inventoryStockLevels || 0,
          monthlySalesChart: statsData.monthlySalesChart || []
        });

        const salesData = await apiFetch('/sales');
        setRecentOrders(salesData.slice(0, 5)); // Get top 5 recent orders
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Dispatched': case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'In Production': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '₨ 0';
    return '₨ ' + val.toLocaleString();
  };

  const chartData = stats.monthlySalesChart && stats.monthlySalesChart.length > 0
    ? stats.monthlySalesChart.map(item => ({ name: item.name, value: item.sales }))
    : areaData;

  return (
    <div className="space-y-6">
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/admin/workers" className="flex items-center gap-2 bg-white border border-gray-200 hover:border-terracotta-500 hover:text-terracotta-600 px-5 py-2.5 rounded-xl text-sm font-semibold text-brown-900 transition-colors shadow-sm">
          <div className="bg-orange-100 text-terracotta-600 p-1.5 rounded-lg"><UserPlus className="w-4 h-4" /></div>
          Add Worker
        </Link>
        <Link to="/admin/sales" className="flex items-center gap-2 bg-white border border-gray-200 hover:border-terracotta-500 hover:text-terracotta-600 px-5 py-2.5 rounded-xl text-sm font-semibold text-brown-900 transition-colors shadow-sm">
          <div className="bg-orange-100 text-terracotta-600 p-1.5 rounded-lg"><ShoppingCart className="w-4 h-4" /></div>
          New Order
        </Link>
        <Link to="/admin/finance" className="flex items-center gap-2 bg-white border border-gray-200 hover:border-terracotta-500 hover:text-terracotta-600 px-5 py-2.5 rounded-xl text-sm font-semibold text-brown-900 transition-colors shadow-sm">
          <div className="bg-orange-100 text-terracotta-600 p-1.5 rounded-lg"><Receipt className="w-4 h-4" /></div>
          Record Expense
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Package className="w-6 h-6 text-terracotta-600" />
            </div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">+5%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Bricks Produced</p>
          <h3 className="text-3xl font-bold text-brown-900">{(stats.inventoryStockLevels || 0).toLocaleString()}</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-terracotta-600 w-1/3 group-hover:w-full transition-all duration-500"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">-2.4%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Revenue</p>
          <h3 className="text-3xl font-bold text-brown-900">{formatCurrency(stats.totalIncome)}</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-terracotta-600 w-2/3 group-hover:w-full transition-all duration-500"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">+10%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Active Workers</p>
          <h3 className="text-3xl font-bold text-brown-900">{stats.totalWorkers}</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-terracotta-600 w-4/5 group-hover:w-full transition-all duration-500"></div>
        </div>

        {/* Card 4 - Alert */}
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-500 text-xs font-bold tracking-wider">CRITICAL</span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Raw Material Stock</p>
          <h3 className="text-2xl font-bold text-red-600 mb-2">LOW ALERT</h3>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1 text-left overflow-hidden">
             <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
          </div>
          <p className="text-xs text-red-500">15% capacity remaining</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Production Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-brown-900">30-day Production</h3>
              <p className="text-sm text-gray-400">360k total bricks produced this month</p>
            </div>
            <select className="bg-gray-50 border border-gray-100 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-terracotta-500">
              <option>Last 30 Days</option>
              <option>This Week</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e25822" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e25822" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#231c18' }}
                />
                <Area type="monotone" dataKey="value" stroke="#e25822" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-brown-900">Revenue vs Expenses</h3>
              <p className="text-sm text-gray-400">Comparing financial health (in Millions PKR)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 tracking-wider">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-terracotta-600"></span> REVENUE</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span> EXPENSES</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12} barGap={4}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#c14618" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-bold text-brown-900">Recent Orders</h3>
          <Link to="/admin/sales" className="text-sm font-semibold text-terracotta-600 hover:text-terracotta-700">View All Orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold tracking-wide text-xs">
              <tr>
                <th className="px-6 py-4">ORDER ID</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">QUANTITY</th>
                <th className="px-6 py-4">AMOUNT</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading orders...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brown-900">{order.orderId}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{order.qty.toLocaleString()} Bricks</td>
                    <td className="px-6 py-4 font-semibold text-brown-900">{formatCurrency(order.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status === 'Dispatched' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-1.5"></span>}
                        {order.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block mr-1.5"></span>}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end">
                      <Link to="/admin/sales" className="text-gray-400 hover:text-terracotta-600 bg-gray-50 p-2 rounded-lg hover:bg-terracotta-50 transition-colors inline-block">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
