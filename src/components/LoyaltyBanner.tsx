import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Gift, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';

export const LoyaltyBanner: React.FC = () => {
  const { loyaltyPoints, loyaltyTier, setIsLoyaltyModalOpen, claimDailyCheckin, lastCheckinDate } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = lastCheckinDate === today;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white relative overflow-hidden">
      {/* Decorative gradient blur background shapes */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold uppercase tracking-wider">
            <Award size={14} />
            <span>Google Gear Creator Club</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Earn Points & Unlock Exclusive Google Gear Rewards
          </h2>

          <p className="text-sm text-blue-100/90 leading-relaxed">
            Join thousands of Google Gear creators. Earn 10 points for every $1 spent, claim daily drop bonuses, and redeem vouchers for free streetwear & pins!
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => setIsLoyaltyModalOpen(true)}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs sm:text-sm font-extrabold rounded-full transition-all shadow-lg flex items-center gap-2 hover:scale-105"
            >
              <Gift size={18} />
              <span>Explore My Rewards ({loyaltyPoints} PTS)</span>
            </button>

            <button
              onClick={() => claimDailyCheckin()}
              disabled={isClaimedToday}
              className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                isClaimedToday
                  ? 'bg-white/10 border-white/20 text-blue-200 cursor-default'
                  : 'bg-white/15 hover:bg-white/25 border-white/30 text-white hover:scale-105'
              }`}
            >
              <Zap size={16} className={isClaimedToday ? 'text-emerald-400' : 'text-yellow-300'} />
              <span>{isClaimedToday ? 'Daily Bonus Claimed!' : 'Claim Daily +25 PTS'}</span>
            </button>
          </div>
        </div>

        {/* Loyalty Tier Status Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <Crown className="text-yellow-300" size={20} />
              <span className="font-extrabold text-sm uppercase tracking-wider">{loyaltyTier} Status</span>
            </div>
            <span className="text-xs font-bold text-yellow-300 bg-yellow-400/20 border border-yellow-400/30 px-3 py-1 rounded-full">
              {loyaltyPoints} Total PTS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/10">
              <div className="font-black text-sm text-yellow-300">$5 OFF</div>
              <div className="text-[10px] text-blue-200 mt-0.5">300 PTS</div>
            </div>
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/10">
              <div className="font-black text-sm text-yellow-300">$10 OFF</div>
              <div className="text-[10px] text-blue-200 mt-0.5">550 PTS</div>
            </div>
            <div className="p-2.5 bg-black/20 rounded-xl border border-white/10">
              <div className="font-black text-sm text-yellow-300">$25 VIP</div>
              <div className="text-[10px] text-blue-200 mt-0.5">1,200 PTS</div>
            </div>
          </div>

          <button
            onClick={() => setIsLoyaltyModalOpen(true)}
            className="w-full py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
          >
            <span>View All Vouchers & Perks</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
