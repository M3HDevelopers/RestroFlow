import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, Button, Badge, PageHeader } from '../components/ui';

export function TablesPage() {
  const { tables, updateTableStatus, addToast } = useStore();
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const filteredTables = selectedFloor === 'all' ? tables : tables.filter(t => t.floor === selectedFloor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success-bg border-success text-success';
      case 'occupied': return 'bg-error-bg border-error text-error';
      case 'reserved': return 'bg-info-bg border-info text-info';
      case 'cleaning': return 'bg-warning-bg border-warning text-warning';
      case 'out-of-service': return 'bg-bg border-border text-text-muted';
      default: return 'bg-bg border-border';
    }
  };

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  const handleStatusChange = (tableId: string, newStatus: string) => {
    updateTableStatus(tableId, newStatus as any);
    addToast('success', `Table status updated to ${newStatus}`);
    setSelectedTable(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tables & Floor Plan"
        subtitle="Manage restaurant seating and table assignments"
        actions={
          <Button variant="primary" size="sm">
            <Plus size={14} /> Add Table
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Tables</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-success">
          <p className="text-xs text-text-muted">Available</p>
          <p className="text-xl font-bold text-success">{stats.available}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-error">
          <p className="text-xs text-text-muted">Occupied</p>
          <p className="text-xl font-bold text-error">{stats.occupied}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-info">
          <p className="text-xs text-text-muted">Reserved</p>
          <p className="text-xl font-bold text-info">{stats.reserved}</p>
        </Card>
      </div>

      {/* Floor Filter */}
      <div className="flex gap-2">
        {['all', 'Ground Floor', 'First Floor'].map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            className={`px-4 py-2 text-sm font-medium border transition-colors ${
              selectedFloor === floor ? 'bg-sidebar text-white border-sidebar' : 'bg-surface border-border hover:bg-bg'
            }`}
          >
            {floor === 'all' ? 'All Floors' : floor}
          </button>
        ))}
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
        {filteredTables.map(table => (
          <motion.button
            key={table.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTable(table)}
            className={`p-3 border-2 text-center transition-all ${getStatusColor(table.status)}`}
          >
            <p className="font-bold text-lg">{table.number}</p>
            <p className="text-xs mt-1 flex items-center justify-center gap-1">
              <Users size={10} /> {table.capacity}
            </p>
            <p className="text-[10px] mt-1 capitalize font-medium">{table.status.replace('-', ' ')}</p>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-success-bg border border-success"></span> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-error-bg border border-error"></span> Occupied</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-info-bg border border-info"></span> Reserved</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-warning-bg border border-warning"></span> Cleaning</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-bg border border-border"></span> Out of Service</span>
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTable(null)}>
          <div className="bg-surface w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Table {selectedTable.number}</h3>
                <p className="text-xs text-text-muted">{selectedTable.floor}</p>
              </div>
              <span className={`badge ${selectedTable.status === 'available' ? 'badge-success' : selectedTable.status === 'occupied' ? 'badge-error' : 'badge-info'}`}>
                {selectedTable.status}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted">Capacity</p>
                  <p className="text-sm font-medium">{selectedTable.capacity} seats</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Current Order</p>
                  <p className="text-sm font-medium">{selectedTable.currentOrder || 'None'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Assigned Waiter</p>
                  <p className="text-sm font-medium">{selectedTable.waiter || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Seated Since</p>
                  <p className="text-sm font-medium">{selectedTable.seatedAt ? new Date(selectedTable.seatedAt).toLocaleTimeString() : '—'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium mb-2">Change Status</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedTable.id, 'available')}
                    className="btn-secondary text-xs py-2"
                  >
                    Available
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTable.id, 'occupied')}
                    className="btn-secondary text-xs py-2"
                  >
                    Occupied
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTable.id, 'reserved')}
                    className="btn-secondary text-xs py-2"
                  >
                    Reserved
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTable.id, 'cleaning')}
                    className="btn-secondary text-xs py-2"
                  >
                    Cleaning
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedTable.id, 'out-of-service')}
                    className="btn-secondary text-xs py-2 col-span-2"
                  >
                    Out of Service
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setSelectedTable(null)} className="btn-secondary flex-1 text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
