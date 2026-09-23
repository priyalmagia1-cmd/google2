import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Plane, Compass, ArrowRight } from 'lucide-react';

export const AroundTheWorldSection: React.FC = () => {
  const { navigate } = useApp();
  const worldProducts = PRODUCTS.filter((p) => p.isWorldLocation).slice(0, 3);

  return (
    <section className="py-16 bg-white dark:bg-[#18191C] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-neutral-900 to-teal-950 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Compass size={14} />
              <span>GLOBAL LOCATION EDITIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              GOOGLE, BUT MAKE IT TRAVEL. 🌏
            </h2>
            <p className="text-sm text-neutral-300">
              Location-inspired Google merchandise celebrating engineering centers worldwide — from Kyoto bamboo gardens to Nara deer sanctuaries and Shibuya neon towers.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>EXPLORE GLOBAL GEAR →</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {worldProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
