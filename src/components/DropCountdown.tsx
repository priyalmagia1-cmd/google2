import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { trackGA4Event } from '../services/ga4';
import { Clock, Bell, Sparkles } from 'lucide-react';

export const DropCountdown: React.FC = () => {
  const { setIsDropAlertsOpen } = useApp();

  // Target time: 3 days, 14 hours, 22 mins, 45 secs from now
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAlertsClick = () => {
    trackGA4Event('get_drop_alerts_click', { position: 'countdown_banner' });
    setIsDropAlertsOpen(true);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-900 via-neutral-900 to-neutral-950 text-white border-b border-neutral-800 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Clock size={14} />
              <span>NEXT GOOGLE GEAR DROP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              NEXT DROP IN
            </h2>
            <p className="text-sm text-neutral-300">
              Stay tuned for the next exclusive Google Gear Drop release. Limited quantities available worldwide.
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                Days
              </span>
            </div>

            <span className="text-2xl font-black text-blue-500">:</span>

            <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                Hours
              </span>
            </div>

            <span className="text-2xl font-black text-blue-500">:</span>

            <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                Mins
              </span>
            </div>

            <span className="text-2xl font-black text-blue-500">:</span>

            <div className="flex flex-col items-center bg-neutral-900/90 border border-neutral-800 p-3 sm:p-4 rounded-2xl min-w-[70px] sm:min-w-[85px]">
              <span className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                Secs
              </span>
            </div>
          </div>

          {/* CTA */}
          <div>
            <button
              onClick={handleAlertsClick}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <Bell size={18} />
              <span>GET DROP ALERTS →</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
