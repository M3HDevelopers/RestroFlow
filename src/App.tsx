import React from 'react';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { OrdersPage, KitchenPage } from './pages/OrdersPage';
import { TablesPage } from './pages/TablesPage';
import { MenuPage } from './pages/MenuPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage, SuppliersPage } from './pages/CustomersSuppliersPage';
import { StaffPage, ExpensesPage, ReservationsPage, ReportsPage } from './pages/OtherPages';

function App() {
  const { isAuthenticated, currentPage } = useStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'pos': return <POSPage />;
      case 'orders': return <OrdersPage />;
      case 'kitchen': return <KitchenPage />;
      case 'tables': return <TablesPage />;
      case 'menu': return <MenuPage />;
      case 'inventory': return <InventoryPage />;
      case 'customers': return <CustomersPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'staff': return <StaffPage />;
      case 'expenses': return <ExpensesPage />;
      case 'reservations': return <ReservationsPage />;
      case 'reports': return <ReportsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;
