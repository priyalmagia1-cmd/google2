import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Flame, ArrowLeft, ArrowRight } from 'lucide-react';

export const TrendingCarousel: React.FC = () => {
  const { navigate } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const trendingProducts = PRODUCTS.filter(
    (p) => p.badges.includes('Trending') || p.badges.includes('Best Seller')
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-neutral-50 dark:bg-[#151618] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-widest text-amber-500">
              <Flame size={16} fill="currentColor" />
              <span>MOST POPULAR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              TRENDING NOW 🔥
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The gear everyone is checking out right now on the Google Gear Drop store.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 transition-colors shadow-xs"
              aria-label="Scroll left"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 transition-colors shadow-xs"
              aria-label="Scroll right"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingProducts.map((prod) => (
            <div key={prod.id} className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start">
              <ProductCard product={prod} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/shop')}
            className="font-bold text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 uppercase tracking-wider"
          >
            VIEW ALL PRODUCTS →
          </button>
        </div>

      </div>
    </section>
  );
};
