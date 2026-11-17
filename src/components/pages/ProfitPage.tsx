'use client';

import React from 'react';
import { Page, Card, H2, Pill, Tbl, Chart } from '../ui';
import { PROF, formatCurrency, G } from '@/data/mockData';

export const ProfitPage: React.FC = () => {
  return (
    <Page t="Client Profitability" s="Margin by program (fake numbers)">
      <Card>
        <H2>Margin % by program</H2>
        <Chart
          color={G}
          fmt={(x) => `${x}%`}
          data={PROF.map((p) => [p.program, Math.round(((p.revenue - p.cost) / p.revenue) * 100)])}
        />
      </Card>

      <Tbl
        rows={PROF}
        cols={[
          ['Program', (r) => <b className="text-stone-900">{r.program}</b>],
          ['Revenue', (r) => formatCurrency(r.revenue)],
          ['Cost', (r) => formatCurrency(r.cost)],
          ['Margin', (r) => <span className="font-semibold">{formatCurrency(r.revenue - r.cost)}</span>],
          [
            'Margin %',
            (r) => {
              const m = Math.round(((r.revenue - r.cost) / r.revenue) * 100);
              return <Pill c={m < 10 ? 'red' : m < 15 ? 'amber' : 'green'}>{m}%</Pill>;
            },
          ],
        ]}
      />
    </Page>
  );
};
