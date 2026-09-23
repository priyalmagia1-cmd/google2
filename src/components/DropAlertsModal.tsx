import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { trackGA4Event } from '../services/ga4';
import { Sparkles, X, CheckCircle, BellRing, Mail } from 'lucide-react';

export const DropAlertsModal: React.FC = () => {
  const { isDropAlertsOpen, setIsDropAlertsOpen, showToast, userEmail } = useApp();
  const [email, setEmail] = useState(userEmail);
  const [submitted, setSubmitted] = useState(false);

  if (!isDropAlertsOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      showToast('🚀 Registered for Google Gear Drop SMS & Email Alerts!');
      trackGA4Event('get_drop_alerts_click', { email, channel: 'modal_signup' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1C1D21] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative space-y-4">
        
        <button
          onClick={() => {
            setIsDropAlertsOpen(false);
            setSubmitted(false);
          }}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <BellRing size={24} />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
            GOOGLE GEAR DROP VIP
          </span>
          <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white mt-2">
            NEVER MISS A GOOGLE GEAR DROP
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Get instant early access SMS & email notifications 1 hour before limited-edition Google merchandise drops go live.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center space-y-2">
            <CheckCircle size={32} className="text-emerald-500 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">You're officially on the VIP Drop List!</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              We'll send your exclusive drop access code to <span className="font-mono font-bold">{email}</span>.
            </p>
            <button
              onClick={() => setIsDropAlertsOpen(false)}
              className="mt-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-neutral-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>GET DROP ALERTS →</span>
            </button>
          </form>
        )}

        <div className="text-[10px] text-neutral-400 text-center">
          Unsubscribe anytime. Zero spam guarantee.
        </div>

      </div>
    </div>
  );
};
