import React from 'react';
import { useApp } from '../context/AppContext';
import { clearGA4Log, trackGA4Event } from '../services/ga4';
import { BarChart2, X, Trash2, CheckCircle, ExternalLink, Code } from 'lucide-react';

export const GA4InspectorModal: React.FC = () => {
  const { isGA4ModalOpen, setIsGA4ModalOpen, ga4Events, showToast } = useApp();

  if (!isGA4ModalOpen) return null;

  const handleTestTrigger = (eventName: string) => {
    trackGA4Event(eventName, {
      test_trigger: true,
      utm_campaign: 'google_gear_drop',
      utm_source: 'ga4_inspector_modal',
    });
    showToast(`Triggered test GA4 event: ${eventName}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 text-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <BarChart2 size={22} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                GA4 Ecommerce Telemetry Inspector
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase">
                  Live Stream
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Auditing Google Analytics 4 event stream & campaign attribution (`utm_campaign=google_gear_drop`).
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGA4ModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Test Buttons */}
        <div className="p-4 bg-neutral-950/40 border-b border-neutral-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400 font-bold uppercase text-[10px]">Test Triggers:</span>
          <button
            onClick={() => handleTestTrigger('page_view')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
          >
            page_view
          </button>
          <button
            onClick={() => handleTestTrigger('view_item')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
          >
            view_item
          </button>
          <button
            onClick={() => handleTestTrigger('add_to_cart')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
          >
            add_to_cart
          </button>
          <button
            onClick={() => handleTestTrigger('begin_checkout')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
          >
            begin_checkout
          </button>
          <button
            onClick={() => handleTestTrigger('purchase')}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors"
          >
            purchase
          </button>
          <button
            onClick={() => {
              clearGA4Log();
              showToast('GA4 event log cleared.');
            }}
            className="ml-auto text-neutral-400 hover:text-red-400 flex items-center gap-1"
          >
            <Trash2 size={14} /> Clear Log
          </button>
        </div>

        {/* Event List Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {ga4Events.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-sans">
              No GA4 events logged yet. Perform actions like adding to cart or searching to view telemetry.
            </div>
          ) : (
            ga4Events.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                    <CheckCircle size={14} />
                    {evt.event_name}
                  </span>
                  <span className="text-[10px] text-neutral-500">{evt.timestamp}</span>
                </div>

                <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 text-[11px] text-neutral-300 overflow-x-auto">
                  <pre>{JSON.stringify(evt.params, null, 2)}</pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Campaign UTM: <code className="text-blue-400">utm_campaign=google_gear_drop</code></span>
          <button
            onClick={() => setIsGA4ModalOpen(false)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
