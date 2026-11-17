'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { FeedItem, PillColor } from '@/types';
import { CL, CG, SEED_FEED, DEMO_EVENTS } from '@/data/mockData';

interface AppContextType {
  page: string;
  selectedId: string | null;
  navigate: (page: string, id?: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  feed: FeedItem[];
  addFeed: (text: string, isHumanAction?: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isTrainingMode: boolean;
  setIsTrainingMode: (on: boolean) => void;
  isDemoRunning: boolean;
  runDemo: () => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  deIdentify: (text: string) => string;
  isLoadingPage: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<string>('today');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>(SEED_FEED);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isTrainingMode, setIsTrainingMode] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  // Read initial hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setPage(hash);
        setSelectedId(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const navigate = useCallback((targetPage: string, id: string | null = null) => {
    window.location.hash = targetPage;
    setIsLoadingPage(true);
    setPage(targetPage);
    setSelectedId(id);
    setIsMobileNavOpen(false);
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 350);
  }, []);

  const addFeed = useCallback((text: string, isHumanAction = false) => {
    setFeed((prev) => [{ t: text, h: isHumanAction, ago: 'just now' }, ...prev]);
  }, []);

  const runDemo = useCallback(() => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setIsDrawerOpen(true);

    DEMO_EVENTS.forEach((item, index) => {
      setTimeout(() => {
        addFeed(item[0], item[1]);
        if (index === DEMO_EVENTS.length - 1) {
          setIsDemoRunning(false);
        }
      }, 1300 * (index + 1));
    });
  }, [isDemoRunning, addFeed]);

  // Name map for de-identification
  const nameMap = useMemo(() => {
    const map: Record<string, string> = {};
    CL.forEach((c, i) => {
      map[c.name] = `Test Client ${i + 1}`;
      const firstLast = c.name.split(' ');
      if (firstLast.length >= 2) {
        map[`${firstLast[0]} ${firstLast[1][0]}.`] = `Test Client ${i + 1}`;
      }
    });
    CG.forEach((c, i) => {
      map[c.name] = `Test Caregiver ${i + 1}`;
      const firstLast = c.name.split(' ');
      if (firstLast.length >= 2) {
        map[`${firstLast[0]} ${firstLast[1][0]}.`] = `Test Caregiver ${i + 1}`;
      }
    });
    return map;
  }, []);

  const deIdentify = useCallback(
    (text: string) => {
      if (!isTrainingMode || !text) return text;
      let result = text;
      Object.entries(nameMap).forEach(([real, fake]) => {
        result = result.replaceAll(real, fake);
      });
      return result;
    },
    [isTrainingMode, nameMap]
  );

  return (
    <AppContext.Provider
      value={{
        page,
        selectedId,
        navigate,
        toastMessage,
        showToast,
        feed,
        addFeed,
        isDrawerOpen,
        setIsDrawerOpen,
        isTrainingMode,
        setIsTrainingMode,
        isDemoRunning,
        runDemo,
        isMobileNavOpen,
        setIsMobileNavOpen,
        isUserMenuOpen,
        setIsUserMenuOpen,
        deIdentify,
        isLoadingPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
