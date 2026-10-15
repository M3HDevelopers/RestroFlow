import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, AlertTriangle, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, Button, Badge, PageHeader } from '../components/ui';

export function InventoryPage() {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, updateStock, addToast, menuItems } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockUpdateItem, setStockUpdateItem] = useState<any>(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockType, setStockType] = useState<'add' | 'remove' | 'set'>('add');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'kg',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    costPerUnit: 0,
    supplier: '',
  });

  const categories = [...new Set(inventoryItems.map(i => i.category))];

  const filteredItems = inventoryItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const stats = {
    total: inventoryItems.length,
    inStock: inventoryItems.filter(i => i.status === 'in-stock').length,
    lowStock: inventoryItems.filter(i => i.status === 'low-stock').length,
    outOfStock: inventoryItems.filter(i => i.status === 'out-of-stock').length,
    totalValue: inventoryItems.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0),
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.sku || !formData.category) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    if (editingItem) {
      updateInventoryItem(editingItem.id, formData);
      addToast('success', 'Inventory item updated successfully');
      setEditingItem(null);
    } else {
      addInventoryItem(formData);
      addToast('success', 'Inventory item added successfully');
    }

    setShowAddModal(false);
    setFormData({
      name: '',
      sku: '',
      category: '',
      unit: 'kg',
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      costPerUnit: 0,
      supplier: '',
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryItem(id);
      addToast('success', 'Inventory item deleted successfully');
    }
  };

  const handleStockUpdate = () => {
    if (stockUpdateItem && stockQuantity > 0) {
      updateStock(stockUpdateItem.id, stockQuantity, stockType);
      addToast('success', `Stock updated successfully`);
      setShowStockModal(false);
      setStockUpdateItem(null);
      setStockQuantity(0);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Inventory Management"
        subtitle="Track stock levels, movements, and valuations"
        actions={
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => { setShowAddModal(true); setEditingItem(null); }}>
              <Plus size={14} /> Add Item
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Items</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-success">
          <p className="text-xs text-text-muted">In Stock</p>
          <p className="text-xl font-bold text-success">{stats.inStock}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-warning">
          <p className="text-xs text-text-muted">Low Stock</p>
          <p className="text-xl font-bold text-warning">{stats.lowStock}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-error">
          <p className="text-xs text-text-muted">Out of Stock</p>
          <p className="text-xl font-bold text-error">{stats.outOfStock}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Value</p>
          <p className="text-xl font-bold text-accent">PKR {(stats.totalValue / 1000).toFixed(0)}K</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
            <Search size={14} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field w-auto text-sm py-2">
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto text-sm py-2">
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Min/Max</th>
                <th>Unit Cost</th>
                <th>Total Value</th>
                <th>Supplier</th>
                <th>Linked Menu Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td className="font-medium text-sm">{item.name}</td>
                  <td className="text-xs font-mono">{item.sku}</td>
                  <td className="text-sm">{item.category}</td>
                  <td>
                    <span className="font-medium">{item.currentStock}</span>
                    <span className="text-text-muted text-xs ml-1">{item.unit}</span>
                  </td>
                  <td className="text-xs text-text-secondary">{item.minStock} / {item.maxStock}</td>
                  <td className="text-sm">PKR {item.costPerUnit.toLocaleString()}</td>
                  <td className="text-sm font-medium">PKR {(item.currentStock * item.costPerUnit).toLocaleString()}</td>
                  <td className="text-sm">{item.supplier}</td>
                  <td>
                    <div className="text-xs">
                      {menuItems.filter(m => 
                        m.category.toLowerCase() === item.category.toLowerCase() ||
                        m.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                      ).slice(0, 2).map(m => (
                        <span key={m.id} className="inline-block bg-accent-subtle text-accent px-1.5 py-0.5 mr-1 mb-1 text-[10px]">
                          {m.name}
                        </span>
                      ))}
                      {menuItems.filter(m => 
                        m.category.toLowerCase() === item.category.toLowerCase() ||
                        m.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                      ).length > 2 && (
                        <span className="text-text-muted">+{menuItems.filter(m => 
                          m.category.toLowerCase() === item.category.toLowerCase() ||
                          m.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                        ).length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.status === 'in-stock' ? 'badge-success' : item.status === 'low-stock' ? 'badge-warning' : 'badge-danger'}`}>
                      {item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setStockUpdateItem(item); setShowStockModal(true); }} className="p-1 hover:bg-bg" title="Update Stock">
                        <Package size={14} className="text-info" />
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-1 hover:bg-bg" title="Edit">
                        <Edit size={14} className="text-text-muted" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-bg" title="Delete">
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

      {/* Low Stock Alerts */}
      {stats.lowStock + stats.outOfStock > 0 && (
        <Card className="border-warning/30 bg-warning-bg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-warning" />
            <h3 className="font-semibold text-sm text-warning">Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {inventoryItems.filter(i => i.status !== 'in-stock').map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-surface border border-border">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-text-muted">Current: {item.currentStock} {item.unit} | Min: {item.minStock} {item.unit}</p>
                </div>
                <button 
                  onClick={() => { setStockUpdateItem(item); setShowStockModal(true); }}
                  className="btn-primary text-xs py-1 px-2"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setEditingItem(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
                <h3 className="section-title">{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingItem(null); }} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Item Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field" 
                      placeholder="Enter item name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">SKU *</label>
                    <input 
                      type="text" 
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="input-field" 
                      placeholder="e.g., ING-001" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category *</label>
                    <input 
                      type="text" 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field" 
                      placeholder="e.g., Meat, Dairy" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Unit</label>
                    <select 
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="input-field"
                    >
                      <option value="kg">Kilograms</option>
                      <option value="g">Grams</option>
                      <option value="liters">Liters</option>
                      <option value="ml">Milliliters</option>
                      <option value="pcs">Pieces</option>
                      <option value="boxes">Boxes</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Current Stock</label>
                    <input 
                      type="number" 
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Min Stock</label>
                    <input 
                      type="number" 
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Stock</label>
                    <input 
                      type="number" 
                      value={formData.maxStock}
                      onChange={(e) => setFormData({ ...formData, maxStock: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cost Per Unit (PKR)</label>
                    <input 
                      type="number" 
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Supplier</label>
                    <input 
                      type="text" 
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="input-field" 
                      placeholder="Supplier name" 
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowAddModal(false); setEditingItem(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Update Modal */}
      <AnimatePresence>
        {showStockModal && stockUpdateItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowStockModal(false); setStockUpdateItem(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="section-title">Update Stock - {stockUpdateItem.name}</h3>
                <button onClick={() => { setShowStockModal(false); setStockUpdateItem(null); }} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Current Stock</p>
                  <p className="text-2xl font-bold">{stockUpdateItem.currentStock} {stockUpdateItem.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Update Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setStockType('add')}
                      className={`p-2 border text-sm font-medium ${stockType === 'add' ? 'bg-success-bg border-success text-success' : 'border-border'}`}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setStockType('remove')}
                      className={`p-2 border text-sm font-medium ${stockType === 'remove' ? 'bg-error-bg border-error text-error' : 'border-border'}`}
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => setStockType('set')}
                      className={`p-2 border text-sm font-medium ${stockType === 'set' ? 'bg-info-bg border-info text-info' : 'border-border'}`}
                    >
                      Set
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity ({stockUpdateItem.unit})</label>
                  <input 
                    type="number" 
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="input-field text-lg font-bold text-center"
                    min="0"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowStockModal(false); setStockUpdateItem(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleStockUpdate} className="btn-primary flex-1" disabled={stockQuantity <= 0}>
                    Update Stock
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
