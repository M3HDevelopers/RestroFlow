import React, { useState } from 'react';
import { Search, Printer, Clock, Truck, ShoppingBag, X, Eye, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, Button, Badge, PageHeader } from '../components/ui';
import { printReceipt, printKitchenTicket } from '../utils/print';

export function OrdersPage() {
  const { orders, updateOrderStatus, cancelOrder, addToast } = useStore();
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchStatus = filter === 'all' || order.status === filter;
    const matchType = typeFilter === 'all' || order.type === typeFilter;
    const matchSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchStatus && matchType && matchSearch;
  });

  const todayStats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0),
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'badge badge-info',
      confirmed: 'badge badge-info',
      preparing: 'badge badge-warning',
      ready: 'badge badge-success',
      served: 'badge badge-success',
      completed: 'badge badge-success',
      cancelled: 'badge badge-danger',
    };
    return styles[status] || 'badge';
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    addToast('success', `Order status updated to ${newStatus}`);
  };

  const handleCancelOrder = () => {
    if (selectedOrder && cancelReason) {
      cancelOrder(selectedOrder.id, cancelReason);
      addToast('success', 'Order cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrder(null);
    }
  };

  const handlePrintReceipt = (order: any) => {
    printReceipt(order);
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow: Record<string, string> = {
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': 'served',
      'served': 'completed',
    };
    return statusFlow[currentStatus];
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders"
        subtitle="Manage and track all restaurant orders"
        actions={
          <Button variant="secondary" size="sm" onClick={() => addToast('info', 'Report generation started')}>
            <Printer size={14} /> Print Report
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Orders</p>
          <p className="text-xl font-bold">{todayStats.total}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-success">
          <p className="text-xs text-text-muted">Completed</p>
          <p className="text-xl font-bold text-success">{todayStats.completed}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-warning">
          <p className="text-xs text-text-muted">Preparing</p>
          <p className="text-xl font-bold text-warning">{todayStats.preparing}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-error">
          <p className="text-xs text-text-muted">Cancelled</p>
          <p className="text-xl font-bold text-error">{todayStats.cancelled}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Revenue</p>
          <p className="text-xl font-bold text-accent">PKR {(todayStats.revenue / 1000).toFixed(0)}K</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
            <Search size={14} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto text-sm py-2">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field w-auto text-sm py-2">
            <option value="all">All Types</option>
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Type</th>
                <th>Items</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-text-muted">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="font-medium">{order.orderNumber}</td>
                      <td>
                        <span className="flex items-center gap-1.5 text-xs capitalize">
                          {order.type === 'delivery' ? <Truck size={14} /> : <ShoppingBag size={14} />}
                          {order.type}
                        </span>
                      </td>
                      <td className="text-sm">{order.items.length} items</td>
                      <td className="text-sm">{order.customer || 'Walk-in'}</td>
                      <td className="text-sm">{order.table || '—'}</td>
                      <td className="font-medium">PKR {order.total.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadge(order.status)}>{order.status}</span>
                      </td>
                      <td className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-1 hover:bg-bg"
                            title="View Details"
                          >
                            <Eye size={14} className="text-text-muted" />
                          </button>
                          {nextStatus && (
                            <button 
                              onClick={() => handleStatusUpdate(order.id, nextStatus)}
                              className="p-1 hover:bg-bg"
                              title={`Mark as ${nextStatus}`}
                            >
                              <CheckCircle size={14} className="text-success" />
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowCancelModal(true);
                              }}
                              className="p-1 hover:bg-bg"
                              title="Cancel Order"
                            >
                              <XCircle size={14} className="text-error" />
                            </button>
                          )}
                          <button 
                            onClick={() => handlePrintReceipt(order)}
                            className="p-1 hover:bg-bg"
                            title="Print Receipt"
                          >
                            <Printer size={14} className="text-text-muted" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && !showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-surface w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface">
              <div>
                <h3 className="font-semibold">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-text-muted capitalize">{selectedOrder.type} • {selectedOrder.status}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted">Customer</p>
                  <p className="text-sm font-medium">{selectedOrder.customer || 'Walk-in Customer'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Table</p>
                  <p className="text-sm font-medium">{selectedOrder.table || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Payment Method</p>
                  <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Order Time</p>
                  <p className="text-sm font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="border border-border">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span>PKR {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tax</span>
                  <span>PKR {selectedOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Service Charge</span>
                  <span>PKR {selectedOrder.serviceCharge.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-PKR {selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent">PKR {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => handlePrintReceipt(selectedOrder)}
                  className="btn-secondary flex-1 text-sm"
                >
                  <Printer size={14} className="inline mr-1" /> Print Receipt
                </button>
                <button 
                  onClick={() => {
                    printKitchenTicket(selectedOrder);
                  }}
                  className="btn-secondary flex-1 text-sm"
                >
                  <ChefHat size={14} className="inline mr-1" /> Print Kitchen Ticket
                </button>
                {getNextStatus(selectedOrder.status) && (
                  <button 
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id, getNextStatus(selectedOrder.status));
                      setSelectedOrder(null);
                    }}
                    className="btn-primary flex-1 text-sm"
                  >
                    Mark as {getNextStatus(selectedOrder.status)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Cancel Order {selectedOrder.orderNumber}</h3>
              <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Cancellation Reason *</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCancelOrder}
                  className="btn-danger flex-1"
                  disabled={!cancelReason.trim()}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Kitchen Page - Shows Real Orders from POS
export function KitchenPage() {
  const { orders, updateOrderStatus, addToast } = useStore();
  const [activeStation, setActiveStation] = useState('all');
  
  const kitchenOrders = orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status));
  
  const stations = ['All', 'Grill', 'Pizza', 'Fryer', 'Cold Kitchen', 'Beverage', 'Packing'];

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
    addToast('success', 'Order accepted and sent to kitchen');
  };

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
    addToast('success', 'Order marked as ready');
  };

  const handleMarkServed = (orderId: string) => {
    updateOrderStatus(orderId, 'served');
    addToast('success', 'Order marked as served - removed from kitchen');
  };

  const handleMarkCompleted = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    addToast('success', 'Order completed and removed from kitchen');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Kitchen Display</h1>
          <p className="text-text-secondary text-sm">Real-time order management for kitchen staff</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="py-2 px-4">
            <p className="text-xs text-text-muted">Active Orders</p>
            <p className="text-2xl font-bold text-accent">{kitchenOrders.length}</p>
          </Card>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success animate-pulse"></div>
            <span className="text-sm text-text-muted">Live</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-info-bg border-info/30">
        <p className="text-sm text-info">
          <strong>Kitchen Orders:</strong> Yahan wo orders show hote hain jo POS se aate hain. Jab order "Confirmed" status mein hota hai to yahan appear hota hai. 
          "Accept" karne se "Preparing" mein jata hai, "Ready" mark karne se "Ready" status mein, aur "Served/Completed" karne se kitchen se remove ho jata hai.
        </p>
      </Card>

      {/* Station Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {stations.map(station => (
          <button
            key={station}
            onClick={() => setActiveStation(station.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border transition-colors ${
              activeStation === station.toLowerCase() ? 'bg-sidebar text-white border-sidebar' : 'bg-surface border-border hover:bg-bg'
            }`}
          >
            {station}
          </button>
        ))}
      </div>

      {/* Kitchen Tickets */}
      {kitchenOrders.length === 0 ? (
        <Card className="text-center py-12">
          <ChefHat size={48} className="mx-auto text-text-muted mb-3 opacity-30" />
          <p className="text-lg font-medium text-text-muted">No Active Kitchen Orders</p>
          <p className="text-sm text-text-muted mt-1">New orders will appear here when placed from POS</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {kitchenOrders.map((order) => {
            const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
            const isOverdue = elapsed > 15;
            const isWarning = elapsed > 10 && !isOverdue;

            return (
              <div
                key={order.id}
                className={`border-2 p-4 ${
                  isOverdue ? 'border-error bg-error-bg' :
                  isWarning ? 'border-warning bg-warning-bg' :
                  order.status === 'confirmed' ? 'border-info bg-info-bg' :
                  order.status === 'preparing' ? 'border-warning bg-warning-bg' :
                  'border-success bg-success-bg'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{order.orderNumber}</span>
                    <span className={`badge ${order.type === 'delivery' ? 'badge-info' : order.type === 'dine-in' ? 'badge-warning' : 'badge-success'}`}>
                      {order.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${isOverdue ? 'text-error' : isWarning ? 'text-warning' : 'text-text-muted'}`}>
                      <Clock size={12} className="inline mr-1" />
                      {elapsed}m
                    </span>
                    <p className="text-xs text-text-muted capitalize">{order.status}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="text-xs text-text-muted mb-2">
                  {order.table && <span>Table: {order.table} | </span>}
                  {order.customer && <span>Customer: {order.customer}</span>}
                  <p className="mt-1">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-start gap-2 text-sm">
                      <span className="w-6 h-6 bg-surface flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {item.quantity}x
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        {item.notes && (
                          <p className="text-xs text-warning italic mt-0.5">Note: {item.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  {order.status === 'confirmed' && (
                    <button 
                      onClick={() => handleAcceptOrder(order.id)}
                      className="btn-primary flex-1 py-2 text-xs"
                    >
                      <CheckCircle size={14} className="inline mr-1" />
                      Accept
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button 
                      onClick={() => handleMarkReady(order.id)}
                      className="btn-primary flex-1 py-2 text-xs bg-success hover:bg-success/90"
                    >
                      <CheckCircle size={14} className="inline mr-1" />
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <>
                      <button 
                        onClick={() => handleMarkServed(order.id)}
                        className="btn-primary flex-1 py-2 text-xs bg-info hover:bg-info/90"
                      >
                        Served
                      </button>
                      <button 
                        onClick={() => handleMarkCompleted(order.id)}
                        className="btn-secondary flex-1 py-2 text-xs"
                      >
                        Complete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
