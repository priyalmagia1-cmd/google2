import React, { useState } from 'react';
import {
  Award,
  Gift,
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Zap,
  TrendingUp,
  Tag,
  Crown,
  Share2,
  MessageSquare,
  ShoppingBag,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REWARDS_CATALOG } from '../data/rewards';
import { RewardItem } from '../types';
import confetti from 'canvas-confetti';

export const LoyaltyRewardsModal: React.FC = () => {
  const {
    loyaltyPoints,
    loyaltyTier,
    pointActivities,
    appliedVoucher,
    unlockedVoucherCodes,
    isLoyaltyModalOpen,
    setIsLoyaltyModalOpen,
    lastCheckinDate,
    claimDailyCheckin,
    redeemReward,
    applyVoucher,
    removeVoucher,
    earnPoints,
    currency,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'redeem' | 'earn' | 'perks' | 'history'>('redeem');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isLoyaltyModalOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const isCheckinClaimedToday = lastCheckinDate === today;

  // Tier Progress Calculation
  const nextTierPoints =
    loyaltyTier === 'Bronze' ? 500 :
    loyaltyTier === 'Silver' ? 1500 :
    loyaltyTier === 'Gold' ? 3000 : 3000;

  const prevTierPoints =
    loyaltyTier === 'Bronze' ? 0 :
    loyaltyTier === 'Silver' ? 500 :
    loyaltyTier === 'Gold' ? 1500 : 3000;

  const progressPercent =
    loyaltyTier === 'Platinum'
      ? 100
      : Math.min(100, Math.max(0, Math.round(((loyaltyPoints - prevTierPoints) / (nextTierPoints - prevTierPoints)) * 100)));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Copied code ${code} to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareDrop = () => {
    earnPoints(15, 'Shared Google Gear Drop');
    showToast('✨ Earned +15 points for sharing Google Gear Drop!');
  };

  const handleSimulateReview = () => {
    earnPoints(50, 'Submitted Google Gear Product Review');
    showToast('⭐ Earned +50 points for reviewing Google Gear!');
  };

  const tierColors = {
    Bronze: 'from-amber-600 to-amber-800 text-amber-100',
    Silver: 'from-slate-400 to-slate-600 text-slate-100',
    Gold: 'from-yellow-400 via-amber-500 to-yellow-600 text-yellow-950',
    Platinum: 'from-cyan-500 via-blue-600 to-indigo-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#18191C] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Header Bar */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <button
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Close Rewards"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-2 text-blue-100 text-xs font-bold tracking-widest uppercase">
            <Award size={16} className="text-yellow-300" />
            <span>Google Gear Creator Club</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {loyaltyPoints.toLocaleString()}{' '}
                <span className="text-yellow-300 text-lg font-bold">PTS</span>
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Earn 10 points for every $1 spent on Google Gear Drops
              </p>
            </div>

            {/* Member Tier Pill */}
            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${tierColors[loyaltyTier]} font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-2 self-start sm:self-auto border border-white/20`}>
              <Crown size={16} />
              <span>{loyaltyTier} Member</span>
            </div>
          </div>

          {/* Tier Progress Bar */}
          <div className="mt-5 bg-black/20 p-3 rounded-xl border border-white/10">
            <div className="flex justify-between text-xs font-bold mb-1.5 text-blue-100">
              <span>{loyaltyTier} Tier</span>
              {loyaltyTier !== 'Platinum' ? (
                <span>
                  {nextTierPoints - loyaltyPoints} pts to{' '}
                  {loyaltyTier === 'Bronze' ? 'Silver' : loyaltyTier === 'Silver' ? 'Gold' : 'Platinum'}
                </span>
              ) : (
                <span>Highest VIP Tier Unlocked! 🎉</span>
              )}
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-yellow-400 h-full transition-all duration-500 rounded-full shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#121315] px-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'redeem'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Gift size={16} />
            <span>Redeem Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab('earn')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'earn'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Zap size={16} />
            <span>Earn Points</span>
          </button>

          <button
            onClick={() => setActiveTab('perks')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'perks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Crown size={16} />
            <span>Tier Perks</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp size={16} />
            <span>Activity Log</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* REDEEM REWARDS TAB */}
          {activeTab === 'redeem' && (
            <div className="space-y-4">
              {appliedVoucher && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <Tag size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        Active Cart Discount
                      </div>
                      <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                        {appliedVoucher.title} ({appliedVoucher.code})
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/60"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {REWARDS_CATALOG.map((reward: RewardItem) => {
                  const isUnlocked = unlockedVoucherCodes.includes(reward.code);
                  const isApplied = appliedVoucher?.code === reward.code;
                  const canAfford = loyaltyPoints >= reward.pointsRequired;

                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isApplied
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1f2023] hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            <Sparkles size={12} />
                            {reward.pointsRequired} PTS
                          </span>
                          {reward.badge && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              {reward.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                          {reward.title}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {reward.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                        {isUnlocked ? (
                          <div className="flex items-center gap-2 w-full">
                            <button
                              onClick={() => handleCopyCode(reward.code)}
                              className="flex-1 py-1.5 px-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                            >
                              {copiedCode === reward.code ? (
                                <>
                                  <Check size={14} className="text-emerald-500" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>{reward.code}</span>
                                </>
                              )}
                            </button>

                            {reward.type === 'voucher' && (
                              <button
                                onClick={() =>
                                  applyVoucher({
                                    code: reward.code,
                                    discountAmountUSD: reward.discountAmountUSD,
                                    title: reward.title,
                                  })
                                }
                                disabled={isApplied}
                                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                                  isApplied
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {isApplied ? 'Applied' : 'Apply'}
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (canAfford) {
                                redeemReward(reward);
                                confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
                              } else {
                                showToast(`Need ${reward.pointsRequired - loyaltyPoints} more points`);
                              }
                            }}
                            disabled={!canAfford}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              canAfford
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                            }`}
                          >
                            <Gift size={14} />
                            <span>{canAfford ? 'Redeem Voucher' : 'Locked'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EARN POINTS TAB */}
          {activeTab === 'earn' && (
            <div className="space-y-3">
              {/* Daily Check-in Card */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                        Daily Drop Check-In
                      </h4>
                      <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase">
                        +25 PTS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      Check in every day to collect free Google Gear Creator points.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const claimed = claimDailyCheckin();
                    if (claimed) {
                      confetti({ particleCount: 50, spread: 40 });
                    }
                  }}
                  disabled={isCheckinClaimedToday}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCheckinClaimedToday
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs font-extrabold'
                  }`}
                >
                  {isCheckinClaimedToday ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span>Claimed Today</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Claim +25 PTS</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1f2023] rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                      <ShoppingBag size={18} />
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      Shop Google Drops
                    </h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                      Earn 10 points for every $1 spent on apparel & gear.
                    </p>
                  </div>
                  <div className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400">
                    Auto-credited at checkout
                  </div>
                </div>

                <div className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1f2023] rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                      <Share2 size={18} />
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      Share Google Drop
                    </h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                      Share product links with fellow creators.
                    </p>
                  </div>
                  <button
                    onClick={handleShareDrop}
                    className="mt-3 py-1.5 px-3 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Share Link</span>
                    <span className="font-black text-[10px]">+15 PTS</span>
                  </button>
                </div>

                <div className="p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1f2023] rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                      <MessageSquare size={18} />
                    </div>
                    <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      Write Gear Review
                    </h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                      Rate and review your Google Gear purchases.
                    </p>
                  </div>
                  <button
                    onClick={handleSimulateReview}
                    className="mt-3 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Add Review</span>
                    <span className="font-black text-[10px]">+50 PTS</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TIER PERKS TAB */}
          {activeTab === 'perks' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-4 rounded-xl border ${
                    loyaltyTier === 'Bronze'
                      ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-amber-700 dark:text-amber-400">
                      Bronze Creator
                    </span>
                    <span className="text-xs font-bold text-neutral-500">0 - 499 PTS</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>10 Points per $1 spent</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>Access to standard drop vouchers</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    loyaltyTier === 'Silver'
                      ? 'border-slate-500 bg-slate-50/30 dark:bg-slate-950/20'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-slate-700 dark:text-slate-300">
                      Silver Creator
                    </span>
                    <span className="text-xs font-bold text-neutral-500">500 - 1,499 PTS</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>12 Points per $1 spent (1.2x Multiplier)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>Free Express Shipping vouchers</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    loyaltyTier === 'Gold'
                      ? 'border-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/20'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-yellow-600 dark:text-yellow-400">
                      Gold Pioneer
                    </span>
                    <span className="text-xs font-bold text-neutral-500">1,500 - 2,999 PTS</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>15 Points per $1 spent (1.5x Multiplier)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>12-Hour Early Access to Limited Drops</span>
                    </li>
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    loyaltyTier === 'Platinum'
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                      Platinum VIP Legend
                    </span>
                    <span className="text-xs font-bold text-neutral-500">3,000+ PTS</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>20 Points per $1 spent (2.0x Multiplier)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>24-Hour VIP Early Access + Exclusive Merch Pins</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY LOG TAB */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {pointActivities.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No activity history yet. Earn or redeem points to see logs!
                </p>
              ) : (
                pointActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1f2023] rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {act.date} • {act.description}
                      </div>
                    </div>
                    <div
                      className={`font-extrabold text-sm ${
                        act.type === 'earned' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {act.type === 'earned' ? `+${act.points}` : `-${act.points}`} PTS
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-[#121315] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-blue-500" />
            <span>Google Gear Creator Guarantee</span>
          </div>
          <button
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
