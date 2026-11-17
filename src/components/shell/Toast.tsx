'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div aria-live="polite" className="fixed bottom-5 right-5 z-50 pointer-events-none">
      <div className="bg-stone-900 text-white text-sm rounded-lg px-4 py-3 shadow-2xl pointer-events-auto flex items-center gap-2 animate-bounce-short">
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
