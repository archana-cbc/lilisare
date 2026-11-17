'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card } from '../ui';
import { STUB_DATA } from '@/data/mockData';

export const StubPage: React.FC<{ type: 'reports' | 'settings' }> = ({ type }) => {
  const { showToast } = useApp();
  const data = STUB_DATA[type];

  if (!data) return null;

  return (
    <Page t={data.title} s={data.subtitle}>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.items.map((item, idx) => (
          <Card key={idx} className="flex justify-between items-center gap-3">
            <div>
              <div className="font-bold text-sm text-stone-900">{item[0]}</div>
              <div className="text-xs text-stone-600 mt-0.5">{item[1]}</div>
            </div>
            <Btn k="ghost" onClick={() => showToast(`${item[0]}: demo action`)}>
              {item[2]}
            </Btn>
          </Card>
        ))}
      </div>
    </Page>
  );
};
