import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Flame, Clock, ArrowRight } from 'lucide-react';

export const LimitedDropBanner: React.FC = () => {
  const { navigate } = useApp();
  const limitedProducts = PRODUCTS.filter((p) => p.isLimited).slice(0, 3);

  return (
    <section className="py-16 bg-gradient-to-r from-red-950/20 via-neutral-900 to-neutral-950 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Flame size={14} className="text-red-500" />
              <span>LIMITED AVAILABILITY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              LIMITED DROP 🔥
            </h2>
            <p className="text-sm text-neutral-300">
              Once it's gone, it's gone. Strictly limited production quantities.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="self-start md:self-auto font-bold text-xs text-red-400 hover:text-red-300 flex items-center gap-1 group"
          >
            <span>EXPLORE ALL LIMITED GEAR</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Limited Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {limitedProducts.map((prod) => (
            <div key={prod.id} className="space-y-2">
              <ProductCard product={prod} />
              
              {/* Stock Meter */}
              {prod.stockCount && (
                <div className="bg-neutral-800 p-3 rounded-2xl border border-neutral-700/80 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-red-400 flex items-center gap-1">
                      <Clock size={12} /> Stock Alert
                    </span>
                    <span className="text-white">{prod.stockCount} left in stock</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-yellow-500 rounded-full"
                      style={{ width: `${Math.min(100, (prod.stockCount / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
