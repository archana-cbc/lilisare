'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, Pill } from '../ui';
import { SYS } from '@/data/mockData';

export const SystemsPage: React.FC = () => {
  const { showToast } = useApp();

  return (
    <Page t="Connected Systems" s="Integrations planned for LiliSare">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SYS.map((s, idx) => (
          <Card key={idx} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-2">
                <div className="font-bold text-stone-900 text-base">{s.name}</div>
                <Pill>Not connected</Pill>
              </div>
              <p className="text-sm text-stone-600 mt-2 min-h-[44px] leading-snug">
                {s.description}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
              <span className="text-xs font-semibold bg-[#F2B632]/30 text-stone-900 rounded px-2 py-1">
                Planned release: {s.release}
              </span>
              <Btn k="ghost" onClick={() => showToast(`${s.name} is not available in this prototype`)}>
                Connect
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
};
