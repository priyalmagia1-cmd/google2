import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../services/currency';
import { t } from '../services/i18n';
import { languages } from '../services/i18n';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Sparkles,
  BarChart2,
  Wifi,
  WifiOff,
  Grid,
  Flame,
  Shirt,
  Tag,
  Briefcase,
  Coffee,
  Gift,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    currency,
    setCurrency,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    isOffline,
    activeView,
    navigate,
    filters,
    loyaltyPoints,
    setIsLoyaltyModalOpen,
    setIsCartDrawerOpen,
    setIsSearchOverlayOpen,
    setIsGA4ModalOpen,
    setIsDropAlertsOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0);

  const navLinks = [
    { label: 'New Drops', path: '/new-drops', badge: 'HOT' },
    { label: 'Apparel', path: '/category/apparel' },
    { label: 'Accessories', path: '/category/accessories' },
    { label: 'Bags', path: '/category/bags' },
    { label: 'Drinkware', path: '/category/drinkware' },
    { label: 'Gifts', path: '/category/gifts' },
    { label: 'All Gear', path: '/shop' },
  ];

  const categoryNavItems = [
    { label: 'All Gear', path: '/shop', icon: Grid },
    { label: 'New Drops', path: '/new-drops', icon: Flame, badge: 'HOT' },
    { label: 'Apparel', path: '/category/apparel', icon: Shirt },
    { label: 'Accessories', path: '/category/accessories', icon: Tag },
    { label: 'Bags', path: '/category/bags', icon: Briefcase },
    { label: 'Drinkware', path: '/category/drinkware', icon: Coffee },
    { label: 'Gifts & Collectibles', path: '/category/gifts', icon: Gift },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#18191C]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-200">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-red-500 via-yellow-500 to-green-600 text-white text-lg sm:text-xl md:text-2xl font-extrabold py-5 md:py-6 px-6 text-center cursor-pointer hover:opacity-95 transition-all shadow-lg"
           onClick={() => navigate('/new-drops')}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3.5">
          <span>{t(language, 'announcement')}</span>
          <span className="hidden sm:inline-block bg-white/30 text-white px-4 py-1.5 rounded-full text-sm md:text-base font-black tracking-widest uppercase border border-white/40 shadow-sm">
            2026 Drop
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile menu toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Brand Logo */}
            <div
              onClick={() => navigate('/')}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="flex items-center -space-x-1">
                <span className="w-3 h-3 rounded-full bg-[#4285F4] inline-block animate-pulse"></span>
                <span className="w-3 h-3 rounded-full bg-[#EA4335] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#FBBC05] inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#34A853] inline-block"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg md:text-xl tracking-tight text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  GOOGLE <span className="text-blue-600 dark:text-blue-400">GEAR DROP</span>
                </span>
                <span className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase -mt-1 hidden sm:inline">
                  Google Merch Redesign
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 py-1 ${
                  activeView === link.path
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOverlayOpen(true)}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="Search Gear"
            >
              <Search size={20} />
            </button>

            {/* Currency Switcher Pill */}
            <div className="bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-full flex items-center border border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                  currency === 'INR'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all ${
                  currency === 'USD'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full flex items-center gap-1 text-xs font-medium"
                title="Select Language"
              >
                <Globe size={18} />
                <span className="hidden lg:inline uppercase font-bold">{language}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                        language === l.code ? 'text-blue-600 font-bold' : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Loyalty Rewards Points Pill */}
            <button
              onClick={() => setIsLoyaltyModalOpen(true)}
              className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs hover:scale-102"
              title="Google Gear Creator Points"
            >
              <Gift size={15} className="text-amber-600 dark:text-amber-400" />
              <span>{loyaltyPoints} PTS</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate('/wishlist')}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Profile Button */}
            <button
              onClick={() => navigate('/account')}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              title="Account"
            >
              <User size={20} />
            </button>

            {/* Slide-out Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-400 dark:hover:text-white transition-colors shadow-sm ml-1"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-blue-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {cartCount}
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* Category Sub-Navigation Bar */}
      <div className="bg-neutral-50/90 dark:bg-[#121315]/90 border-t border-neutral-200/60 dark:border-neutral-800/80 py-2.5 px-4 overflow-x-auto scrollbar-none transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 min-w-max">
          {categoryNavItems.map((item) => {
            const Icon = item.icon;
            const isCategoryActive =
              activeView === item.path ||
              (item.path.startsWith('/category/') &&
                filters?.category === item.path.replace('/category/', '')) ||
              (item.path === '/shop' && activeView === '/shop' && (!filters?.category || filters.category === 'all'));

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  isCategoryActive
                    ? 'bg-blue-600 text-white shadow-sm scale-102'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700'
                }`}
              >
                <Icon size={16} className={isCategoryActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      isCategoryActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Offline Status Warning Ribbon if offline */}
      {isOffline && (
        <div className="bg-amber-500 text-neutral-900 text-xs font-bold py-1 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff size={14} />
          <span>Offline Mode Active — Browsing cached Google Gear Drop catalog.</span>
        </div>
      )}

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  activeView === link.path
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                setIsDropAlertsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              Get Drop Alerts
            </button>
            <div className="text-xs text-neutral-500 font-medium">
              Cart Total: <span className="font-bold text-neutral-900 dark:text-white">{formatPrice(cartSubtotalUSD, currency)}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
