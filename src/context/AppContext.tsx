import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  WishlistItem,
  CurrencyCode,
  LanguageCode,
  Order,
  FilterState,
  GA4Event,
  LoyaltyTier,
  RewardItem,
  PointActivity,
  AppliedVoucher,
} from '../types';
import { PRODUCTS } from '../data/products';
import { REWARDS_CATALOG } from '../data/rewards';
import { trackGA4Event, subscribeGA4, getGA4Log } from '../services/ga4';
import confetti from 'canvas-confetti';

interface AppContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  currency: CurrencyCode;
  language: LanguageCode;
  darkMode: boolean;
  isOffline: boolean;
  lowBandwidth: boolean;
  activeView: string;
  viewParam?: string;
  quickViewProduct: Product | null;
  detailProduct: Product | null;
  filters: FilterState;
  recentSearches: string[];
  orders: Order[];
  ga4Events: GA4Event[];
  isGA4ModalOpen: boolean;
  isDropAlertsOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOverlayOpen: boolean;
  toastMessage: string | null;
  userEmail: string;

  // Loyalty Rewards
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  pointActivities: PointActivity[];
  appliedVoucher: AppliedVoucher | null;
  unlockedVoucherCodes: string[];
  isLoyaltyModalOpen: boolean;
  lastCheckinDate: string | null;

  // Actions
  addToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  setCurrency: (code: CurrencyCode) => void;
  setLanguage: (code: LanguageCode) => void;
  toggleDarkMode: () => void;
  toggleLowBandwidth: () => void;

  navigate: (view: string, param?: string) => void;
  
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  openProductDetail: (product: Product) => void;

  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  setIsGA4ModalOpen: (open: boolean) => void;
  setIsDropAlertsOpen: (open: boolean) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsSearchOverlayOpen: (open: boolean) => void;
  setIsLoyaltyModalOpen: (open: boolean) => void;

  // Loyalty Actions
  earnPoints: (amount: number, reason: string) => void;
  claimDailyCheckin: () => boolean;
  redeemReward: (reward: RewardItem) => boolean;
  applyVoucher: (voucher: AppliedVoucher) => void;
  removeVoucher: () => void;

  showToast: (msg: string) => void;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
}

