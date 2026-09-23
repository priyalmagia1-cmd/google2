import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Shirt, ArrowRight } from 'lucide-react';

export const StreetwearSection: React.FC = () => {
  const { navigate } = useApp();
  const streetwearItems = PRODUCTS.filter((p) => p.isStreetwear).slice(0, 4);

  return (
    <section className="py-16 bg-neutral-50 dark:bg-[#151618] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <Shirt size={16} />
              <span>STREETWEAR & ESSENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              WEAR YOUR GOOGLE 👕
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Heavyweight cotton tees, oversized colorblock hoodies, corduroy dad hats, and skate socks designed for campus, commute, and everyday style.
            </p>
          </div>

          <button
            onClick={() => navigate('/category/apparel')}
            className="font-bold text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>SHOP STREETWEAR</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {streetwearItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

      </div>
    </section>
  );
};
