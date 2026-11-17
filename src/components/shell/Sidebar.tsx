'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { NAV, G } from '@/data/mockData';

export const Sidebar: React.FC = () => {
  const { page, navigate, isMobileNavOpen, setIsMobileNavOpen } = useApp();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <aside
        style={{ backgroundColor: 'var(--green-900)' }}
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 w-64 z-40 overflow-y-auto text-white p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* LiliSare Official Brand */}
        <button
          type="button"
          onClick={() => navigate('today')}
          aria-label="LiliSare home"
          className="w-full bg-white rounded-2xl p-2.5 mb-6 shadow-sm border border-white/20 transition hover:shadow-md hover:scale-[1.01] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#F2B632]"
        >
          <img
            src="/lilisare-logo.png"
            alt="LiliSare – because we care"
            className="w-full h-auto max-h-14 object-contain"
          />
        </button>

        {/* Navigation Sections */}
        {NAV.map((group) => (
          <div key={group.name} className="mb-4">
            <div className="px-3 text-[11px] tracking-widest font-bold text-white/70 mb-1">
              {group.name}
            </div>
            {group.items.map((item) => {
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between rounded-full px-3 py-2 text-sm mb-0.5 transition font-medium ${
                    isActive
                      ? 'bg-white font-bold text-[#3E6B2B] shadow-sm'
                      : 'hover:bg-white/15 text-white/95'
                  }`}
                  style={isActive ? { color: 'var(--green-700)' } : {}}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-[#F2B632] text-stone-900 text-[11px] font-bold rounded-full px-2 py-0.5 leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </aside>
    </>
  );
};
