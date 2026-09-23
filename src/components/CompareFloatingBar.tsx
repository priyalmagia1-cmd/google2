import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeftRight, X, Plus, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { formatPrice } from '../services/currency';

export const CompareFloatingBar: React.FC = () => {
  const {
    compareItems,
    isCompareModalOpen,
    setIsCompareModalOpen,
    removeFromCompare,
    clearCompare,
    currency,
  } = useApp();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Do not show if no items or if the full modal is currently open
  if (compareItems.length === 0 || isCompareModalOpen) {
    return null;
  }

  const maxSlots = 3;
  const emptyCount = Math.max(0, maxSlots - compareItems.length);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-slide-up">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20"
        >
          <ArrowLeftRight size={16} />
          <span>Compare Gear ({compareItems.length}/3)</span>
          <ChevronUp size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-slide-up">
      <div className="bg-white/95 dark:bg-[#1A1B1E]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
        
        {/* Left Info & Slots */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-1">
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 font-black text-xs text-neutral-900 dark:text-white">
              <ArrowLeftRight size={14} className="text-blue-600 dark:text-blue-400" />
              <span>Compare ({compareItems.length}/3)</span>
            </div>
            <button
              onClick={clearCompare}
              className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Slots Container */}
          <div className="flex items-center gap-2">
            {compareItems.map((p) => (
              <div
                key={p.id}
                className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Remove item button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(p.id);
                  }}
                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  title={`Remove ${p.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: emptyCount }).map((_, idx) => (
              <button
                key={`bar-empty-${idx}`}
                onClick={() => setIsCompareModalOpen(true)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:border-blue-500 hover:text-blue-500 flex flex-col items-center justify-center transition-colors flex-shrink-0"
                title="Add product to comparison"
              >
                <Plus size={16} />
                <span className="text-[9px] font-bold">+ Slot</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 hover:scale-102"
          >
            <ArrowLeftRight size={15} />
            <span>Compare Now</span>
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Minimize comparison bar"
          >
            <ChevronDown size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
