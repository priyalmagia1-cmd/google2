import React from 'react';
import { useApp } from '../context/AppContext';
import { trackGA4Event } from '../services/ga4';
import { ArrowRight, Sparkles, ShieldCheck, Flame } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate, setIsDropAlertsOpen } = useApp();

  const handleShopDropClick = () => {
    trackGA4Event('campaign_cta_click', { cta_label: 'SHOP THE DROP', position: 'hero' });
    navigate('/new-drops');
  };

  const handleExploreClick = () => {
    trackGA4Event('campaign_cta_click', { cta_label: 'EXPLORE ALL GEAR', position: 'hero' });
    navigate('/shop');
  };

  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden py-16 md:py-24 border-b border-neutral-800">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Campaign Tag */}
            <div className="inline-flex items-center gap-2 bg-neutral-800/80 border border-neutral-700/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-neutral-300 uppercase shadow-inner">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span>GOOGLE GEAR DROP / 2026</span>
              <span className="text-yellow-400 font-bold ml-1">★ LIMITED DROP</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white">
              THE LATEST <span className="bg-gradient-to-r from-blue-400 via-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">GOOGLE GEAR</span> HAS LANDED.
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover fresh Google merchandise designed for your everyday. Streetwear, Chrome Dino nostalgia, tech collectibles, and location-inspired apparel.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleShopDropClick}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                <span>SHOP THE DROP →</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleExploreClick}
                className="w-full sm:w-auto bg-neutral-800/90 hover:bg-neutral-700 text-white border border-neutral-700 font-bold text-sm px-7 py-4 rounded-2xl transition-all"
              >
                EXPLORE ALL GEAR
              </button>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl font-black text-white">35+</div>
                <div className="text-xs text-neutral-400">Exclusive Drops</div>
              </div>
              <div>
                <div className="text-xl font-black text-white">₹ / $</div>
                <div className="text-xs text-neutral-400">INR & USD Currency</div>
              </div>
              <div>
                <div className="text-xl font-black text-white">100%</div>
                <div className="text-xs text-neutral-400">Official Google Merch</div>
              </div>
            </div>

          </div>

          {/* Right Column Featured Editorial Image Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border-2 border-neutral-700 shadow-2xl bg-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80"
                alt="Google Gear Drop Hoodie"
                referrerPolicy="no-referrer"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              {/* Floating Badge Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-red-600 px-2.5 py-0.5 rounded-full tracking-wider">
                    FEATURED DROP
                  </span>
                  <span className="text-xs font-mono text-yellow-400 font-bold">Limited 2026 Batch</span>
                </div>
                <h3 className="font-bold text-sm text-white">Google Colorblock Heavyweight Hoodie</h3>
                <p className="text-xs text-neutral-300">450 GSM Heavy French Fleece with Primary Accent Cuff Stitching.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
