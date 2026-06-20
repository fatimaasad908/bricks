import Worker from '../models/Worker.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import OrderQuote from '../models/OrderQuote.js';
import Inventory from '../models/Inventory.js';
import ProductionBatch from '../models/ProductionBatch.js';
import Finance from '../models/Finance.js';
import RawMaterial from '../models/RawMaterial.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await OrderQuote.countDocuments();

    // Statuses
    const pendingOrders = await OrderQuote.countDocuments({ status: { $in: ['Order Placed', 'Pending'] } });
    const ordersInProduction = await OrderQuote.countDocuments({ 
      status: { $in: ['Raw Material Allocated', 'Production Started', 'Bricks Under Manufacturing', 'Quality Check Completed'] } 
    });
    const readyForDelivery = await OrderQuote.countDocuments({ status: 'Ready for Delivery' });
    const deliveredOrders = await OrderQuote.countDocuments({ status: 'Delivered' });

    // Finance Totals from Finance Collection
    const incomes = await Finance.aggregate([
      { $match: { type: 'Income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const expenses = await Finance.aggregate([
      { $match: { type: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = incomes[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;
    const netBalance = totalIncome - totalExpenses;

    // Production statistics: Bricks produced (sum of Completed quantityProduced in ProductionBatch)
    const productionStats = await ProductionBatch.aggregate([
      { $match: { completionStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$quantityProduced' } } }
    ]);
    const inventoryStockLevels = productionStats[0]?.total || 0;

    // Raw Material Stock Alert Capacity
    const rawMaterials = await RawMaterial.find();
    let totalStock = 0;
    let totalReorder = 0;
    let hasLowStockAlert = false;
    rawMaterials.forEach(m => {
      totalStock += m.stockQuantity || 0;
      totalReorder += m.reorderLevel || 0;
      if (m.status === 'Low Stock' || m.status === 'Out of Stock' || m.stockQuantity <= m.reorderLevel) {
        hasLowStockAlert = true;
      }
    });
    const capacityVal = totalReorder > 0 ? Math.round((totalStock / (totalReorder * 2)) * 100) : 100;
    const rawMaterialPercentage = Math.min(Math.max(capacityVal, 0), 100);
    const rawMaterialStatus = hasLowStockAlert ? 'LOW ALERT' : 'NORMAL';

    // 1. Monthly Production Chart Data (Vite / AreaChart)
    const getLast6Months = () => {
      const months = [];
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const date = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        months.push(monthNames[d.getMonth()]);
      }
      return months;
    };
    const chartMonths = getLast6Months();

    const productionBatches = await ProductionBatch.find();
    const productionByMonth = {};
    chartMonths.forEach(m => {
      productionByMonth[m] = 0;
    });
    productionBatches.forEach(pb => {
      const dateVal = pb.productionDate || pb.createdAt;
      const m = new Date(dateVal).toLocaleString('default', { month: 'short' }).toUpperCase();
      if (productionByMonth[m] !== undefined) {
        productionByMonth[m] += pb.quantityProduced || 0;
      }
    });
    const monthlyProductionChart = chartMonths.map(m => ({
      name: m,
      value: productionByMonth[m]
    }));

    const currentMonthName = new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
    const bricksProducedThisMonth = productionByMonth[currentMonthName] || 0;

    // 2. Monthly Finance Chart Data (Revenue vs Expenses BarChart)
    const finances = await Finance.find();
    const financeByMonth = {};
    chartMonths.forEach(m => {
      financeByMonth[m] = { revenue: 0, expenses: 0 };
    });
    finances.forEach(f => {
      const dateVal = f.date ? new Date(f.date) : f.createdAt;
      const m = new Date(dateVal).toLocaleString('default', { month: 'short' }).toUpperCase();
      if (financeByMonth[m] !== undefined) {
        if (f.type === 'Income') {
          financeByMonth[m].revenue += f.amount || 0;
        } else if (f.type === 'Expense') {
          financeByMonth[m].expenses += f.amount || 0;
        }
      }
    });
    const monthlyFinanceChart = chartMonths.map(m => ({
      name: m,
      revenue: financeByMonth[m].revenue,
      expenses: financeByMonth[m].expenses
    }));

    // 3. Order Status Distribution Chart Data
    const allQuotesForStatus = await OrderQuote.find();
    const statusMap = {};
    allQuotesForStatus.forEach(q => {
      statusMap[q.status] = (statusMap[q.status] || 0) + 1;
    });
    const keyStatuses = ['Order Placed', 'Order Confirmed', 'Production Started', 'Ready for Delivery', 'Delivered'];
    const orderStatusDistribution = keyStatuses.map(status => ({
      name: status,
      value: statusMap[status] || 0
    }));

    // 4. Product Demand Analysis Chart Data
    const productMap = {};
    allQuotesForStatus.forEach(q => {
      const qtyStr = String(q.quantity).replace(/[^0-9]/g, '');
      const qtyVal = parseInt(qtyStr) || 0;
      productMap[q.product] = (productMap[q.product] || 0) + qtyVal;
    });
    const productDemandAnalysis = Object.keys(productMap).map(prod => ({
      name: prod,
      value: productMap[prod]
    }));

    // 5. Inventory Usage Trends Chart Data
    const inventoryItems = await Inventory.find();
    let inventoryUsageTrends = inventoryItems.map(item => ({
      name: item.product,
      available: item.availableStock || 0,
      reserved: item.reservedStock || 0
    }));

    res.json({
      totalWorkers,
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingOrders,
      ordersInProduction,
      readyForDelivery,
      deliveredOrders,
      totalIncome,
      totalExpenses,
      netBalance,
      inventoryStockLevels,
      bricksProducedThisMonth,
      rawMaterialPercentage,
      rawMaterialStatus,
      monthlyProductionChart,
      monthlyFinanceChart,
      orderStatusDistribution,
      productDemandAnalysis,
      inventoryUsageTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
