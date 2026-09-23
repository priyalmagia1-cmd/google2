import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

type VibeType = 'colorful' | 'tech' | 'essentials' | 'gift' | 'trending';

export const VibeSelector: React.FC = () => {
  const [selectedVibe, setSelectedVibe] = useState<VibeType>('trending');

  const vibes: { key: VibeType; label: string; icon: string }[] = [
    { key: 'trending', label: '🔥 Trending Gear', icon: '🔥' },
    { key: 'colorful', label: '🌈 Colorful & Fun', icon: '🌈' },
    { key: 'tech', label: '⚡ Tech & Minimal', icon: '⚡' },
    { key: 'essentials', label: '👕 Everyday Essentials', icon: '👕' },
    { key: 'gift', label: '🎁 Looking for a Gift', icon: '🎁' },
  ];

  const matchedProducts = PRODUCTS.filter((p) => p.vibe?.includes(selectedVibe)).slice(0, 4);

  return (
    <section className="py-16 bg-neutral-50 dark:bg-[#151618] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <Sparkles size={16} />
            <span>PERSONALIZED DISCOVERY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            WHAT'S YOUR GOOGLE VIBE?
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Select what you're looking for and discover your tailored Google gear.
          </p>
        </div>

        {/* Vibe Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {vibes.map((v) => (
            <button
              key={v.key}
              onClick={() => setSelectedVibe(v.key)}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 shadow-xs ${
                selectedVibe === v.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <span>{v.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {matchedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