const defaultFilters: FilterState = {
  category: 'all',
  minPriceUSD: 0,
  maxPriceUSD: 200,
  badges: [],
  colors: [],
  sizes: [],
  rating: 0,
  onlyInStock: false,
  onlySustainable: false,
  sortBy: 'featured',
  searchQuery: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved preferences
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ggd_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('ggd_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>('INR'); // Default to INR as per regional prompt emphasis
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<string>('/');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Chrome Dino', 'Google Hoodie', 'Android', 'Kyoto']);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ggd_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ga4Events, setGA4Events] = useState<GA4Event[]>(getGA4Log());
  const [isGA4ModalOpen, setIsGA4ModalOpen] = useState<boolean>(false);
  const [isDropAlertsOpen, setIsDropAlertsOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState<boolean>(false);

  // Loyalty Rewards State
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ggd_loyalty_points');
      return saved !== null ? parseInt(saved, 10) : 350;
    } catch {
      return 350;
    }
  });

  const [pointActivities, setPointActivities] = useState<PointActivity[]>(() => {
    try {
      const saved = localStorage.getItem('ggd_point_activities');
      return saved ? JSON.parse(saved) : [
        {
          id: 'act_1',
          title: 'Google Gear Creator Club Welcome',
          points: 350,
          type: 'earned',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          description: 'Welcome bonus for joining Google Gear Drop Loyalty Program',
        }
      ];
    } catch {
      return [];
    }
  });

  const [unlockedVoucherCodes, setUnlockedVoucherCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ggd_unlocked_vouchers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(() => {
    return localStorage.getItem('ggd_last_checkin');
  });

  const loyaltyTier: LoyaltyTier =
    loyaltyPoints >= 3000 ? 'Platinum' :
    loyaltyPoints >= 1500 ? 'Gold' :
    loyaltyPoints >= 500 ? 'Silver' : 'Bronze';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userEmail] = useState<string>('priyalmagia1@gmail.com');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('ggd_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ggd_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ggd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ggd_loyalty_points', loyaltyPoints.toString());
  }, [loyaltyPoints]);

  useEffect(() => {
    localStorage.setItem('ggd_point_activities', JSON.stringify(pointActivities));
  }, [pointActivities]);

  useEffect(() => {
    localStorage.setItem('ggd_unlocked_vouchers', JSON.stringify(unlockedVoucherCodes));
  }, [unlockedVoucherCodes]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Online/Offline network monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('⚡ Back online! Synced live Google Gear inventory.');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('📡 Offline Mode Active: Browsing cached Google Gear Drop items.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // GA4 event listener subscription
  useEffect(() => {
    const unsubscribe = subscribeGA4((event) => {
      setGA4Events([...getGA4Log()]);
    });
    // Track initial page view
    trackGA4Event('page_view', { page_title: 'Google Gear Drop Home', page_path: '/' });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    showToast(`Currency switched to ${code === 'INR' ? 'Indian Rupees (₹)' : 'US Dollars ($)'}`);
    trackGA4Event('set_currency', { currency: code });
  };

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    showToast(`Language set to ${code.toUpperCase()}`);
    trackGA4Event('set_language', { language: code });
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    trackGA4Event('toggle_theme', { dark_mode: !darkMode });
  };

  const toggleLowBandwidth = () => {
    setLowBandwidth((prev) => !prev);
    showToast(!lowBandwidth ? 'Low-Bandwidth Mode Enabled (Data Saver)' : 'Standard High-Res Media Enabled');
  };

  const navigate = (view: string, param?: string) => {
    setActiveView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view.startsWith('/category/')) {
      const catSlug = view.replace('/category/', '');
      setFilters((prev) => ({ ...prev, category: catSlug, badges: [] }));
    } else if (view === '/new-drops') {
      setFilters((prev) => ({ ...prev, category: 'all', badges: ['New Drop'] }));
    } else if (view === '/shop') {
      setFilters((prev) => ({ ...prev, category: 'all', badges: [] }));
    }

    if (view.startsWith('/product/') && param) {
      const prod = PRODUCTS.find((p) => p.id === param);
      if (prod) {
        setDetailProduct(prod);
        trackGA4Event('view_item', {
          item_id: prod.id,
          item_name: prod.name,
          price: prod.priceUSD,
          item_category: prod.categoryName,
        });
      }
    } else {
      trackGA4Event('page_view', { page_path: view, page_title: `Google Gear Drop - ${view}` });
    }
  };

  const addToCart = (product: Product, color?: string, size?: string, quantity: number = 1) => {
    const selColor = color || (product.colors && product.colors[0]?.name);
    const selSize = size || (product.sizes && product.sizes[0]);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selColor &&
          item.selectedSize === selSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedColor: selColor, selectedSize: selSize, quantity }];
      }
    });

    showToast(`Added "${product.name}" to your cart!`);
    setIsCartDrawerOpen(true);

    trackGA4Event('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.priceUSD,
      quantity,
      selected_color: selColor,
      selected_size: selSize,
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    showToast('Removed item from cart.');
    trackGA4Event('remove_from_cart', { item_id: productId });
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.product.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.product.id !== product.id));
      showToast(`Removed "${product.name}" from Wishlist`);
      trackGA4Event('wishlist_interaction', { action: 'remove', item_id: product.id });
    } else {
      setWishlist((prev) => [
        ...prev,
        { product, addedAt: new Date().toLocaleDateString() },
      ]);
      showToast(`Saved "${product.name}" to Wishlist! ❤️`);
      trackGA4Event('wishlist_interaction', { action: 'add', item_id: product.id });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    trackGA4Event('quick_view_item', { item_id: product.id, item_name: product.name });
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const openProductDetail = (product: Product) => {
    setDetailProduct(product);
    navigate('/product/' + product.id, product.id);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const earnPoints = (amount: number, reason: string) => {
    if (amount <= 0) return;
    setLoyaltyPoints((prev) => prev + amount);
    const newAct: PointActivity = {
      id: 'act_' + Date.now(),
      title: reason,
      points: amount,
      type: 'earned',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Earned +${amount} Google Gear Points`,
    };
    setPointActivities((prev) => [newAct, ...prev]);
    showToast(`🎉 Earned +${amount} Google Gear Points!`);
    trackGA4Event('earn_loyalty_points', { points: amount, reason });
  };

  const claimDailyCheckin = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    if (lastCheckinDate === today) {
      showToast('⚡ Already claimed today\'s check-in bonus! Return tomorrow for +25 pts.');
      return false;
    }
    const bonus = 25;
    localStorage.setItem('ggd_last_checkin', today);
    setLastCheckinDate(today);
    earnPoints(bonus, 'Daily Drop Check-in Bonus');
    return true;
  };

  const redeemReward = (reward: RewardItem): boolean => {
    if (loyaltyPoints < reward.pointsRequired) {
      showToast(`⚠️ You need ${reward.pointsRequired - loyaltyPoints} more points to redeem this.`);
      return false;
    }

    setLoyaltyPoints((prev) => prev - reward.pointsRequired);
    setUnlockedVoucherCodes((prev) => Array.from(new Set([...prev, reward.code])));

    const newAct: PointActivity = {
      id: 'act_' + Date.now(),
      title: `Redeemed: ${reward.title}`,
      points: reward.pointsRequired,
      type: 'spent',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Unlocked Code: ${reward.code}`,
    };
    setPointActivities((prev) => [newAct, ...prev]);

    if (reward.type === 'voucher' && reward.discountAmountUSD > 0) {
      setAppliedVoucher({
        code: reward.code,
        discountAmountUSD: reward.discountAmountUSD,
        title: reward.title,
      });
      showToast(`🎁 Redeemed & applied voucher ${reward.code} (-$${reward.discountAmountUSD})!`);
    } else {
      showToast(`🎁 Successfully unlocked ${reward.title}! Code: ${reward.code}`);
    }

    trackGA4Event('redeem_loyalty_reward', { reward_id: reward.id, points: reward.pointsRequired });
    return true;
  };

  const applyVoucher = (voucher: AppliedVoucher) => {
    setAppliedVoucher(voucher);
    showToast(`🏷️ Applied discount voucher ${voucher.code} (-$${voucher.discountAmountUSD})`);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Removed discount voucher');
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const rawSubtotalUSD = cart.reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0);
    const discountUSD = appliedVoucher ? appliedVoucher.discountAmountUSD : 0;
    const subtotalUSD = Math.max(0, rawSubtotalUSD - discountUSD);
    const shippingUSD = subtotalUSD > 50 || (appliedVoucher && appliedVoucher.code === 'FREESHIP') ? 0 : 5.99;
    const totalUSD = subtotalUSD + shippingUSD;

    const payload = {
      items: cart,
      subtotalUSD,
      discountUSD,
      shippingUSD,
      totalUSD,
      currency,
      paymentMethod: orderData.paymentMethod || 'upi',
      upiId: orderData.upiId || 'googlepay@okaxis',
      shippingAddress: orderData.shippingAddress,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const newOrder: Order = {
        id: data.orderId || 'GGD-' + Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        subtotalUSD,
        discountUSD,
        shippingUSD,
        totalUSD,
        currency,
        totalInCurrency: currency === 'INR' ? Math.round(totalUSD * 85) : totalUSD,
        shippingAddress: orderData.shippingAddress!,
        paymentMethod: orderData.paymentMethod || 'upi',
        upiId: orderData.upiId,
        status: 'Order Placed',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        estimatedDelivery: data.estimatedDelivery || 'In 3-5 business days',
        trackingNumber: 'GGDTRK' + Math.floor(10000000 + Math.random() * 90000000),
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      setAppliedVoucher(null);

      // Award 10 points per $1 spent
      const pointsEarned = Math.round(totalUSD * 10);
      if (pointsEarned > 0) {
        earnPoints(pointsEarned, `Order Purchase Reward #${newOrder.id}`);
      }

      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'],
      });

      trackGA4Event('purchase', {
        transaction_id: newOrder.id,
        value: newOrder.totalUSD,
        currency,
        items: newOrder.items.map((i) => ({
          item_id: i.product.id,
          item_name: i.product.name,
          quantity: i.quantity,
          price: i.product.priceUSD,
        })),
      });

      return newOrder;
    } catch (e) {
      // Fallback local order placement if offline
      const newOrder: Order = {
        id: 'GGD-OFFLINE-' + Math.floor(10000 + Math.random() * 90000),
        items: [...cart],
        subtotalUSD,
        discountUSD,
        shippingUSD,
        totalUSD,
        currency,
        totalInCurrency: currency === 'INR' ? Math.round(totalUSD * 85) : totalUSD,
        shippingAddress: orderData.shippingAddress!,
        paymentMethod: orderData.paymentMethod || 'upi',
        upiId: orderData.upiId,
        status: 'Order Placed',
        createdAt: new Date().toLocaleDateString(),
        estimatedDelivery: 'In 3-5 business days',
        trackingNumber: 'GGDTRK-OFFLINE',
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      setAppliedVoucher(null);

      const pointsEarned = Math.round(totalUSD * 10);
      if (pointsEarned > 0) {
        earnPoints(pointsEarned, `Order Purchase Reward #${newOrder.id}`);
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'],
      });

      return newOrder;
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        currency,
        language,
        darkMode,
        isOffline,
        lowBandwidth,
        activeView,
        viewParam,
        quickViewProduct,
        detailProduct,
        filters,
        recentSearches,
        orders,
        ga4Events,
        isGA4ModalOpen,
        isDropAlertsOpen,
        isCartDrawerOpen,
        isSearchOverlayOpen,
        toastMessage,
        userEmail,

        loyaltyPoints,
        loyaltyTier,
        pointActivities,
        appliedVoucher,
        unlockedVoucherCodes,
        isLoyaltyModalOpen,
        lastCheckinDate,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setCurrency,
        setLanguage,
        toggleDarkMode,
        toggleLowBandwidth,
        navigate,
        openQuickView,
        closeQuickView,
        openProductDetail,
        setFilters,
        resetFilters,
        addRecentSearch,
        clearRecentSearches,
        setIsGA4ModalOpen,
        setIsDropAlertsOpen,
        setIsCartDrawerOpen,
        setIsSearchOverlayOpen,
        setIsLoyaltyModalOpen,

        earnPoints,
        claimDailyCheckin,
        redeemReward,
        applyVoucher,
        removeVoucher,

        showToast,
        placeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
