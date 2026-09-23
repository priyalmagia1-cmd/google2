import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const NewDropSection: React.FC = () => {
  const { navigate } = useApp();
  const newDropProducts = PRODUCTS.filter((p) => p.badges.includes('New Drop')).slice(0, 6);

  return (
    <section className="py-16 bg-neutral-50 dark:bg-[#151618] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <Sparkles size={16} />
              <span>FRESH RELEASE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              NEW DROP
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Fresh gear. Limited availability. Your chance to grab the latest Google merchandise before it sells out.
            </p>
          </div>

          <button
            onClick={() => navigate('/new-drops')}
            className="self-start md:self-auto font-bold text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group"
          >
            <span>VIEW ALL NEW DROPS</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newDropProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
