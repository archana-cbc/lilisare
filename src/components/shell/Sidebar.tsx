'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { NAV, NavGroup, NavItem } from '@/data/mockData';

export const Sidebar: React.FC = () => {
  const { page, navigate, isMobileNavOpen, setIsMobileNavOpen, showToast } = useApp();

  // Desktop collapse state (full width vs. icon rail)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // User popover menu state at bottom of sidebar
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Expanded state for menu sections: key is group id, value is boolean
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV.forEach((group) => {
      // Auto-expand group if it contains the initial active page
      const containsActive = group.items.some((item) => item.id === page);
      initial[group.id] = containsActive || group.id === 'intake-menu';
    });
    return initial;
  });

  // Whenever the active page changes, auto-expand its parent group
  useEffect(() => {
    NAV.forEach((group) => {
      if (group.isExpandable && group.items.some((item) => item.id === page)) {
        setExpandedGroups((prev) => ({
          ...prev,
          [group.id]: true,
        }));
      }
    });
  }, [page]);

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      // If collapsed into rail mode, expanding a menu automatically uncollapses sidebar
      setIsCollapsed(false);
      setExpandedGroups((prev) => ({ ...prev, [groupId]: true }));
      return;
    }
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // SVG Icons matching modern stroke style from reference
  const renderIcon = (iconName: string, className = 'w-5 h-5 shrink-0') => {
    switch (iconName) {
      case 'home':
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5.5a1 1 0 0 1-1-1v-4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H4.5A1.5 1.5 0 0 1 3 19.5v-9z" />
          </svg>
        );
      case 'inbox':
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'pulse':
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <polyline strokeLinecap="round" strokeLinejoin="round" points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      case 'chart':
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <line x1="12" y1="20" x2="12" y2="10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="18" y1="20" x2="18" y2="4" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="6" y1="20" x2="6" y2="16" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="2" y1="20" x2="22" y2="20" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'settings':
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <aside
        style={{ backgroundColor: 'var(--green-900, #1b381e)' }}
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between text-white transition-all duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0 ${
          isCollapsed ? 'w-20 p-3' : 'w-64 p-3.5'
        } ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* TOP BRAND HEADER & COLLAPSE TOGGLE */}
        <div className="flex items-center justify-between gap-2 mb-4 shrink-0">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={() => {
                navigate('today');
                setIsMobileNavOpen(false);
              }}
              aria-label="LiliSare Home"
              className="flex-1 bg-white rounded-xl p-2 shadow-sm border border-white/20 transition hover:shadow-md hover:scale-[1.01] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#F2B632]"
            >
              <img
                src="/lilisare-logo.png"
                alt="LiliSare – because we care"
                className="w-full h-auto max-h-11 object-contain"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                navigate('today');
                setIsMobileNavOpen(false);
              }}
              aria-label="LiliSare Home"
              className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-sm border border-white/20 transition hover:scale-105 flex items-center justify-center mx-auto"
            >
              <img
                src="/lilisare-logo.png"
                alt="LiliSare"
                className="w-full h-full object-contain"
              />
            </button>
          )}

          {/* Desktop << / >> Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition shrink-0"
          >
            {isCollapsed ? (
              // >> icon
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            ) : (
              // << icon
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="11 19 4 12 11 5" />
                <polyline points="18 19 11 12 18 5" />
              </svg>
            )}
          </button>
        </div>

        {/* MIDDLE SCROLLABLE NAVIGATION LIST */}
        <nav className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
          {NAV.map((group) => {
            // Standalone Direct Link (e.g. Today)
            if (!group.isExpandable && group.directId) {
              const isActive = page === group.directId;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    navigate(group.directId!);
                    setIsMobileNavOpen(false);
                  }}
                  title={isCollapsed ? group.name : undefined}
                  className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition group ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold shadow-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}>
                      {renderIcon(group.icon)}
                    </span>
                    {!isCollapsed && <span className="truncate">{group.name}</span>}
                  </div>
                </button>
              );
            }

            // Expandable Menu Group
            const isExpanded = !!expandedGroups[group.id];
            const hasActiveChild = group.items.some((item) => item.id === page);
            // Sum of any badges in this group (e.g., 26 in Care Notes)
            const totalBadges = group.items.reduce((sum, item) => sum + (item.badge || 0), 0);

            return (
              <div key={group.id} className="relative">
                {/* Group Header Button */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  title={isCollapsed ? group.name : undefined}
                  aria-expanded={isExpanded}
                  className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition group ${
                    hasActiveChild && !isExpanded
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={hasActiveChild ? 'text-white' : 'text-white/80 group-hover:text-white'}>
                      {renderIcon(group.icon)}
                    </span>
                    {!isCollapsed && <span className="truncate">{group.name}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Show badge on parent when group is collapsed */}
                      {!isExpanded && totalBadges > 0 && (
                        <span className="bg-[#F2B632] text-stone-900 text-[11px] font-bold rounded-full px-2 py-0.5 leading-none shadow-xs">
                          {totalBadges}
                        </span>
                      )}

                      {/* Small Chevron indicator that rotates */}
                      <svg
                        className={`w-4 h-4 text-white/60 group-hover:text-white transition-transform duration-200 ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Submenu Tree with Vertical Guide Connector Line */}
                {isExpanded && !isCollapsed && (
                  <div className="relative pl-3 ml-6 my-1 border-l border-white/20 space-y-1">
                    {group.items.map((subItem) => {
                      const isSubActive = page === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          type="button"
                          onClick={() => {
                            navigate(subItem.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] font-normal transition text-left ${
                            isSubActive
                              ? 'bg-white/20 text-white font-semibold shadow-xs'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{subItem.label}</span>
                          {subItem.badge !== undefined && (
                            <span className="bg-[#F2B632] text-stone-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none ml-2">
                              {subItem.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* BOTTOM USER PROFILE CARD (Directly matching reference) */}
        <div className="pt-3 border-t border-white/15 shrink-0 relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-expanded={isProfileMenuOpen}
            className={`w-full flex items-center rounded-xl p-2 transition hover:bg-white/10 text-left ${
              isCollapsed ? 'justify-center p-1.5' : 'justify-between gap-2.5'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Vibrant Emerald Avatar with Initial 'A' */}
              <div className="w-9 h-9 rounded-full bg-[#10B981] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                A
              </div>

              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-white truncate leading-tight">
                    Archana
                  </div>
                  <div className="text-[11px] text-white/65 truncate leading-tight mt-0.5">
                    archana@creativebuffer.com
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <svg
                className={`w-4 h-4 text-white/60 transition-transform duration-200 shrink-0 ${
                  isProfileMenuOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Quick Profile Dropup Menu */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-16 left-2 right-2 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 p-1.5 z-50 text-xs">
              <div className="px-2.5 py-2 border-b border-stone-100 mb-1">
                <div className="font-bold text-stone-900">Archana</div>
                <div className="text-stone-500 truncate text-[11px]">archana@creativebuffer.com</div>
                <div className="inline-block mt-1 bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-1.5 py-0.5 rounded">
                  Administrator
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('users');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition flex items-center gap-2"
              >
                <span>👤</span> Caseload & Roles
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('settings');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition flex items-center gap-2"
              >
                <span>⚙️</span> Organization Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  showToast('Signed out (demo)');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-medium transition flex items-center gap-2"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
