import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, AlertTriangle, Clock, CreditCard, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, Button } from '../components/ui';

const COLORS = ['#F97316', '#10B981', '#F59E0B', '#6B7280', '#EF4444', '#3B82F6'];

export function DashboardPage() {
  const { setCurrentPage, orders, inventoryItems, customers, employees, expenses } = useStore();
  const [dateRange, setDateRange] = useState('today');

  // Calculate real-time metrics from actual data
  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const metrics = {
    grossSales: todayOrders.reduce((sum, o) => sum + o.subtotal, 0),
    netSales: todayOrders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: todayOrders.length,
    avgOrderValue: todayOrders.length > 0 ? Math.round(todayOrders.reduce((sum, o) => sum + o.total, 0) / todayOrders.length) : 0,
    completedOrders: todayOrders.filter(o => o.status === 'completed').length,
    cancelledOrders: todayOrders.filter(o => o.status === 'cancelled').length,
    pendingOrders: todayOrders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)).length,
    totalDiscounts: todayOrders.reduce((sum, o) => sum + o.discount, 0),
    totalTax: todayOrders.reduce((sum, o) => sum + o.tax, 0),
    foodCost: todayOrders.reduce((sum, o) => sum + (o.total * 0.35), 0),
    foodCostPercentage: 35,
    grossProfit: todayOrders.reduce((sum, o) => sum + (o.total * 0.65), 0),
    totalExpenses: expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0),
    estimatedNetProfit: todayOrders.reduce((sum, o) => sum + (o.total * 0.65), 0) - expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0),
    cashInHand: todayOrders.filter(o => o.paymentMethod === 'Cash' && o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
    lowStockItems: inventoryItems.filter(i => i.status === 'low-stock').length,
    outOfStockItems: inventoryItems.filter(i => i.status === 'out-of-stock').length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    inventoryValue: inventoryItems.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0),
  };

  const formatPKR = (amount: number) => `PKR ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Business overview for {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-auto text-sm py-1.5"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
          <Button variant="secondary" size="sm">Export Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4 text-text-muted opacity-20">
            <DollarSign size={32} />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">Gross Sales</p>
              <span className="text-xs font-medium flex items-center gap-0.5 text-success">
                <TrendingUp size={10} />
                +12.5%
              </span>
            </div>
            <p className="metric-value">{formatPKR(metrics.grossSales)}</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4 text-text-muted opacity-20">
            <TrendingUp size={32} />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">Net Sales</p>
              <span className="text-xs font-medium flex items-center gap-0.5 text-success">
                <TrendingUp size={10} />
                +8.3%
              </span>
            </div>
            <p className="metric-value">{formatPKR(metrics.netSales)}</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4 text-text-muted opacity-20">
            <ShoppingBag size={32} />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">Total Orders</p>
              <span className="text-xs font-medium flex items-center gap-0.5 text-success">
                <TrendingUp size={10} />
                +5.2%
              </span>
            </div>
            <p className="metric-value">{metrics.totalOrders}</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4 text-text-muted opacity-20">
            <CreditCard size={32} />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">Avg. Order Value</p>
              <span className="text-xs font-medium flex items-center gap-0.5 text-error">
                <TrendingDown size={10} />
                -2.1%
              </span>
            </div>
            <p className="metric-value">{formatPKR(metrics.avgOrderValue)}</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4 text-text-muted opacity-20">
            <ArrowUpRight size={32} />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">Gross Profit</p>
              <span className="text-xs font-medium flex items-center gap-0.5 text-success">
                <TrendingUp size={10} />
                +15.8%
              </span>
            </div>
            <p className="metric-value">{formatPKR(metrics.grossProfit)}</p>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-4 right-4 text-text-muted opacity-20">
            <Package size={32} />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="metric-label">Food Cost %</p>
              <span className="text-xs font-medium flex items-center gap-0.5 text-success">
                <TrendingDown size={10} />
                -1.2%
              </span>
            </div>
            <p className="metric-value">{metrics.foodCostPercentage}%</p>
          </div>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-success-bg flex items-center justify-center">
            <span className="text-success text-lg font-bold">{metrics.completedOrders}</span>
          </div>
          <div>
            <p className="metric-label">Completed</p>
            <p className="text-sm font-semibold mt-0.5">Orders Today</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-warning-bg flex items-center justify-center">
            <Clock size={20} className="text-warning" />
          </div>
          <div>
            <p className="metric-label">Pending</p>
            <p className="text-sm font-semibold mt-0.5">{metrics.pendingOrders} Orders</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-error-bg flex items-center justify-center">
            <AlertTriangle size={20} className="text-error" />
          </div>
          <div>
            <p className="metric-label">Cancelled</p>
            <p className="text-sm font-semibold mt-0.5">{metrics.cancelledOrders} Orders</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-info-bg flex items-center justify-center">
            <Users size={20} className="text-info" />
          </div>
          <div>
            <p className="metric-label">Active</p>
            <p className="text-sm font-semibold mt-0.5">{metrics.activeEmployees} Staff</p>
          </div>
        </Card>
      </div>

      {/* Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="card-title">Inventory Alerts</h3>
            <button onClick={() => setCurrentPage('inventory')} className="text-xs text-accent hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            {inventoryItems.filter(i => i.status !== 'in-stock').slice(0, 4).map(item => (
              <div key={item.id} className={`flex items-center gap-3 p-3 border ${item.status === 'out-of-stock' ? 'border-error/30 bg-error-bg' : 'border-warning/30 bg-warning-bg'}`}>
                <AlertTriangle size={16} className={item.status === 'out-of-stock' ? 'text-error' : 'text-warning'} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.currentStock} {item.unit} remaining (min: {item.minStock} {item.unit})</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Inventory Value</span>
              <span className="font-semibold">{formatPKR(metrics.inventoryValue)}</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <h3 className="card-title mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => setCurrentPage('pos')} className="p-4 border border-border hover:border-accent hover:bg-accent-subtle transition-all text-left">
              <ShoppingBag size={24} className="text-accent mb-2" />
              <p className="text-sm font-medium">New Order</p>
              <p className="text-xs text-text-muted">Open POS</p>
            </button>
            <button onClick={() => setCurrentPage('menu')} className="p-4 border border-border hover:border-accent hover:bg-accent-subtle transition-all text-left">
              <Package size={24} className="text-accent mb-2" />
              <p className="text-sm font-medium">Menu</p>
              <p className="text-xs text-text-muted">Manage items</p>
            </button>
            <button onClick={() => setCurrentPage('inventory')} className="p-4 border border-border hover:border-accent hover:bg-accent-subtle transition-all text-left">
              <Package size={24} className="text-accent mb-2" />
              <p className="text-sm font-medium">Inventory</p>
              <p className="text-xs text-text-muted">Check stock</p>
            </button>
            <button onClick={() => setCurrentPage('reports')} className="p-4 border border-border hover:border-accent hover:bg-accent-subtle transition-all text-left">
              <TrendingUp size={24} className="text-accent mb-2" />
              <p className="text-sm font-medium">Reports</p>
              <p className="text-xs text-text-muted">View analytics</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
