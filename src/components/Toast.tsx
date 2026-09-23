import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white border border-neutral-800 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce text-xs font-bold max-w-md">
      <div className="p-1.5 rounded-xl bg-blue-600 text-white">
        <Sparkles size={16} />
      </div>
      <span>{toastMessage}</span>
    </div>
  );
};
