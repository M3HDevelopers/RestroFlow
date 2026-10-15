import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, Button, Badge, PageHeader } from '../components/ui';

// ============ CUSTOMERS PAGE ============
export function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    const matchTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
      addToast('success', 'Customer updated successfully');
      setEditingCustomer(null);
    } else {
      addCustomer(formData);
      addToast('success', 'Customer added successfully');
    }

    setShowAddModal(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
      addToast('success', 'Customer deleted successfully');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Customers"
        subtitle="Manage customer database and loyalty programs"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowAddModal(true); setEditingCustomer(null); }}>
            <Plus size={14} /> Add Customer
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Customers</p>
          <p className="text-xl font-bold">{customers.length}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Revenue</p>
          <p className="text-xl font-bold text-accent">PKR {(customers.reduce((s, c) => s + c.totalSpent, 0) / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Avg. Orders/Customer</p>
          <p className="text-xl font-bold">{(customers.reduce((s, c) => s + c.totalOrders, 0) / customers.length).toFixed(1)}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">VIP Customers</p>
          <p className="text-xl font-bold text-warning">{customers.filter(c => c.tier === 'gold' || c.tier === 'platinum').length}</p>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
            <Search size={14} className="text-text-muted flex-shrink-0" />
            <input type="text" placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" />
          </div>
        </div>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="input-field w-auto text-sm py-2">
          <option value="all">All Tiers</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Avg. Order</th>
                <th>Loyalty Points</th>
                <th>Tier</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent/10 flex items-center justify-center">
                        <span className="text-accent font-bold text-xs">{customer.name.split(' ').map((n: string) => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.name}</p>
                        <p className="text-xs text-text-muted">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{customer.phone}</td>
                  <td className="font-medium">{customer.totalOrders}</td>
                  <td className="font-medium">PKR {customer.totalSpent.toLocaleString()}</td>
                  <td className="text-sm">PKR {Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}</td>
                  <td>
                    <span className="flex items-center gap-1 text-sm">
                      <Heart size={12} className="text-error" /> {customer.loyaltyPoints}
                    </span>
                  </td>
                  <td>
                    <span className={`badge capitalize`}>{customer.tier}</span>
                  </td>
                  <td className="text-xs text-text-muted">{new Date(customer.lastOrder).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(customer)} className="p-1 hover:bg-bg" title="Edit">
                        <Edit size={14} className="text-text-muted" />
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="p-1 hover:bg-bg" title="Delete">
                        <Trash2 size={14} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setEditingCustomer(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="section-title">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingCustomer(null); }} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field" 
                    placeholder="Customer name" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone *</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field" 
                    placeholder="Phone number" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field" 
                    placeholder="Email address" 
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowAddModal(false); setEditingCustomer(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1">
                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
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

// ============ SUPPLIERS PAGE ============
export function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    category: '',
    rating: 4,
    status: 'active' as 'active' | 'inactive',
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.outstandingBalance, 0);

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
      addToast('success', 'Supplier updated successfully');
      setEditingSupplier(null);
    } else {
      addSupplier(formData);
      addToast('success', 'Supplier added successfully');
    }

    setShowAddModal(false);
    setFormData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      category: '',
      rating: 4,
      status: 'active',
    });
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      category: supplier.category,
      rating: supplier.rating,
      status: supplier.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(id);
      addToast('success', 'Supplier deleted successfully');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Suppliers"
        subtitle={`${suppliers.length} active suppliers`}
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowAddModal(true); setEditingSupplier(null); }}>
            <Plus size={14} /> Add Supplier
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Suppliers</p>
          <p className="text-xl font-bold">{suppliers.length}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Active</p>
          <p className="text-xl font-bold text-success">{suppliers.filter(s => s.status === 'active').length}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Outstanding</p>
          <p className="text-xl font-bold text-error">PKR {totalOutstanding.toLocaleString()}</p>
        </Card>
      </div>

      <div className="relative max-w-md">
        <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
          <Search size={14} className="text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Outstanding</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>
                    <p className="font-medium text-sm">{supplier.name}</p>
                    <p className="text-xs text-text-muted">{supplier.contact}</p>
                  </td>
                  <td className="text-sm">{supplier.category}</td>
                  <td className="text-sm">{supplier.email}</td>
                  <td className="text-sm">{supplier.phone}</td>
                  <td className={`font-medium ${supplier.outstandingBalance > 0 ? 'text-error' : 'text-success'}`}>
                    PKR {supplier.outstandingBalance.toLocaleString()}
                  </td>
                  <td>
                    <span className="text-sm">{'★'.repeat(Math.floor(supplier.rating))}{'☆'.repeat(5 - Math.floor(supplier.rating))}</span>
                    <span className="text-xs text-text-muted ml-1">{supplier.rating}</span>
                  </td>
                  <td>
                    <span className={`badge ${supplier.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(supplier)} className="p-1 hover:bg-bg" title="Edit">
                        <Edit size={14} className="text-text-muted" />
                      </button>
                      <button onClick={() => handleDelete(supplier.id)} className="p-1 hover:bg-bg" title="Delete">
                        <Trash2 size={14} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setEditingSupplier(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
                <h3 className="section-title">{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingSupplier(null); }} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Supplier Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field" 
                      placeholder="Enter supplier name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Contact Person</label>
                    <input 
                      type="text" 
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="input-field" 
                      placeholder="Contact person name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone *</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field" 
                      placeholder="Phone number" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field" 
                      placeholder="Email address" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <input 
                      type="text" 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field" 
                      placeholder="e.g., Meat, Dairy" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Rating (1-5)</label>
                    <input 
                      type="number" 
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="input-field" 
                      min="1"
                      max="5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowAddModal(false); setEditingSupplier(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1">
                    {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
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
