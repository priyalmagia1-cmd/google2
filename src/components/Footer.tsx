import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { trackGA4Event } from '../services/ga4';
import {
  Sparkles,
  BarChart2,
  Shield,
  Truck,
  RotateCcw,
  Globe,
  Wifi,
  WifiOff,
  CheckCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    navigate,
    setIsGA4ModalOpen,
    setIsDropAlertsOpen,
    currency,
    setCurrency,
    lowBandwidth,
    toggleLowBandwidth,
    showToast,
  } = useApp();

  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
      showToast('🚀 Registered for Google Gear Drop Alerts!');
      trackGA4Event('get_drop_alerts_click', { email: emailInput });
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-12 border-t border-neutral-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Official Google Gear</h4>
              <p className="text-xs text-neutral-400">Authentic Google merchandise & drops.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Express Global Shipping</h4>
              <p className="text-xs text-neutral-400">Free shipping on orders over $50 / ₹4,250.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800">
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Easy 30-Day Returns</h4>
              <p className="text-xs text-neutral-400">Hassle-free exchanges and full refunds.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Secure Local Payments</h4>
              <p className="text-xs text-neutral-400">UPI, Cards, GPay & Netbanking supported.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]"></span>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                GOOGLE GEAR DROP
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm">
              The latest Google gear has landed. Transforming the Google Merchandise Store into a streetwear, technology, and collectibles destination.
            </p>

            {/* Drop Alerts Form */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                GET DROP ALERTS
              </h5>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                  <CheckCircle size={16} />
                  <span>You're on the list for the next Google Gear Drop!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-xl px-3.5 py-2.5 flex-1 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                  >
                    ALERTS
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li><button onClick={() => navigate('/new-drops')} className="hover:text-white transition-colors">New Drops 🚀</button></li>
              <li><button onClick={() => navigate('/category/apparel')} className="hover:text-white transition-colors">Google Streetwear</button></li>
              <li><button onClick={() => navigate('/category/accessories')} className="hover:text-white transition-colors">Caps & Accessories</button></li>
              <li><button onClick={() => navigate('/category/bags')} className="hover:text-white transition-colors">Bags & Carry</button></li>
              <li><button onClick={() => navigate('/category/drinkware')} className="hover:text-white transition-colors">Tumblers & Drinkware</button></li>
              <li><button onClick={() => navigate('/category/gifts')} className="hover:text-white transition-colors">Gifts & Collectibles</button></li>
            </ul>
          </div>

          {/* Special Drops */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
              Special Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li><button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">Chrome Dino 🦖</button></li>
              <li><button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">Android & Tech Culture 🤖</button></li>
              <li><button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">Google Around the World 🌏</button></li>
              <li><button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">Sustainable Gear ♻️</button></li>
              <li><button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">Hidden Gems 🎁</button></li>
            </ul>
          </div>

          {/* Account & Telemetry */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
              Account & Telemetry
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li><button onClick={() => navigate('/account')} className="hover:text-white transition-colors">Order History & Tracking</button></li>
              <li><button onClick={() => navigate('/wishlist')} className="hover:text-white transition-colors">Saved Wishlist</button></li>
              <li>
                <button
                  onClick={() => setIsGA4ModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <BarChart2 size={14} />
                  GA4 Event Inspector
                </button>
              </li>
              <li>
                <button
                  onClick={toggleLowBandwidth}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  {lowBandwidth ? <WifiOff size={14} className="text-amber-400" /> : <Wifi size={14} />}
                  <span>{lowBandwidth ? 'Low-Bandwidth (Active)' : 'Low-Bandwidth Mode'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          © 2026 Google Gear Drop — Redesign of Google Merchandise Store (shop.merch.google).
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Globe size={14} /> Region: India / Global
          </span>
          <button
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            className="text-neutral-400 hover:text-white font-bold"
          >
            Currency: {currency === 'INR' ? '₹ INR (Indian Rupees)' : '$ USD (US Dollars)'}
          </button>
        </div>
      </div>
    </footer>
  );
};
