import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { formatPrice } from '../services/currency';
import { Sparkles, Plus, ShoppingBag, Check } from 'lucide-react';

export const CompleteYourLook: React.FC = () => {
  const { currency, addToCart, showToast } = useApp();

  // Pick 3 bundle items
  const tee = PRODUCTS.find((p) => p.id === 'dino-oversized-tee') || PRODUCTS[0];
  const cap = PRODUCTS.find((p) => p.id === 'pixel-art-corduroy-cap') || PRODUCTS[1];
  const bag = PRODUCTS.find((p) => p.id === 'recycled-ocean-backpack') || PRODUCTS[2];

  const bundleItems = [tee, cap, bag];
  const bundleTotalUSD = bundleItems.reduce((acc, p) => acc + p.priceUSD, 0);
  const bundleDiscountUSD = bundleTotalUSD * 0.15; // 15% bundle discount
  const finalBundleUSD = bundleTotalUSD - bundleDiscountUSD;

  const handleAddBundle = () => {
    bundleItems.forEach((p) => addToCart(p, undefined, undefined, 1));
    showToast('🎉 Added Complete Google Look Bundle (15% Off) to cart!');
  };

  return (
    <section className="py-16 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-blue-950/60 via-neutral-900 to-neutral-950 p-8 md:p-12 rounded-3xl border border-neutral-800 shadow-2xl">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950 border border-blue-800 px-3 py-1 rounded-full">
              BUNDLE & SAVE 15%
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              COMPLETE YOUR GOOGLE LOOK
            </h2>
            <p className="text-sm text-neutral-300">
              Pair the Chrome Dino Oversized Tee with the Pixel Art Corduroy Cap and Recycled Ocean Backpack for the ultimate Google streetwear look.
            </p>
          </div>

          {/* Bundle Items Visual Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {bundleItems.map((item, idx) => (
              <div
                key={item.id}
                className="relative bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/80 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-xl bg-neutral-900 border border-neutral-700 flex-shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                    Step {idx + 1}
                  </span>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{item.name}</h4>
                  <div className="text-xs font-black text-blue-400">
                    {formatPrice(item.priceUSD, currency)}
                  </div>
                </div>

                {idx < 2 && (
                  <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-blue-600 text-white items-center justify-center font-black shadow-md">
                    +
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bundle Action Footer */}
          <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-xs text-neutral-400 font-medium">Bundle Total (15% Savings Included)</div>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <span className="text-2xl font-black text-white">
                  {formatPrice(finalBundleUSD, currency)}
                </span>
                <span className="text-sm font-bold text-neutral-500 line-through">
                  {formatPrice(bundleTotalUSD, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              <span>SHOP THE LOOK (ADD ALL 3 TO CART) →</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
