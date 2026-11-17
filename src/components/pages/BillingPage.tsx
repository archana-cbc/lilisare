'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Pill, Tbl } from '../ui';
import { CLAIMS, formatCurrency } from '@/data/mockData';
import { PillColor } from '@/types';

export const BillingPage: React.FC = () => {
  const { showToast, deIdentify } = useApp();
  const denials = CLAIMS.filter((c) => c.status === 'Denied');

  const getStatusColor = (s: string): PillColor => {
    if (s === 'Paid') return 'green';
    if (s === 'Denied') return 'red';
    return 'amber';
  };

  return (
    <Page
      t="Billing"
      s="Claims by NPI, denials and payroll (placeholder rates)"
      a={<Btn onClick={() => showToast('Claims batch exported')}>Export claims</Btn>}
    >
      <Tbl
        rows={CLAIMS}
        cols={[
          ['Claim', (r) => <span className="font-mono font-medium text-stone-800">{r.claimId}</span>],
          ['NPI', (r) => <Pill>{r.npi}</Pill>],
          ['Client', (r) => deIdentify(r.client)],
          ['Program', (r) => r.program],
          ['Amount', (r) => <span className="font-semibold">{formatCurrency(r.amount)}</span>],
          ['Status', (r) => <Pill c={getStatusColor(r.status)}>{r.status}</Pill>],
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <H2>Denials queue</H2>
          <div className="divide-y divide-stone-100">
            {denials.map((d) => (
              <div key={d.claimId} className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-stone-800 font-medium">
                  {d.claimId} · {deIdentify(d.client)} · {formatCurrency(d.amount)}
                </span>
                <Btn k="ghost" onClick={() => showToast(`Appeal drafted for ${d.claimId}`)}>
                  Appeal
                </Btn>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <H2>Denial letter required for Medicaid</H2>
          <div className="divide-y divide-stone-100">
            {[
              ['CLM-7703', 'Requested Nov 10', 'amber'],
              ['CLM-7705', 'Not requested', 'red'],
              ['CLM-7699', 'Received', 'green'],
            ].map(([id, status, color]) => (
              <div key={id} className="flex justify-between items-center py-2.5 text-sm">
                <span className="font-medium text-stone-800">{id}</span>
                <Pill c={color as PillColor}>{status}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <H2>Payroll summary · ADP Run (employees)</H2>
          <div className="text-3xl font-extrabold text-stone-900">$184,300</div>
          <div className="text-sm text-stone-600 mt-1">
            712 employees · pay period ending Nov 15
          </div>
        </Card>

        <Card>
          <H2>Payroll summary · ADP Workforce Now (1099)</H2>
          <div className="text-3xl font-extrabold text-stone-900">$61,950</div>
          <div className="text-sm text-stone-600 mt-1">
            190 contractors · pay period ending Nov 15
          </div>
        </Card>
      </div>
    </Page>
  );
};
