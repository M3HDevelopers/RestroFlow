import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Grid, List, Upload, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/mockData';
import { Card, Button, Badge, PageHeader } from '../components/ui';

export function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability, addToast, inventoryItems } = useStore();
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Burgers',
    price: 0,
    cost: 0,
    description: '',
    image: '',
    available: true,
    prepTime: 10,
    taxRate: 5,
    sku: '',
    tags: [] as string[],
  });

  const filteredItems = menuItems.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.sku) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
      addToast('success', 'Menu item updated successfully');
      setEditingItem(null);
    } else {
      addMenuItem(formData);
      addToast('success', 'Menu item added successfully');
    }

    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'Burgers',
      price: 0,
      cost: 0,
      description: '',
      image: '',
      available: true,
      prepTime: 10,
      taxRate: 5,
      sku: '',
      tags: [],
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      cost: item.cost,
      description: item.description,
      image: item.image || '',
      available: item.available,
      prepTime: item.prepTime,
      taxRate: item.taxRate,
      sku: item.sku,
      tags: item.tags || [],
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(id);
      addToast('success', 'Menu item deleted successfully');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Menu Management"
        subtitle={`${menuItems.length} items across ${categories.length} categories`}
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowAddModal(true); setEditingItem(null); }}>
            <Plus size={14} /> Add Item
          </Button>
        }
      />

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-colors ${
            selectedCategory === 'all' ? 'bg-sidebar text-white border-sidebar' : 'bg-white border-border hover:bg-bg'
          }`}
        >
          All ({menuItems.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-colors ${
              selectedCategory === cat.name ? 'bg-sidebar text-white border-sidebar' : 'bg-white border-border hover:bg-bg'
            }`}
          >
            {cat.name} ({menuItems.filter(i => i.category === cat.name).length})
          </button>
        ))}
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
            <Search size={14} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex border border-border">
          <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-sidebar text-white' : 'bg-white hover:bg-bg'}`}>
            <List size={16} />
          </button>
          <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-sidebar text-white' : 'bg-white hover:bg-bg'}`}>
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* Items */}
      {view === 'list' ? (
        <Card className="p-0 overflow-hidden">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Cost</th>
                  <th>Margin</th>
                  <th>Prep Time</th>
                  <th>Inventory Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const margin = ((item.price - item.cost) / item.price * 100).toFixed(0);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-bg flex items-center justify-center text-sm">🍽️</div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-text-muted">{item.description.slice(0, 40)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs font-mono">{item.sku}</td>
                      <td className="text-sm">{item.category}</td>
                      <td className="font-medium">PKR {item.price.toLocaleString()}</td>
                      <td className="text-text-secondary">PKR {item.cost.toLocaleString()}</td>
                      <td>
                        <span className={`text-sm font-medium ${Number(margin) > 60 ? 'text-success' : Number(margin) > 40 ? 'text-warning' : 'text-error'}`}>
                          {margin}%
                        </span>
                      </td>
                      <td className="text-sm">{item.prepTime}m</td>
                      <td>
                        {(() => {
                          const relatedInventory = inventoryItems.find(inv => 
                            inv.category.toLowerCase() === item.category.toLowerCase() ||
                            inv.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
                          );
                          
                          if (!relatedInventory) {
                            return <span className="text-xs text-text-muted">No link</span>;
                          }
                          
                          return (
                            <span className={`badge ${relatedInventory.status === 'in-stock' ? 'badge-success' : relatedInventory.status === 'low-stock' ? 'badge-warning' : 'badge-error'}`}>
                              {relatedInventory.currentStock} {relatedInventory.unit}
                            </span>
                          );
                        })()}
                      </td>
                      <td>
                        <span className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(item)} className="p-1 hover:bg-bg">
                            <Edit size={14} className="text-text-muted" />
                          </button>
                          <button onClick={() => toggleMenuItemAvailability(item.id)} className="p-1 hover:bg-bg">
                            {item.available ? <Eye size={14} className="text-text-muted" /> : <EyeOff size={14} className="text-text-muted" />}
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-bg">
                            <Trash2 size={14} className="text-error" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredItems.map(item => (
            <Card key={item.id} className="p-3">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-24 object-cover mb-2" />
              ) : (
                <div className="w-full h-24 bg-bg mb-2 flex items-center justify-center text-3xl">🍽️</div>
              )}
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-text-muted">{item.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-accent">PKR {item.price.toLocaleString()}</span>
                <span className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}>
                  {item.available ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                <button onClick={() => handleEdit(item)} className="btn-secondary flex-1 text-xs py-1">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn-secondary text-xs py-1 px-2"><Trash2 size={12} /></button>
              </div>
            </Card>
          ))}
        </div>
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
                <h3 className="section-title">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
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
                      placeholder="e.g., BRG-001" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Selling Price (PKR) *</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cost Price (PKR)</label>
                    <input 
                      type="number" 
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tax Rate (%)</label>
                    <input 
                      type="number" 
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Prep Time (min)</label>
                    <input 
                      type="number" 
                      value={formData.prepTime}
                      onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-field" 
                      rows={2} 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Item Image</label>
                    <div className="flex items-center gap-3">
                      {formData.image && (
                        <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover border border-border" />
                      )}
                      <label className="btn-secondary cursor-pointer flex items-center gap-2">
                        <Upload size={14} />
                        Upload Image
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.image && (
                        <button 
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="text-error hover:underline text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
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
    </div>
  );
}
