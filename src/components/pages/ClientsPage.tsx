'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Pill, Tbl } from '../ui';
import { CL } from '@/data/mockData';
import { ProfileView } from './ProfileView';

export const ClientsPage: React.FC = () => {
  const { selectedId, navigate, deIdentify } = useApp();
  const [q, setQ] = useState('');

  const currentClient = CL.find((x) => x.id === selectedId);

  if (currentClient) {
    return <ProfileView client={currentClient} back={() => navigate('clients', null)} />;
  }

  const rows = CL.filter((r) => {
    const raw = `${r.id} ${r.name} ${r.program} ${r.caseManager} ${r.caregivers.join(' ')}`;
    const deIdentified = `${r.id} ${deIdentify(r.name)} ${r.program} ${r.caseManager} ${r.caregivers.map((c) => deIdentify(c)).join(' ')}`;
    return (
      raw.toLowerCase().includes(q.toLowerCase()) ||
      deIdentified.toLowerCase().includes(q.toLowerCase())
    );
  });

  return (
    <Page
      t="Clients"
      s="Client records, linked to their caregivers"
      a={
        <input
          aria-label="Search clients"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients…"
          className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white w-60 focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
        />
      }
    >
      <Tbl
        rows={rows}
        onRow={(r) => navigate('clients', r.id)}
        cols={[
          ['ID', (r) => <span className="font-mono text-xs text-stone-500">{r.id}</span>],
          ['Client', (r) => <b className="text-stone-900">{deIdentify(r.name)}</b>],
          ['Program', (r) => <Pill>{r.program}</Pill>],
          ['Case manager', (r) => r.caseManager],
          ['Linked caregiver(s)', (r) => r.caregivers.map((c) => deIdentify(c)).join(', ')],
          [
            'Authorization',
            (r) => (
              <Pill c={r.authorization === 'Active' ? 'green' : r.authorization === 'Expired' ? 'red' : 'amber'}>
                {r.authorization}
              </Pill>
            ),
          ],
          ['Next RN visit', (r) => r.nextRnVisit],
        ]}
      />

      {/* Program and Business Line Distribution */}
      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#1c2a17] mb-3">Clients by Program</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['IHSS', '148 clients', '30%'],
              ['CFC', '112 clients', '23%'],
              ['HCBS', '94 clients', '19%'],
              ['IRSS', '58 clients', '12%'],
              ['PDN', '42 clients', '9%'],
              ['HMA', '21 clients', '4%'],
              ['Personal Care', '12 clients', '3%'],
            ].map(([prog, cl, pct], i) => (
              <div key={i} className="flex justify-between p-2 bg-stone-50 rounded border border-stone-200">
                <span className="font-bold text-stone-900">{prog}</span>
                <span className="text-stone-600 font-medium">
                  {cl} ({pct})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-[#1c2a17] mb-3">Business Line Share</h3>
          <div className="space-y-3 text-xs">
            {[
              ['Mountain Lane', 248, 51, 'bg-[#3E6B2B]'],
              ['Colorado Home Health', 165, 34, 'bg-emerald-600'],
              ['Frisco', 74, 15, 'bg-amber-500'],
            ].map(([line, count, pct, col], i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1 text-stone-800 font-medium">
                  <span>{line}</span>
                  <span><b>{count} clients</b> ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%` }} className={`h-full ${col} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};
