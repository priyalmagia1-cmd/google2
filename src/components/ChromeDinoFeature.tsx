import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Gamepad2, ArrowRight } from 'lucide-react';

export const ChromeDinoFeature: React.FC = () => {
  const { navigate } = useApp();
  const dinoProducts = PRODUCTS.filter((p) => p.isChromeDino).slice(0, 4);

  return (
    <section className="py-16 bg-white dark:bg-[#18191C] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="mb-12 rounded-3xl bg-neutral-900 text-white p-8 md:p-12 relative overflow-hidden border border-neutral-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full text-xs font-mono font-bold text-green-400 border border-neutral-700">
              <Gamepad2 size={16} />
              <span>CHROME DINO COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              THE INTERNET ICON IS BACK. 🦖
            </h2>
            <p className="text-sm text-neutral-300">
              From your offline browser screen straight to your everyday streetwear, desk plushies, and enamel pin sets.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-green-500 hover:bg-green-400 text-neutral-950 font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
            >
              <span>SHOP CHROME DINO →</span>
            </button>
          </div>

          <div className="flex-shrink-0 z-10">
            <img
              src="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&auto=format&fit=crop&q=80"
              alt="Chrome Dino Plushie"
              referrerPolicy="no-referrer"
              className="w-56 h-56 object-cover rounded-2xl shadow-2xl border-2 border-neutral-700"
            />
          </div>

          {/* Pixelated grid bg graphic */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(#34A853_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dinoProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
};
