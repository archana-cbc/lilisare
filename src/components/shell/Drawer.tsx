'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Chip } from '../ui';

export const Drawer: React.FC = () => {
  const { feed, isDrawerOpen, setIsDrawerOpen } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Automation activity feed"
        className="absolute right-0 inset-y-0 w-full max-w-sm bg-white p-5 overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-100">
          <h2 className="font-bold text-[#1c2a17] text-base flex items-center gap-2">
            Automation activity{' '}
            <span className="text-xs font-semibold text-green-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-ping inline-block" />
              live
            </span>
          </h2>
          <button
            type="button"
            aria-label="Close feed"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 text-xl leading-none rounded-lg hover:bg-stone-100 transition"
          >
            ×
          </button>
        </div>

        <ul className="space-y-3 flex-1 overflow-y-auto pr-1">
          {feed.map((f, i) => (
            <li
              key={i}
              className="text-sm border-b border-stone-100 pb-3 last:border-none animate-fadeIn"
            >
              <div className="text-stone-900 leading-snug">{f.t}</div>
              <div className="flex gap-2 items-center mt-1.5">
                <Chip h={f.h} />
                <span className="text-xs text-stone-500 font-medium">{f.ago}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};
