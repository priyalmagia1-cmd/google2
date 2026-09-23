import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Compass } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-16 bg-white dark:bg-[#18191C] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <Compass size={16} />
            <span>EXPLORE COLLECTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            FIND YOUR GEAR
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Discover official Google apparel, bags, drinkware, and desk collectibles tailored for your everyday lifestyle.
          </p>
        </div>

        {/* 5 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat.slug}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className={`group relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-72 ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end space-y-1 text-white">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                  {cat.itemCount} Items
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1">
                  {cat.description}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  <span>SHOP NOW</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
