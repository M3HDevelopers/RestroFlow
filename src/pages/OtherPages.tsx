import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card, Button, Badge, PageHeader } from '../components/ui';

// ============ STAFF PAGE ============
export function StaffPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    branch: 'Main Branch',
    status: 'active' as 'active' | 'on-leave' | 'inactive',
    phone: '',
    email: '',
    joinDate: new Date(),
    salary: 0,
  });

  const departments = [...new Set(employees.map(e => e.department))];

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchSearch && matchDept;
  });

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on-leave').length,
    totalSalary: employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary, 0),
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.role || !formData.department) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
      addToast('success', 'Employee updated successfully');
      setEditingEmployee(null);
    } else {
      addEmployee(formData);
      addToast('success', 'Employee added successfully');
    }

    setShowAddModal(false);
    setFormData({
      name: '',
      role: '',
      department: '',
      branch: 'Main Branch',
      status: 'active',
      phone: '',
      email: '',
      joinDate: new Date(),
      salary: 0,
    });
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      branch: employee.branch,
      status: employee.status,
      phone: employee.phone,
      email: employee.email,
      joinDate: employee.joinDate,
      salary: employee.salary,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      addToast('success', 'Employee deleted successfully');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Staff & HR"
        subtitle="Manage employees, attendance, and payroll"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowAddModal(true); setEditingEmployee(null); }}>
            <Plus size={14} /> Add Employee
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Staff</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-success">
          <p className="text-xs text-text-muted">Active</p>
          <p className="text-xl font-bold text-success">{stats.active}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-warning">
          <p className="text-xs text-text-muted">On Leave</p>
          <p className="text-xl font-bold text-warning">{stats.onLeave}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Monthly Payroll</p>
          <p className="text-xl font-bold text-accent">PKR {(stats.totalSalary / 1000).toFixed(0)}K</p>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2">
            <Search size={14} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="input-field w-auto text-sm py-2">
          <option value="all">All Departments</option>
          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredEmployees.map(emp => (
          <Card key={emp.id} className="p-4 hover:border-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-bold text-sm">{emp.name.split(' ').map((n: string) => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{emp.name}</p>
                <p className="text-xs text-text-muted">{emp.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${emp.status === 'active' ? 'badge-success' : emp.status === 'on-leave' ? 'badge-warning' : 'badge-danger'}`}>
                    {emp.status}
                  </span>
                  <span className="text-xs text-text-muted">{emp.department}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-text-muted">{emp.phone}</span>
              <span className="text-sm font-medium">PKR {emp.salary.toLocaleString()}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(emp)} className="btn-secondary flex-1 text-xs py-1">Edit</button>
              <button onClick={() => handleDelete(emp.id)} className="btn-secondary text-xs py-1 px-2"><Trash2 size={12} /></button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAddModal(false); setEditingEmployee(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
                <h3 className="section-title">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingEmployee(null); }} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Full Name *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field" 
                      placeholder="Enter full name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Role *</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="input-field" 
                      placeholder="e.g., Cashier, Chef" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Department *</label>
                    <input 
                      type="text" 
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="input-field" 
                      placeholder="e.g., Kitchen, Front of House" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Branch</label>
                    <select 
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="input-field"
                    >
                      <option value="Main Branch">Main Branch</option>
                      <option value="DHA Branch">DHA Branch</option>
                      <option value="Johar Town">Johar Town</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="on-leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
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
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">Salary (PKR)</label>
                    <input 
                      type="number" 
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="input-field" 
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowAddModal(false); setEditingEmployee(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1">
                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
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

// ============ EXPENSES PAGE ============
export function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense, approveExpense, user, addToast } = useStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: 0,
    date: new Date(),
    paymentMethod: 'Cash',
    status: 'pending' as 'pending' | 'approved' | 'paid' | 'rejected',
    branch: 'Main Branch',
  });

  const filteredExpenses = expenses.filter(e => statusFilter === 'all' || e.status === statusFilter);
  const totalPaid = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = expenses.filter(e => e.status === 'pending' || e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = () => {
    if (!formData.category || !formData.description || !formData.amount) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    addExpense(formData);
    addToast('success', 'Expense added successfully');
    setShowAddModal(false);
    setFormData({
      category: '',
      description: '',
      amount: 0,
      date: new Date(),
      paymentMethod: 'Cash',
      status: 'pending',
      branch: 'Main Branch',
    });
  };

  const handleApprove = (id: string) => {
    if (user) {
      approveExpense(id, user.name);
      addToast('success', 'Expense approved successfully');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      addToast('success', 'Expense deleted successfully');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Expenses"
        subtitle="Track and manage business expenses"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus size={14} /> Add Expense
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Expenses</p>
          <p className="text-xl font-bold">PKR {(expenses.reduce((s, e) => s + e.amount, 0) / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-success">
          <p className="text-xs text-text-muted">Paid</p>
          <p className="text-xl font-bold text-success">PKR {(totalPaid / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-warning">
          <p className="text-xs text-text-muted">Pending</p>
          <p className="text-xl font-bold text-warning">PKR {(totalPending / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">This Month</p>
          <p className="text-xl font-bold">{expenses.length} entries</p>
        </Card>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'paid', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium capitalize border transition-colors ${
              statusFilter === status ? 'bg-sidebar text-white border-sidebar' : 'bg-surface border-border hover:bg-bg'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Approved By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td className="text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="text-sm">{expense.category}</td>
                  <td className="text-sm">{expense.description}</td>
                  <td className="font-medium">PKR {expense.amount.toLocaleString()}</td>
                  <td className="text-sm">{expense.paymentMethod}</td>
                  <td className="text-sm text-text-secondary">{expense.approvedBy || '—'}</td>
                  <td>
                    <span className={`badge ${expense.status === 'paid' ? 'badge-success' : expense.status === 'pending' ? 'badge-warning' : expense.status === 'approved' ? 'badge-info' : 'badge-danger'}`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {expense.status === 'pending' && (
                        <button onClick={() => handleApprove(expense.id)} className="p-1 hover:bg-bg" title="Approve">
                          <Check size={14} className="text-success" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(expense.id)} className="p-1 hover:bg-bg" title="Delete">
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

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="section-title">Add New Expense</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description *</label>
                  <input 
                    type="text" 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field" 
                    placeholder="Expense description" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Amount (PKR) *</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="input-field" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Payment Method</label>
                  <select 
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="input-field"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1">Add Expense</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ RESERVATIONS PAGE ============
export function ReservationsPage() {
  const { reservations, addReservation, updateReservation, deleteReservation, addToast } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    partySize: 2,
    date: new Date(),
    time: '19:00',
    table: '',
    status: 'confirmed' as 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show',
    notes: '',
  });

  const handleSubmit = () => {
    if (!formData.customerName || !formData.phone || !formData.time) {
      addToast('error', 'Please fill all required fields');
      return;
    }

    if (editingReservation) {
      updateReservation(editingReservation.id, formData);
      addToast('success', 'Reservation updated successfully');
      setEditingReservation(null);
    } else {
      addReservation(formData);
      addToast('success', 'Reservation added successfully');
    }

    setShowAddModal(false);
    setFormData({
      customerName: '',
      phone: '',
      partySize: 2,
      date: new Date(),
      time: '19:00',
      table: '',
      status: 'confirmed',
      notes: '',
    });
  };

  const handleEdit = (reservation: any) => {
    setEditingReservation(reservation);
    setFormData({
      customerName: reservation.customerName,
      phone: reservation.phone,
      partySize: reservation.partySize,
      date: reservation.date,
      time: reservation.time,
      table: reservation.table || '',
      status: reservation.status,
      notes: reservation.notes || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      deleteReservation(id);
      addToast('success', 'Reservation deleted successfully');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reservations"
        subtitle="Manage table reservations and waitlist"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowAddModal(true); setEditingReservation(null); }}>
            <Plus size={14} /> New Reservation
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Today's Reservations</p>
          <p className="text-xl font-bold">{reservations.length}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-success">
          <p className="text-xs text-text-muted">Confirmed</p>
          <p className="text-xl font-bold text-success">{reservations.filter(r => r.status === 'confirmed').length}</p>
        </Card>
        <Card className="py-3 px-4 border-l-4 border-l-info">
          <p className="text-xs text-text-muted">Seated</p>
          <p className="text-xl font-bold text-info">{reservations.filter(r => r.status === 'seated').length}</p>
        </Card>
        <Card className="py-3 px-4">
          <p className="text-xs text-text-muted">Total Guests</p>
          <p className="text-xl font-bold">{reservations.reduce((s, r) => s + r.partySize, 0)}</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Party Size</th>
                <th>Date</th>
                <th>Time</th>
                <th>Table</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id}>
                  <td className="font-medium text-sm">{res.customerName}</td>
                  <td className="text-sm">{res.phone}</td>
                  <td className="text-sm">{res.partySize} guests</td>
                  <td className="text-sm">{new Date(res.date).toLocaleDateString()}</td>
                  <td className="text-sm font-medium">{res.time}</td>
                  <td className="text-sm">{res.table || '—'}</td>
                  <td className="text-xs text-text-muted max-w-32 truncate">{res.notes || '—'}</td>
                  <td>
                    <span className={`badge ${res.status === 'confirmed' ? 'badge-success' : res.status === 'seated' ? 'badge-info' : res.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(res)} className="p-1 hover:bg-bg" title="Edit">
                        <Edit size={14} className="text-text-muted" />
                      </button>
                      <button onClick={() => handleDelete(res.id)} className="p-1 hover:bg-bg" title="Delete">
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
            onClick={() => { setShowAddModal(false); setEditingReservation(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
                <h3 className="section-title">{editingReservation ? 'Edit Reservation' : 'New Reservation'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingReservation(null); }} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Customer Name *</label>
                  <input 
                    type="text" 
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Party Size</label>
                    <input 
                      type="number" 
                      value={formData.partySize}
                      onChange={(e) => setFormData({ ...formData, partySize: Number(e.target.value) })}
                      className="input-field" 
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Time *</label>
                    <input 
                      type="time" 
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="input-field" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Table (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.table}
                    onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                    className="input-field" 
                    placeholder="e.g., T-5" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field" 
                    rows={3}
                    placeholder="Special requests or notes" 
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setShowAddModal(false); setEditingReservation(null); }} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleSubmit} className="btn-primary flex-1">
                    {editingReservation ? 'Update Reservation' : 'Add Reservation'}
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

// ============ REPORTS PAGE ============
export function ReportsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const reportCategories = [
    { id: 'all', label: 'All Reports' },
    { id: 'sales', label: 'Sales' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'financial', label: 'Financial' },
    { id: 'staff', label: 'Staff' },
  ];

  const reports = [
    { id: 'r1', title: 'Daily Sales Report', category: 'sales', desc: 'Hourly and daily sales breakdown with trends', formats: ['PDF', 'Excel', 'CSV'] },
    { id: 'r2', title: 'Sales by Menu Item', category: 'sales', desc: 'Best and worst performing items analysis', formats: ['PDF', 'Excel'] },
    { id: 'r3', title: 'Profit & Loss Statement', category: 'financial', desc: 'Complete P&L with revenue and expense breakdown', formats: ['PDF', 'Excel'] },
    { id: 'r4', title: 'Cash Flow Report', category: 'financial', desc: 'Cash inflow and outflow analysis', formats: ['PDF', 'Excel'] },
    { id: 'r5', title: 'Inventory Valuation', category: 'inventory', desc: 'Current stock value and movement history', formats: ['PDF', 'Excel', 'CSV'] },
    { id: 'r6', title: 'Low Stock Report', category: 'inventory', desc: 'Items below reorder level', formats: ['PDF', 'CSV'] },
    { id: 'r7', title: 'Employee Attendance', category: 'staff', desc: 'Attendance records and late arrivals', formats: ['PDF', 'Excel'] },
    { id: 'r8', title: 'Payroll Report', category: 'staff', desc: 'Salary details, deductions, and net pay', formats: ['PDF', 'Excel'] },
  ];

  const filteredReports = activeCategory === 'all' ? reports : reports.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reports Center"
        subtitle="Generate and export comprehensive business reports"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {reportCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border transition-colors ${
              activeCategory === cat.id ? 'bg-sidebar text-white border-sidebar' : 'bg-surface border-border hover:bg-bg'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredReports.map(report => (
          <Card key={report.id} className="hover:border-accent/50 transition-colors">
            <h3 className="font-semibold text-sm">{report.title}</h3>
            <p className="text-xs text-text-muted mt-1">{report.desc}</p>
            <div className="flex items-center gap-1.5 mt-3">
              {report.formats.map(f => (
                <span key={f} className="px-1.5 py-0.5 text-[10px] bg-bg border border-border font-medium">{f}</span>
              ))}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <button className="btn-secondary flex-1 text-xs py-1.5">Preview</button>
              <button className="btn-primary flex-1 text-xs py-1.5">Generate</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
