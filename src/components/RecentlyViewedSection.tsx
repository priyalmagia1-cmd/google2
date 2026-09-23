import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { History, Trash2, ArrowRight, Eye, Sparkles } from 'lucide-react';

export const RecentlyViewedSection: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed, navigate } = useApp();

  // If there are no recently viewed items, show a subtle prompt or friendly placeholder
  if (recentlyViewed.length === 0) {
    return (
      <section className="py-12 bg-white dark:bg-[#121315] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <History size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white">
                  Recently Viewed Gear
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Browse products to build your personal history. Your last 5 viewed items will appear right here.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-black hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <span>Explore Catalog</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-[#121315] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <History size={15} />
              <span>YOUR BROWSING HISTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Recently Viewed</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {recentlyViewed.length} of 5
              </span>
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Pick up where you left off. Stored automatically in your browser's local storage.
            </p>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={clearRecentlyViewed}
              className="px-3.5 py-2 rounded-xl text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors flex items-center gap-1.5 border border-transparent hover:border-red-200 dark:hover:border-red-900/60"
              title="Clear browsing history"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 5-Item Grid / Responsive Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {recentlyViewed.slice(0, 5).map((product) => (
            <div key={product.id} className="h-full flex flex-col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
