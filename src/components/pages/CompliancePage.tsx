'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Pill, Bar, Tbl } from '../ui';
import { COMP, RN } from '@/data/mockData';

export const CompliancePage: React.FC = () => {
  const { showToast, deIdentify } = useApp();

  return (
    <Page
      t="Compliance"
      s="Expiring items and RN visit requirements"
      a={<Btn onClick={() => showToast('Reminders sent to 6 caregivers')}>Send reminders</Btn>}
    >
      <Tbl
        rows={COMP}
        cols={[
          ['Caregiver', (r) => <b className="text-stone-900">{deIdentify(r.caregiver)}</b>],
          ['Item', (r) => r.item],
          ['Due', (r) => <span className="font-medium text-stone-700">{r.due}</span>],
          [
            'Status',
            (r) => (
              <Pill c={r.color}>
                {r.color === 'red' ? 'Expired' : r.color === 'amber' ? 'Expiring soon' : 'Current'}
              </Pill>
            ),
          ],
        ]}
      />

      <div>
        <H2>RN visit tracker by program</H2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {RN.map((r, i) => {
            const pct = Math.round((r.completed / r.total) * 100);
            return (
              <Card key={i}>
                <div className="font-bold text-stone-900 text-base">{r.program}</div>
                <div className="text-xs text-stone-600 mb-3 min-h-[32px] mt-0.5">{r.description}</div>
                <Bar v={pct} c={pct < 60 ? 'bg-amber-500' : ''} />
                <div className="text-xs text-stone-500 mt-2 font-medium">
                  {r.completed} of {r.total} visits on track
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Page>
  );
};
