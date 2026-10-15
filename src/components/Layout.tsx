import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, ClipboardList, Grid3X3,
  Package, Users, UserCheck, CreditCard, Receipt, TrendingUp, Settings,
  ChefHat, Truck, Calendar, Building2, Bell, Menu,
  LogOut, Search, ChevronDown, Store as StoreIcon, ChevronRight
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
      { id: 'orders', label: 'Orders', icon: ClipboardList },
      { id: 'kitchen', label: 'Kitchen Display', icon: ChefHat },
      { id: 'tables', label: 'Tables & Floor', icon: Grid3X3 },
      { id: 'reservations', label: 'Reservations', icon: Calendar },
    ]
  },
  {
    label: 'Menu & Inventory',
    items: [
      { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'suppliers', label: 'Suppliers', icon: Truck },
    ]
  },
  {
    label: 'People',
    items: [
      { id: 'staff', label: 'Staff & HR', icon: UserCheck },
      { id: 'customers', label: 'Customers', icon: Users },
    ]
  },
  {
    label: 'Finance',
    items: [
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'expenses', label: 'Expenses', icon: Receipt },
      { id: 'reports', label: 'Reports', icon: TrendingUp },
    ]
  },
  {
    label: 'Administration',
    items: [
      { id: 'branches', label: 'Branches', icon: Building2 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  },
];

export function Sidebar() {
  const { sidebarCollapsed, currentPage, setCurrentPage } = useStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'Operations']);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => 
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full bg-sidebar z-40 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
        {!sidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 bg-accent flex items-center justify-center flex-shrink-0">
              <StoreIcon size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm tracking-tight block leading-tight">RestroFlow</span>
              <span className="text-sidebar-text text-[10px] leading-tight">Restaurant OS</span>
            </div>
          </motion.div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 bg-accent flex items-center justify-center mx-auto flex-shrink-0">
            <StoreIcon size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navGroups.map(group => (
          <div key={group.label} className="mb-2">
            {!sidebarCollapsed && (
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold text-sidebar-text/60 uppercase tracking-wider hover:text-sidebar-text transition-colors"
              >
                <span>{group.label}</span>
                <ChevronRight 
                  size={12} 
                  className={`transition-transform ${expandedGroups.includes(group.label) ? 'rotate-90' : ''}`} 
                />
              </button>
            )}
            {(sidebarCollapsed || expandedGroups.includes(group.label)) && (
              <motion.div
                initial={false}
                animate={{ height: 'auto' }}
                className="space-y-0.5"
              >
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`sidebar-link w-full ${currentPage === item.id ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-2 flex-shrink-0">
        <button className={`sidebar-link w-full ${sidebarCollapsed ? 'justify-center px-0' : ''}`} title="Logout">
          <LogOut size={18} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

export function Topbar() {
  const { toggleSidebar, sidebarCollapsed, user, unreadCount, notifications, markAllNotificationsRead, markNotificationRead } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header 
      initial={false}
      animate={{ left: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 right-0 h-16 bg-surface border-b border-border z-30 flex items-center px-5 gap-4"
    >
      {/* Toggle Sidebar */}
      <button 
        onClick={toggleSidebar} 
        className="p-2 hover:bg-bg transition-colors text-text-secondary hover:text-text-primary"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="flex items-center gap-2 border border-border bg-bg px-3 py-2">
          <Search size={16} className="text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search orders, menu, customers..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Branch Selector */}
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border hover:bg-bg transition-colors text-text-secondary">
          <Building2 size={14} />
          <span className="hidden md:inline">Main Branch</span>
          <ChevronDown size={14} />
        </button>

        {/* Date/Time */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm">
          <span className="text-text-muted">{currentTime.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          <span className="text-border">|</span>
          <span className="font-medium text-text-primary tabular-nums">{currentTime.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2 hover:bg-bg transition-colors relative text-text-secondary hover:text-text-primary"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border shadow-lg z-50"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <button onClick={markAllNotificationsRead} className="text-xs text-accent hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left p-3 border-b border-border hover:bg-bg transition-colors ${!n.read ? 'bg-accent-subtle' : ''}`}
                  >
                    <p className="text-sm text-text-primary">{n.message}</p>
                    <p className="text-xs text-text-muted mt-1">{formatTimeAgo(n.time)}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2.5 p-1.5 hover:bg-bg transition-colors"
          >
            <div className="w-9 h-9 bg-accent-light border border-accent/20 flex items-center justify-center">
              <span className="text-accent font-semibold text-sm">AK</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-text-muted leading-tight">{user?.role}</p>
            </div>
          </button>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border shadow-lg z-50"
            >
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-bg">Profile Settings</button>
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-bg">Change Password</button>
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-bg">Login History</button>
              <hr className="border-border" />
              <button className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error-bg">Logout</button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, toasts, removeToast } = useStore();
  
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <Topbar />
      <motion.main 
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="pt-16"
      >
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </motion.main>

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`px-4 py-3 shadow-lg border flex items-center gap-3 min-w-72 ${
                toast.type === 'success' ? 'bg-success-bg border-success text-success' :
                toast.type === 'error' ? 'bg-error-bg border-error text-error' :
                toast.type === 'warning' ? 'bg-warning-bg border-warning text-warning' :
                'bg-info-bg border-info text-info'
              }`}
            >
              <span className="text-sm flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100">
                ×
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
