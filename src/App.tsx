import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { GA4InspectorModal } from './components/GA4InspectorModal';
import { DropAlertsModal } from './components/DropAlertsModal';
import { ProductQuickView } from './components/ProductQuickView';
import { LoyaltyRewardsModal } from './components/LoyaltyRewardsModal';
import { Toast } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
    if (activeView.startsWith('/product/')) {
      return <ProductDetailPage />;
    }
    if (
      activeView === '/shop' ||
      activeView === '/new-drops' ||
      activeView.startsWith('/category/')
    ) {
      return <ShopPage />;
    }
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#121212] text-[#202124] dark:text-neutral-100 font-sans selection:bg-[#4285F4] selection:text-white transition-colors duration-200">
      <Header />
      <main className="flex-1">{renderView()}</main>
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchOverlay />
      <GA4InspectorModal />
      <DropAlertsModal />
      <ProductQuickView />
      <LoyaltyRewardsModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
