import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Gift, Sparkles, ArrowRight } from 'lucide-react';

export const HiddenGemsSection: React.FC = () => {
  const { navigate } = useApp();
  const hiddenGems = PRODUCTS.filter((p) => p.isHiddenGem).slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-br from-purple-900/10 via-neutral-900 to-neutral-950 text-white border-b border-neutral-800 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Gift size={14} />
              <span>SIGNATURE COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              DID YOU KNOW GOOGLE MADE THIS? 🎁
            </h2>
            <p className="text-sm text-neutral-300">
              Discover unexpected collectibles, quirky accessories, and hidden merchandise hiding beyond the usual Google logo.
            </p>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="self-start md:self-auto font-bold text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 group"
          >
            <span>DISCOVER ALL HIDDEN GEMS</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Hidden Gems Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hiddenGems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
