import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Leaf, Recycle, ArrowRight } from 'lucide-react';

export const SustainableSection: React.FC = () => {
  const { navigate } = useApp();
  const ecoProducts = PRODUCTS.filter((p) => p.isSustainable).slice(0, 4);

  return (
    <section className="py-16 bg-white dark:bg-[#18191C] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <Leaf size={16} />
              <span>ECO-FRIENDLY MERCHANDISE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              GOOD GEAR. BETTER CHOICES. ♻️
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Merchandise crafted from recycled ocean ocean plastic, organic bamboo fibers, and waterless organic cotton dyeing.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>SHOP SUSTAINABLE GEAR</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecoProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
