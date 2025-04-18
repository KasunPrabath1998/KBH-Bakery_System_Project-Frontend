import React, { useState } from 'react';
import Header from '../Header/Header';
import TransactionPage from '../pages/TansactionScreen';
import SellingPage from '../pages/SellingPage';
import StockPage from '../pages/StockPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import { useLocation } from 'react-router-dom';



const Navigation: React.FC = () => {

  const location = useLocation();
  const defaultTab = location.state?.tab || 'selling';

  const [activeTab, setActiveTab] = useState<'selling' | 'transactions' | 'stock' | 'products' | 'orders' | 'website'>(defaultTab);

  return (
    <div className="mt-0">
      <Header
        title="KBH"
        subtitle="BAKING FRESHNESS, LEADING TASTE"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'transactions' && <TransactionPage />}
      {activeTab === 'selling' && <SellingPage/>} 
      {activeTab === 'stock' && <StockPage />}
      {activeTab === 'products' && <ProductsPage />}
      {activeTab === 'orders' && <OrdersPage />}
    </div>
  );
};

export default Navigation;