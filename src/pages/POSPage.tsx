import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, X, ShoppingCart, Trash2, CreditCard, Banknote, Wallet, Check, Printer } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/mockData';
import { printReceipt } from '../utils/print';

export function POSPage() {
  const { 
    menuItems, 
    posCart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    createOrder,
    customers,
    tables,
    assignTable,
    addToast 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [lastOrder, setLastOrder] = useState<any>(null);

  const filteredItems = menuItems.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch && item.available;
  });

  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = subtotal + tax + serviceCharge - discountAmount;

  const handlePlaceOrder = () => {
    if (posCart.length === 0) {
      addToast('warning', 'Please add items to the order');
      return;
    }

    if (orderType === 'dine-in' && !selectedTable) {
      addToast('warning', 'Please select a table for dine-in orders');
      return;
    }

    const order = createOrder({
      type: orderType,
      status: 'confirmed',
      items: posCart.map(item => ({
        id: `oi-${Date.now()}-${Math.random()}`,
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        modifiers: item.modifiers,
        notes: item.notes,
        status: 'pending',
      })),
      subtotal,
      tax,
      discount: discountAmount,
      serviceCharge,
      total,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'paid',
      customer: selectedCustomer || undefined,
      table: selectedTable || undefined,
      waiter: waiterName || undefined,
      branch: 'Main Branch',
    });

    if (orderType === 'dine-in' && selectedTable) {
      assignTable(selectedTable, order.id, waiterName || 'Staff');
    }

    setLastOrder(order);
    clearCart();
    setShowPayment(false);
    setDiscount(0);
    setSelectedCustomer('');
    setSelectedTable('');
    setWaiterName('');
    
    addToast('success', `Order ${order.orderNumber} placed successfully!`);
  };

  const handlePrintReceipt = () => {
    if (lastOrder) {
      printReceipt(lastOrder);
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-7rem)]">
      {/* Left - Menu Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <h1 className="page-title">Point of Sale</h1>
          <div className="flex items-center gap-1 ml-auto">
            {(['dine-in', 'takeaway', 'delivery'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`px-4 py-2 text-sm font-medium capitalize border transition-all ${
                  orderType === type 
                    ? 'bg-accent text-white border-accent' 
                    : 'bg-surface border-border hover:bg-bg'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
            <Search size={16} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all ${
              selectedCategory === 'All' 
                ? 'bg-sidebar text-white border-sidebar' 
                : 'bg-surface border-border hover:bg-bg'
            }`}
          >
            All Items
          </button>
          {categories.filter(c => c.active).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border transition-all ${
                selectedCategory === cat.name 
                  ? 'bg-sidebar text-white border-sidebar' 
                  : 'bg-surface border-border hover:bg-bg'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {filteredItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
              onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
              className="card p-4 text-left hover:border-accent transition-all group"
            >
              <div className="w-full h-20 bg-bg mb-3 flex items-center justify-center">
                <span className="text-3xl opacity-30">🍽️</span>
              </div>
              <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">{item.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base font-bold text-accent tabular-nums">PKR {item.price.toLocaleString()}</span>
                <span className="text-xs text-text-muted">{item.prepTime}m</span>
              </div>
              {item.tags.includes('bestseller') && (
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-accent-light text-accent font-medium">
                  Bestseller
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right - Cart */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 lg:w-96 bg-surface border border-border flex flex-col"
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-accent" />
              <span className="font-semibold">Current Order</span>
            </div>
          </div>
          
          {/* Order Type Specific Fields */}
          {orderType === 'dine-in' && (
            <div className="space-y-2">
              <select 
                className="input-field text-sm py-2" 
                value={selectedTable} 
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                <option value="">Select Table *</option>
                {tables.filter(t => t.status === 'available').map(table => (
                  <option key={table.id} value={table.id}>Table {table.number} ({table.capacity} seats)</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Waiter name"
                value={waiterName}
                onChange={(e) => setWaiterName(e.target.value)}
                className="input-field text-sm py-2"
              />
            </div>
          )}
          
          {orderType === 'delivery' && (
            <select 
              className="input-field text-sm py-2" 
              value={selectedCustomer} 
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.name}>{customer.name} - {customer.phone}</option>
              ))}
            </select>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {posCart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-text-muted"
              >
                <ShoppingCart size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No items in cart</p>
                <p className="text-xs mt-1">Click menu items to add</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {posCart.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-2 p-3 border border-border bg-bg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-text-muted tabular-nums">PKR {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border hover:bg-surface transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border hover:bg-surface transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold w-20 text-right tabular-nums">PKR {(item.price * item.quantity).toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-text-muted hover:text-error transition-colors">
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Summary */}
        <div className="border-t border-border p-4 space-y-3 bg-bg">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="tabular-nums">PKR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Tax (5%)</span>
            <span className="tabular-nums">PKR {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Service Charge (5%)</span>
            <span className="tabular-nums">PKR {serviceCharge.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Discount ({discount}%)</span>
              <span className="tabular-nums">-PKR {discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
            <span>Total</span>
            <span className="text-accent tabular-nums">PKR {total.toLocaleString()}</span>
          </div>

          {/* Discount Input */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-text-muted">Discount:</span>
            <div className="flex gap-1">
              {[0, 5, 10, 15, 20].map(d => (
                <button
                  key={d}
                  onClick={() => setDiscount(d)}
                  className={`px-2.5 py-1 text-xs border transition-all ${
                    discount === d 
                      ? 'bg-accent text-white border-accent' 
                      : 'border-border hover:bg-surface'
                  }`}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={clearCart}
              className="btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
              disabled={posCart.length === 0}
            >
              <Trash2 size={14} /> Clear
            </button>
            <button
              onClick={() => setShowPayment(true)}
              className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
              disabled={posCart.length === 0}
            >
              <CreditCard size={14} /> Pay PKR {total.toLocaleString()}
            </button>
          </div>

          {/* Print Last Receipt */}
          {lastOrder && (
            <button
              onClick={handlePrintReceipt}
              className="btn-secondary w-full py-2 text-sm flex items-center justify-center gap-1.5 mt-2"
            >
              <Printer size={14} /> Print Last Receipt
            </button>
          )}
        </div>
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="section-title">Payment</h3>
                <button onClick={() => setShowPayment(false)} className="text-text-muted hover:text-text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div className="text-center p-5 bg-bg border border-border">
                  <p className="text-sm text-text-secondary mb-2">Total Amount</p>
                  <p className="text-4xl font-bold text-accent tabular-nums">PKR {total.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Cash', label: 'Cash', icon: Banknote },
                      { id: 'Card', label: 'Card', icon: CreditCard },
                      { id: 'JazzCash', label: 'JazzCash', icon: Wallet },
                      { id: 'EasyPaisa', label: 'EasyPaisa', icon: Wallet },
                    ].map(method => (
                      <button 
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 border flex items-center gap-2 transition-all ${
                          selectedPaymentMethod === method.id 
                            ? 'border-accent bg-accent-subtle' 
                            : 'border-border hover:border-accent'
                        }`}
                      >
                        <method.icon size={18} />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setShowPayment(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handlePlaceOrder} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Check size={16} /> Complete Order
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
