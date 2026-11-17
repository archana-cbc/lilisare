'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Pill } from '../ui';
import { ROAD } from '@/data/mockData';
import { PillColor } from '@/types';

export const RoadmapPage: React.FC = () => {
  const { navigate } = useApp();

  const getStatusColor = (status: string): PillColor => {
    if (status.startsWith('Live')) return 'green';
    if (status === 'In build') return 'amber';
    return 'gray';
  };

  return (
    <Page
      t="What we are building"
      s="Rollout order: Mountain Lane first, then IRSS, CNA, Frisco"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {ROAD.map((col, idx) => (
          <div key={idx} className="space-y-3">
            <H2 className="text-lg">{col.title}</H2>
            <div className="space-y-3">
              {col.features.map((feat, fIdx) => (
                <Card key={fIdx} className="!p-4 hover:border-stone-300 transition">
                  <div className="flex justify-between items-start gap-2">
                    <b className="text-sm font-semibold text-stone-900">{feat.name}</b>
                    <Pill c={getStatusColor(feat.status)}>{feat.status}</Pill>
                  </div>
                  <div className="mt-3">
                    <Btn k="ghost" onClick={() => navigate(feat.page)}>
                      Preview
                    </Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};
