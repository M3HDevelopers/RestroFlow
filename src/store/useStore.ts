import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { notifications, menuItems as initialMenuItems, tables as initialTables, customers as initialCustomers, inventoryItems as initialInventory, suppliers as initialSuppliers, employees as initialEmployees, expenses as initialExpenses, reservations as initialReservations } from '../data/mockData';

// Types
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  description: string;
  image?: string;
  available: boolean;
  prepTime: number;
  taxRate: number;
  sku: string;
  calories?: number;
  tags: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  type: 'dine-in' | 'takeaway' | 'delivery' | 'pickup';
  status: 'draft' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  serviceCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'partial' | 'refunded';
  customer?: string;
  table?: string;
  waiter?: string;
  createdAt: Date;
  completedAt?: Date;
  branch: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers: string[];
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'out-of-service';
  floor: string;
  currentOrder?: string;
  waiter?: string;
  seatedAt?: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: Date;
  loyaltyPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier: string;
  expiryDate?: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  outstandingBalance: number;
  rating: number;
  status: 'active' | 'inactive';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  branch: string;
  status: 'active' | 'on-leave' | 'inactive';
  phone: string;
  email: string;
  joinDate: Date;
  salary: number;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  branch: string;
  approvedBy?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  partySize: number;
  date: Date;
  time: string;
  table?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: { name: string; role: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Navigation
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Notifications
  notifications: typeof notifications;
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Menu Items
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  cancelOrder: (id: string, reason: string) => void;

  // POS Cart
  posCart: Array<{ id: string; name: string; price: number; quantity: number; modifiers: string[]; notes?: string }>;
  addToCart: (item: { id: string; name: string; price: number; modifiers?: string[]; notes?: string }) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Tables
  tables: Table[];
  updateTableStatus: (id: string, status: Table['status']) => void;
  assignTable: (id: string, orderId: string, waiter: string) => void;
  releaseTable: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrder' | 'loyaltyPoints' | 'tier'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Inventory
  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateStock: (id: string, quantity: number, type: 'add' | 'remove' | 'set') => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'outstandingBalance'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string, approvedBy: string) => void;

  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;

  // Toast
  toasts: Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      user: null,
      login: (email: string, _password: string) => {
        if (email && _password) {
          set({
            isAuthenticated: true,
            user: {
              name: 'Ahmed Khan',
              role: 'General Manager',
              email: email,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),

      // Navigation
      sidebarCollapsed: false,
      toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      currentPage: 'dashboard',
      setCurrentPage: (page: string) => set({ currentPage: page }),

      // Notifications
      notifications: [...notifications],
      unreadCount: notifications.filter(n => !n.read).length,
      markNotificationRead: (id: string) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length,
      })),
      markAllNotificationsRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),

      // Menu Items
      menuItems: initialMenuItems,
      addMenuItem: (item) => set(state => ({
        menuItems: [...state.menuItems, { ...item, id: `mi-${Date.now()}` }],
      })),
      updateMenuItem: (id, item) => set(state => ({
        menuItems: state.menuItems.map(mi => mi.id === id ? { ...mi, ...item } : mi),
      })),
      deleteMenuItem: (id) => set(state => ({
        menuItems: state.menuItems.filter(mi => mi.id !== id),
      })),
      toggleMenuItemAvailability: (id) => set(state => ({
        menuItems: state.menuItems.map(mi => mi.id === id ? { ...mi, available: !mi.available } : mi),
      })),

      // Orders
      orders: [],
      createOrder: (order) => {
        const id = `ord-${Date.now()}`;
        const orderNumber = `ORD-${String(1000 + get().orders.length).padStart(4, '0')}`;
        const newOrder: Order = {
          ...order,
          id,
          orderNumber,
          createdAt: new Date(),
        };
        set(state => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },
      updateOrderStatus: (id, status) => set(state => ({
        orders: state.orders.map(o => o.id === id ? { 
          ...o, 
          status,
          completedAt: status === 'completed' ? new Date() : o.completedAt,
        } : o),
      })),
      cancelOrder: (id, reason) => set(state => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o),
      })),

      // POS Cart
      posCart: [],
      addToCart: (item) => set(state => {
        const existing = state.posCart.find(c => c.id === item.id);
        if (existing) {
          return {
            posCart: state.posCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c),
          };
        }
        return {
          posCart: [...state.posCart, { ...item, quantity: 1, modifiers: item.modifiers || [] }],
        };
      }),
      removeFromCart: (id) => set(state => ({
        posCart: state.posCart.filter(c => c.id !== id),
      })),
      updateCartQuantity: (id, quantity) => set(state => ({
        posCart: quantity <= 0
          ? state.posCart.filter(c => c.id !== id)
          : state.posCart.map(c => c.id === id ? { ...c, quantity } : c),
      })),
      clearCart: () => set({ posCart: [] }),

      // Tables
      tables: initialTables,
      updateTableStatus: (id, status) => set(state => ({
        tables: state.tables.map(t => t.id === id ? { ...t, status } : t),
      })),
      assignTable: (id, orderId, waiter) => set(state => ({
        tables: state.tables.map(t => t.id === id ? { ...t, status: 'occupied' as const, currentOrder: orderId, waiter, seatedAt: new Date() } : t),
      })),
      releaseTable: (id) => set(state => ({
        tables: state.tables.map(t => t.id === id ? { ...t, status: 'cleaning' as const, currentOrder: undefined, waiter: undefined, seatedAt: undefined } : t),
      })),

      // Customers
      customers: initialCustomers,
      addCustomer: (customer) => set(state => ({
        customers: [...state.customers, { 
          ...customer, 
          id: `cust-${Date.now()}`,
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: new Date(),
          loyaltyPoints: 0,
          tier: 'bronze' as const,
        }],
      })),
      updateCustomer: (id, customer) => set(state => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...customer } : c),
      })),
      deleteCustomer: (id) => set(state => ({
        customers: state.customers.filter(c => c.id !== id),
      })),

      // Inventory
      inventoryItems: initialInventory,
      addInventoryItem: (item) => set(state => ({
        inventoryItems: [...state.inventoryItems, { 
          ...item, 
          id: `inv-${Date.now()}`,
          status: item.currentStock === 0 ? 'out-of-stock' as const : item.currentStock <= item.minStock ? 'low-stock' as const : 'in-stock' as const,
        }],
      })),
      updateInventoryItem: (id, item) => set(state => ({
        inventoryItems: state.inventoryItems.map(i => i.id === id ? { ...i, ...item } : i),
      })),
      deleteInventoryItem: (id) => set(state => ({
        inventoryItems: state.inventoryItems.filter(i => i.id !== id),
      })),
      updateStock: (id, quantity, type) => set(state => ({
        inventoryItems: state.inventoryItems.map(i => {
          if (i.id !== id) return i;
          let newStock = i.currentStock;
          if (type === 'add') newStock += quantity;
          else if (type === 'remove') newStock -= quantity;
          else newStock = quantity;
          
          const status = newStock === 0 ? 'out-of-stock' as const : newStock <= i.minStock ? 'low-stock' as const : 'in-stock' as const;
          return { ...i, currentStock: newStock, status };
        }),
      })),

      // Suppliers
      suppliers: initialSuppliers,
      addSupplier: (supplier) => set(state => ({
        suppliers: [...state.suppliers, { ...supplier, id: `sup-${Date.now()}`, outstandingBalance: 0 }],
      })),
      updateSupplier: (id, supplier) => set(state => ({
        suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...supplier } : s),
      })),
      deleteSupplier: (id) => set(state => ({
        suppliers: state.suppliers.filter(s => s.id !== id),
      })),

      // Employees
      employees: initialEmployees,
      addEmployee: (employee) => set(state => ({
        employees: [...state.employees, { ...employee, id: `emp-${Date.now()}` }],
      })),
      updateEmployee: (id, employee) => set(state => ({
        employees: state.employees.map(e => e.id === id ? { ...e, ...employee } : e),
      })),
      deleteEmployee: (id) => set(state => ({
        employees: state.employees.filter(e => e.id !== id),
      })),

      // Expenses
      expenses: initialExpenses,
      addExpense: (expense) => set(state => ({
        expenses: [...state.expenses, { ...expense, id: `exp-${Date.now()}` }],
      })),
      updateExpense: (id, expense) => set(state => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...expense } : e),
      })),
      deleteExpense: (id) => set(state => ({
        expenses: state.expenses.filter(e => e.id !== id),
      })),
      approveExpense: (id, approvedBy) => set(state => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, status: 'approved' as const, approvedBy } : e),
      })),

      // Reservations
      reservations: initialReservations,
      addReservation: (reservation) => set(state => ({
        reservations: [...state.reservations, { ...reservation, id: `res-${Date.now()}` }],
      })),
      updateReservation: (id, reservation) => set(state => ({
        reservations: state.reservations.map(r => r.id === id ? { ...r, ...reservation } : r),
      })),
      deleteReservation: (id) => set(state => ({
        reservations: state.reservations.filter(r => r.id !== id),
      })),

      // Toast
      toasts: [],
      addToast: (type, message) => {
        const id = `toast-${Date.now()}`;
        set(state => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },
      removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
    }),
    {
      name: 'restroflow-storage',
    }
  )
);
