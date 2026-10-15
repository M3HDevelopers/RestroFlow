import { format, subDays, subHours, startOfDay } from 'date-fns';

// ============ TYPES ============
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

export interface Category {
  id: string;
  name: string;
  itemCount: number;
  active: boolean;
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

// ============ CATEGORIES ============
export const categories: Category[] = [
  { id: 'cat-1', name: 'Burgers', itemCount: 12, active: true },
  { id: 'cat-2', name: 'Pizza', itemCount: 15, active: true },
  { id: 'cat-3', name: 'Pasta', itemCount: 8, active: true },
  { id: 'cat-4', name: 'BBQ & Grill', itemCount: 10, active: true },
  { id: 'cat-5', name: 'Rice & Biryani', itemCount: 9, active: true },
  { id: 'cat-6', name: 'Karhai & Salan', itemCount: 11, active: true },
  { id: 'cat-7', name: 'Appetizers', itemCount: 14, active: true },
  { id: 'cat-8', name: 'Beverages', itemCount: 18, active: true },
  { id: 'cat-9', name: 'Desserts', itemCount: 7, active: true },
  { id: 'cat-10', name: 'Breakfast', itemCount: 10, active: true },
  { id: 'cat-11', name: 'Chinese', itemCount: 12, active: true },
  { id: 'cat-12', name: 'Combos', itemCount: 6, active: true },
];

// ============ MENU ITEMS ============
export const menuItems: MenuItem[] = [
  { id: 'mi-1', name: 'Classic Beef Burger', category: 'Burgers', price: 850, cost: 320, description: 'Juicy beef patty with lettuce, tomato, and special sauce', available: true, prepTime: 12, taxRate: 5, sku: 'BRG-001', calories: 650, tags: ['popular', 'bestseller'] },
  { id: 'mi-2', name: 'Chicken Zinger Burger', category: 'Burgers', price: 750, cost: 280, description: 'Crispy chicken fillet with coleslaw and mayo', available: true, prepTime: 10, taxRate: 5, sku: 'BRG-002', calories: 580, tags: ['popular'] },
  { id: 'mi-3', name: 'Double Cheese Burger', category: 'Burgers', price: 1100, cost: 420, description: 'Two beef patties with double cheese and caramelized onions', available: true, prepTime: 15, taxRate: 5, sku: 'BRG-003', calories: 890, tags: ['premium'] },
  { id: 'mi-4', name: 'Margherita Pizza', category: 'Pizza', price: 1200, cost: 380, description: 'Classic tomato sauce, fresh mozzarella, and basil', available: true, prepTime: 18, taxRate: 5, sku: 'PZZ-001', calories: 720, tags: ['vegetarian', 'popular'] },
  { id: 'mi-5', name: 'Chicken Tikka Pizza', category: 'Pizza', price: 1450, cost: 450, description: 'Chicken tikka, onions, peppers, and special pizza sauce', available: true, prepTime: 20, taxRate: 5, sku: 'PZZ-002', calories: 850, tags: ['spicy', 'popular'] },
  { id: 'mi-6', name: 'Pepperoni Pizza', category: 'Pizza', price: 1350, cost: 410, description: 'Loaded with pepperoni and mozzarella cheese', available: true, prepTime: 18, taxRate: 5, sku: 'PZZ-003', calories: 780, tags: ['bestseller'] },
  { id: 'mi-7', name: 'Chicken Biryani', category: 'Rice & Biryani', price: 650, cost: 220, description: 'Aromatic basmati rice with tender chicken pieces', available: true, prepTime: 8, taxRate: 5, sku: 'RCE-001', calories: 680, tags: ['popular', 'bestseller'] },
  { id: 'mi-8', name: 'Mutton Biryani', category: 'Rice & Biryani', price: 950, cost: 380, description: 'Premium mutton pieces cooked with fragrant rice', available: true, prepTime: 10, taxRate: 5, sku: 'RCE-002', calories: 750, tags: ['premium'] },
  { id: 'mi-9', name: 'Seekh Kabab (4 pcs)', category: 'BBQ & Grill', price: 550, cost: 200, description: 'Minced beef seekh kababs grilled to perfection', available: true, prepTime: 12, taxRate: 5, sku: 'BBQ-001', calories: 420, tags: ['popular'] },
  { id: 'mi-10', name: 'Chicken Tikka (Half)', category: 'BBQ & Grill', price: 700, cost: 280, description: 'Marinated chicken pieces grilled on charcoal', available: true, prepTime: 15, taxRate: 5, sku: 'BBQ-002', calories: 380, tags: ['bestseller'] },
  { id: 'mi-11', name: 'Chicken Karhai (Full)', category: 'Karhai & Salan', price: 1800, cost: 650, description: 'Traditional chicken karhai with fresh tomatoes and green chilies', available: true, prepTime: 20, taxRate: 5, sku: 'KRH-001', calories: 920, tags: ['popular', 'spicy'] },
  { id: 'mi-12', name: 'Prawn Karhai', category: 'Karhai & Salan', price: 2400, cost: 950, description: 'Fresh prawns cooked in traditional karhai style', available: true, prepTime: 18, taxRate: 5, sku: 'KRH-002', calories: 580, tags: ['premium', 'seafood'] },
  { id: 'mi-13', name: 'Spring Rolls (6 pcs)', category: 'Appetizers', price: 400, cost: 120, description: 'Crispy vegetable spring rolls with sweet chili sauce', available: true, prepTime: 8, taxRate: 5, sku: 'APP-001', calories: 320, tags: ['vegetarian'] },
  { id: 'mi-14', name: 'Chicken Wings (8 pcs)', category: 'Appetizers', price: 650, cost: 250, description: 'Crispy chicken wings with choice of sauce', available: true, prepTime: 12, taxRate: 5, sku: 'APP-002', calories: 480, tags: ['popular'] },
  { id: 'mi-15', name: 'Fresh Lime Soda', category: 'Beverages', price: 200, cost: 40, description: 'Fresh lime with soda water and mint', available: true, prepTime: 3, taxRate: 5, sku: 'BEV-001', calories: 80, tags: ['refreshing'] },
  { id: 'mi-16', name: 'Mango Lassi', category: 'Beverages', price: 250, cost: 60, description: 'Creamy yogurt drink with fresh mango pulp', available: true, prepTime: 4, taxRate: 5, sku: 'BEV-002', calories: 220, tags: ['popular'] },
  { id: 'mi-17', name: 'Chocolate Lava Cake', category: 'Desserts', price: 450, cost: 120, description: 'Warm chocolate cake with molten center', available: true, prepTime: 10, taxRate: 5, sku: 'DSR-001', calories: 520, tags: ['popular', 'bestseller'] },
  { id: 'mi-18', name: 'Gulab Jamun (3 pcs)', category: 'Desserts', price: 250, cost: 60, description: 'Traditional milk dumplings in sugar syrup', available: true, prepTime: 5, taxRate: 5, sku: 'DSR-002', calories: 380, tags: ['traditional'] },
  { id: 'mi-19', name: 'Family Combo Deal', category: 'Combos', price: 2800, cost: 980, description: '2 Burgers + 1 Pizza + 4 Drinks + Fries', available: true, prepTime: 20, taxRate: 5, sku: 'CMB-001', calories: 2400, tags: ['value', 'family'] },
  { id: 'mi-20', name: 'Couple Deal', category: 'Combos', price: 1600, cost: 560, description: '2 Burgers + 2 Drinks + 1 Fries + Dessert', available: true, prepTime: 15, taxRate: 5, sku: 'CMB-002', calories: 1600, tags: ['value'] },
  { id: 'mi-21', name: 'Alfredo Pasta', category: 'Pasta', price: 900, cost: 280, description: 'Creamy alfredo sauce with fettuccine and grilled chicken', available: true, prepTime: 14, taxRate: 5, sku: 'PST-001', calories: 680, tags: ['popular'] },
  { id: 'mi-22', name: 'Chicken Manchurian', category: 'Chinese', price: 750, cost: 260, description: 'Crispy chicken in tangy Manchurian sauce', available: true, prepTime: 12, taxRate: 5, sku: 'CHN-001', calories: 520, tags: ['popular', 'spicy'] },
  { id: 'mi-23', name: 'Beef Chapli Kabab (2 pcs)', category: 'BBQ & Grill', price: 450, cost: 180, description: 'Peshawari style flat kababs with tomatoes and coriander', available: true, prepTime: 10, taxRate: 5, sku: 'BBQ-003', calories: 380, tags: ['traditional'] },
  { id: 'mi-24', name: 'Paratha Roll', category: 'Breakfast', price: 350, cost: 100, description: 'Flaky paratha rolled with eggs and vegetables', available: true, prepTime: 8, taxRate: 5, sku: 'BRK-001', calories: 420, tags: ['breakfast'] },
];

// ============ EMPLOYEES ============
export const employees: Employee[] = [
  { id: 'emp-1', name: 'Ahmed Khan', role: 'General Manager', department: 'Management', branch: 'Main Branch', status: 'active', phone: '0321-1234567', email: 'ahmed@restroflow.pk', joinDate: new Date('2022-01-15'), salary: 150000 },
  { id: 'emp-2', name: 'Sara Malik', role: 'Cashier', department: 'Front of House', branch: 'Main Branch', status: 'active', phone: '0333-2345678', email: 'sara@restroflow.pk', joinDate: new Date('2023-03-20'), salary: 45000 },
  { id: 'emp-3', name: 'Usman Ali', role: 'Head Chef', department: 'Kitchen', branch: 'Main Branch', status: 'active', phone: '0345-3456789', email: 'usman@restroflow.pk', joinDate: new Date('2022-06-10'), salary: 120000 },
  { id: 'emp-4', name: 'Fatima Noor', role: 'Waitress', department: 'Front of House', branch: 'Main Branch', status: 'active', phone: '0312-4567890', email: 'fatima@restroflow.pk', joinDate: new Date('2023-08-05'), salary: 35000 },
  { id: 'emp-5', name: 'Hassan Raza', role: 'Sous Chef', department: 'Kitchen', branch: 'Main Branch', status: 'active', phone: '0301-5678901', email: 'hassan@restroflow.pk', joinDate: new Date('2023-01-12'), salary: 80000 },
  { id: 'emp-6', name: 'Ayesha Siddiqui', role: 'Host', department: 'Front of House', branch: 'Main Branch', status: 'active', phone: '0322-6789012', email: 'ayesha@restroflow.pk', joinDate: new Date('2024-02-01'), salary: 40000 },
  { id: 'emp-7', name: 'Bilal Ahmad', role: 'Delivery Rider', department: 'Delivery', branch: 'Main Branch', status: 'active', phone: '0334-7890123', email: 'bilal@restroflow.pk', joinDate: new Date('2023-11-15'), salary: 40000 },
  { id: 'emp-8', name: 'Zainab Iqbal', role: 'Accountant', department: 'Finance', branch: 'Main Branch', status: 'active', phone: '0346-8901234', email: 'zainab@restroflow.pk', joinDate: new Date('2022-09-20'), salary: 90000 },
  { id: 'emp-9', name: 'Omar Farooq', role: 'Kitchen Helper', department: 'Kitchen', branch: 'Main Branch', status: 'on-leave', phone: '0313-9012345', email: 'omar@restroflow.pk', joinDate: new Date('2024-01-10'), salary: 30000 },
  { id: 'emp-10', name: 'Mariam Shah', role: 'Inventory Manager', department: 'Operations', branch: 'Main Branch', status: 'active', phone: '0302-0123456', email: 'mariam@restroflow.pk', joinDate: new Date('2023-05-18'), salary: 75000 },
  { id: 'emp-11', name: 'Tariq Mehmood', role: 'Security', department: 'Operations', branch: 'Main Branch', status: 'active', phone: '0335-1122334', email: 'tariq@restroflow.pk', joinDate: new Date('2023-07-22'), salary: 35000 },
  { id: 'emp-12', name: 'Nadia Hussain', role: 'Waitress', department: 'Front of House', branch: 'Main Branch', status: 'active', phone: '0347-2233445', email: 'nadia@restroflow.pk', joinDate: new Date('2024-03-01'), salary: 35000 },
];

// ============ TABLES ============
export const tables: Table[] = Array.from({ length: 20 }, (_, i) => ({
  id: `tbl-${i + 1}`,
  number: `T-${i + 1}`,
  capacity: [2, 4, 4, 6, 8, 2, 4, 6, 4, 2, 8, 4, 6, 2, 4, 4, 6, 8, 4, 2][i],
  status: (['available', 'occupied', 'reserved', 'available', 'occupied', 'cleaning', 'available', 'occupied', 'available', 'reserved', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'reserved', 'occupied', 'available', 'out-of-service'] as Table['status'][])[i],
  floor: i < 10 ? 'Ground Floor' : 'First Floor',
  currentOrder: ['occupied', 'reserved'].includes((['available', 'occupied', 'reserved', 'available', 'occupied', 'cleaning', 'available', 'occupied', 'available', 'reserved', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'reserved', 'occupied', 'available', 'out-of-service'] as Table['status'][])[i]) ? `ORD-${1000 + i}` : undefined,
  waiter: ['occupied', 'reserved'].includes((['available', 'occupied', 'reserved', 'available', 'occupied', 'cleaning', 'available', 'occupied', 'available', 'reserved', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'reserved', 'occupied', 'available', 'out-of-service'] as Table['status'][])[i]) ? employees[Math.floor(Math.random() * 3)].name : undefined,
  seatedAt: ['occupied'].includes((['available', 'occupied', 'reserved', 'available', 'occupied', 'cleaning', 'available', 'occupied', 'available', 'reserved', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'reserved', 'occupied', 'available', 'out-of-service'] as Table['status'][])[i]) ? subHours(new Date(), Math.floor(Math.random() * 2)) : undefined,
}));

// ============ INVENTORY ============
export const inventoryItems: InventoryItem[] = [
  { id: 'inv-1', name: 'Beef Mince', sku: 'ING-001', category: 'Meat', unit: 'kg', currentStock: 45, minStock: 20, maxStock: 100, costPerUnit: 1200, supplier: 'Fresh Meats Co.', status: 'in-stock' },
  { id: 'inv-2', name: 'Chicken Breast', sku: 'ING-002', category: 'Meat', unit: 'kg', currentStock: 38, minStock: 15, maxStock: 80, costPerUnit: 850, supplier: 'Fresh Meats Co.', status: 'in-stock' },
  { id: 'inv-3', name: 'Burger Buns', sku: 'ING-003', category: 'Bakery', unit: 'pcs', currentStock: 120, minStock: 50, maxStock: 300, costPerUnit: 35, supplier: 'Bakers Choice', status: 'in-stock' },
  { id: 'inv-4', name: 'Mozzarella Cheese', sku: 'ING-004', category: 'Dairy', unit: 'kg', currentStock: 8, minStock: 10, maxStock: 40, costPerUnit: 1800, supplier: 'Dairy Fresh', status: 'low-stock' },
  { id: 'inv-5', name: 'Pizza Dough', sku: 'ING-005', category: 'Bakery', unit: 'kg', currentStock: 25, minStock: 10, maxStock: 50, costPerUnit: 200, supplier: 'Bakers Choice', status: 'in-stock' },
  { id: 'inv-6', name: 'Basmati Rice', sku: 'ING-006', category: 'Grains', unit: 'kg', currentStock: 60, minStock: 25, maxStock: 150, costPerUnit: 350, supplier: 'Grain Masters', status: 'in-stock' },
  { id: 'inv-7', name: 'Cooking Oil', sku: 'ING-007', category: 'Oils', unit: 'liters', currentStock: 30, minStock: 15, maxStock: 60, costPerUnit: 450, supplier: 'Oil & More', status: 'in-stock' },
  { id: 'inv-8', name: 'Tomatoes', sku: 'ING-008', category: 'Vegetables', unit: 'kg', currentStock: 5, minStock: 10, maxStock: 40, costPerUnit: 120, supplier: 'Fresh Veggies', status: 'low-stock' },
  { id: 'inv-9', name: 'Onions', sku: 'ING-009', category: 'Vegetables', unit: 'kg', currentStock: 35, minStock: 15, maxStock: 80, costPerUnit: 100, supplier: 'Fresh Veggies', status: 'in-stock' },
  { id: 'inv-10', name: 'Yogurt', sku: 'ING-010', category: 'Dairy', unit: 'liters', currentStock: 0, minStock: 5, maxStock: 30, costPerUnit: 250, supplier: 'Dairy Fresh', status: 'out-of-stock' },
  { id: 'inv-11', name: 'Packaging Boxes (Large)', sku: 'PKG-001', category: 'Packaging', unit: 'pcs', currentStock: 200, minStock: 100, maxStock: 500, costPerUnit: 25, supplier: 'Pack Solutions', status: 'in-stock' },
  { id: 'inv-12', name: 'Paper Bags', sku: 'PKG-002', category: 'Packaging', unit: 'pcs', currentStock: 350, minStock: 150, maxStock: 800, costPerUnit: 12, supplier: 'Pack Solutions', status: 'in-stock' },
  { id: 'inv-13', name: 'Spice Mix (Biryani)', sku: 'ING-011', category: 'Spices', unit: 'kg', currentStock: 3, minStock: 2, maxStock: 10, costPerUnit: 2500, supplier: 'Spice World', status: 'low-stock' },
  { id: 'inv-14', name: 'Soft Drinks', sku: 'BEV-010', category: 'Beverages', unit: 'bottles', currentStock: 180, minStock: 50, maxStock: 300, costPerUnit: 100, supplier: 'Bev Distributors', status: 'in-stock' },
  { id: 'inv-15', name: 'French Fries (Frozen)', sku: 'ING-012', category: 'Frozen', unit: 'kg', currentStock: 20, minStock: 10, maxStock: 50, costPerUnit: 400, supplier: 'Frozen Foods Ltd.', status: 'in-stock' },
];

// ============ SUPPLIERS ============
export const suppliers: Supplier[] = [
  { id: 'sup-1', name: 'Fresh Meats Co.', contact: 'Imran Sheikh', phone: '042-35678901', email: 'orders@freshmeats.pk', category: 'Meat & Poultry', outstandingBalance: 45000, rating: 4.5, status: 'active' },
  { id: 'sup-2', name: 'Bakers Choice', contact: 'Nasir Ahmed', phone: '042-35678902', email: 'supply@bakerschoice.pk', category: 'Bakery & Bread', outstandingBalance: 12000, rating: 4.2, status: 'active' },
  { id: 'sup-3', name: 'Dairy Fresh', contact: 'Kamran Ali', phone: '042-35678903', email: 'info@dairyfresh.pk', category: 'Dairy Products', outstandingBalance: 28000, rating: 4.0, status: 'active' },
  { id: 'sup-4', name: 'Fresh Veggies', contact: 'Rashid Khan', phone: '042-35678904', email: 'orders@freshveggies.pk', category: 'Vegetables & Fruits', outstandingBalance: 8500, rating: 3.8, status: 'active' },
  { id: 'sup-5', name: 'Grain Masters', contact: 'Shahid Malik', phone: '042-35678905', email: 'sales@grainmasters.pk', category: 'Grains & Rice', outstandingBalance: 0, rating: 4.7, status: 'active' },
  { id: 'sup-6', name: 'Spice World', contact: 'Asif Raza', phone: '042-35678906', email: 'info@spiceworld.pk', category: 'Spices & Seasonings', outstandingBalance: 15000, rating: 4.3, status: 'active' },
  { id: 'sup-7', name: 'Pack Solutions', contact: 'Waseem Akhtar', phone: '042-35678907', email: 'orders@packsolutions.pk', category: 'Packaging', outstandingBalance: 22000, rating: 4.1, status: 'active' },
  { id: 'sup-8', name: 'Oil & More', contact: 'Faisal Tariq', phone: '042-35678908', email: 'supply@oilandmore.pk', category: 'Oils & Fats', outstandingBalance: 0, rating: 4.4, status: 'active' },
];

// ============ CUSTOMERS ============
export const customers: Customer[] = [
  { id: 'cust-1', name: 'Muhammad Ali', phone: '0300-1234567', email: 'ali@email.com', totalOrders: 45, totalSpent: 67500, lastOrder: subDays(new Date(), 2), loyaltyPoints: 1350, tier: 'gold' },
  { id: 'cust-2', name: 'Aisha Bibi', phone: '0301-2345678', email: 'aisha@email.com', totalOrders: 32, totalSpent: 48000, lastOrder: subDays(new Date(), 5), loyaltyPoints: 960, tier: 'silver' },
  { id: 'cust-3', name: 'Kamran Hussain', phone: '0302-3456789', email: 'kamran@email.com', totalOrders: 78, totalSpent: 125000, lastOrder: subDays(new Date(), 1), loyaltyPoints: 2500, tier: 'platinum' },
  { id: 'cust-4', name: 'Sana Javed', phone: '0303-4567890', email: 'sana@email.com', totalOrders: 12, totalSpent: 18000, lastOrder: subDays(new Date(), 10), loyaltyPoints: 360, tier: 'bronze' },
  { id: 'cust-5', name: 'Imran Malik', phone: '0304-5678901', email: 'imran@email.com', totalOrders: 56, totalSpent: 89000, lastOrder: subDays(new Date(), 3), loyaltyPoints: 1780, tier: 'gold' },
  { id: 'cust-6', name: 'Hira Nadeem', phone: '0305-6789012', email: 'hira@email.com', totalOrders: 23, totalSpent: 34500, lastOrder: subDays(new Date(), 7), loyaltyPoints: 690, tier: 'silver' },
  { id: 'cust-7', name: 'Fahad Raza', phone: '0306-7890123', email: 'fahad@email.com', totalOrders: 91, totalSpent: 145000, lastOrder: subDays(new Date(), 0), loyaltyPoints: 2900, tier: 'platinum' },
  { id: 'cust-8', name: 'Nida Shah', phone: '0307-8901234', email: 'nida@email.com', totalOrders: 8, totalSpent: 12000, lastOrder: subDays(new Date(), 15), loyaltyPoints: 240, tier: 'bronze' },
];

// ============ EXPENSES ============
export const expenses: Expense[] = [
  { id: 'exp-1', category: 'Rent', description: 'Monthly rent - Main Branch', amount: 250000, date: subDays(new Date(), 3), paymentMethod: 'Bank Transfer', status: 'paid', branch: 'Main Branch', approvedBy: 'Ahmed Khan' },
  { id: 'exp-2', category: 'Electricity', description: 'LESCO bill - January', amount: 85000, date: subDays(new Date(), 5), paymentMethod: 'Bank Transfer', status: 'paid', branch: 'Main Branch', approvedBy: 'Ahmed Khan' },
  { id: 'exp-3', category: 'Salaries', description: 'Staff salaries - January', amount: 750000, date: subDays(new Date(), 2), paymentMethod: 'Bank Transfer', status: 'paid', branch: 'Main Branch', approvedBy: 'Ahmed Khan' },
  { id: 'exp-4', category: 'Gas', description: 'SNGPL bill - January', amount: 32000, date: subDays(new Date(), 7), paymentMethod: 'Cash', status: 'paid', branch: 'Main Branch' },
  { id: 'exp-5', category: 'Maintenance', description: 'AC repair - Kitchen area', amount: 15000, date: subDays(new Date(), 1), paymentMethod: 'Cash', status: 'approved', branch: 'Main Branch', approvedBy: 'Ahmed Khan' },
  { id: 'exp-6', category: 'Marketing', description: 'Social media ads - February', amount: 25000, date: subDays(new Date(), 4), paymentMethod: 'Bank Transfer', status: 'pending', branch: 'Main Branch' },
  { id: 'exp-7', category: 'Cleaning', description: 'Deep cleaning service', amount: 18000, date: subDays(new Date(), 6), paymentMethod: 'Cash', status: 'paid', branch: 'Main Branch' },
  { id: 'exp-8', category: 'Internet', description: 'Monthly internet bill', amount: 8500, date: subDays(new Date(), 8), paymentMethod: 'Bank Transfer', status: 'paid', branch: 'Main Branch' },
  { id: 'exp-9', category: 'Packaging', description: 'Packaging supplies restock', amount: 22000, date: subDays(new Date(), 3), paymentMethod: 'Cash', status: 'pending', branch: 'Main Branch' },
  { id: 'exp-10', category: 'Miscellaneous', description: 'Emergency supplies', amount: 5000, date: subDays(new Date(), 0), paymentMethod: 'Cash', status: 'pending', branch: 'Main Branch' },
];

// ============ RESERVATIONS ============
export const reservations: Reservation[] = [
  { id: 'res-1', customerName: 'Muhammad Ali', phone: '0300-1234567', partySize: 4, date: new Date(), time: '19:00', table: 'T-5', status: 'confirmed', notes: 'Anniversary dinner' },
  { id: 'res-2', customerName: 'Aisha Bibi', phone: '0301-2345678', partySize: 2, date: new Date(), time: '20:00', table: 'T-3', status: 'confirmed' },
  { id: 'res-3', customerName: 'Kamran Hussain', phone: '0302-3456789', partySize: 6, date: new Date(), time: '19:30', table: 'T-11', status: 'seated', notes: 'VIP customer - window seat preferred' },
  { id: 'res-4', customerName: 'Sana Javed', phone: '0303-4567890', partySize: 3, date: new Date(), time: '20:30', status: 'confirmed' },
  { id: 'res-5', customerName: 'Imran Malik', phone: '0304-5678901', partySize: 8, date: new Date(), time: '21:00', table: 'T-12', status: 'confirmed', notes: 'Birthday celebration' },
];

// ============ NOTIFICATIONS ============
export const notifications = [
  { id: 'n-1', type: 'order', message: 'New delivery order #ORD-1098 received', time: subHours(new Date(), 0.1), read: false },
  { id: 'n-2', type: 'inventory', message: 'Low stock alert: Mozzarella Cheese (8 kg remaining)', time: subHours(new Date(), 0.5), read: false },
  { id: 'n-3', type: 'inventory', message: 'Out of stock: Yogurt', time: subHours(new Date(), 1), read: false },
  { id: 'n-4', type: 'reservation', message: 'New reservation for 8 guests at 9:00 PM', time: subHours(new Date(), 1.5), read: true },
  { id: 'n-5', type: 'expense', message: 'Maintenance expense pending approval: PKR 15,000', time: subHours(new Date(), 2), read: true },
  { id: 'n-6', type: 'kitchen', message: 'Order #ORD-1095 has been delayed by 10 minutes', time: subHours(new Date(), 2.5), read: true },
  { id: 'n-7', type: 'payment', message: 'Supplier invoice due: Fresh Meats Co. - PKR 45,000', time: subHours(new Date(), 3), read: true },
  { id: 'n-8', type: 'staff', message: 'Omar Farooq marked on leave for today', time: subHours(new Date(), 4), read: true },
];
