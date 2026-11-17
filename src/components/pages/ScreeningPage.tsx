'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Pill, Tbl, Chip } from '../ui';
import { SCR } from '@/data/mockData';

export const ScreeningPage: React.FC = () => {
  const { showToast, addFeed, deIdentify } = useApp();
  const [flaggedNames, setFlaggedNames] = useState<string[]>(
    SCR.filter((r) => r.status === 'Flagged').map((r) => r.caregiver)
  );

  const handleRequestChecks = () => {
    showToast('3 checks requested');
    addFeed('Requested 3 pending screenings automatically', false);
  };

  const handleClear = (name: string, checkType: string) => {
    setFlaggedNames((prev) => prev.filter((x) => x !== name));
    showToast(`Cleared ${deIdentify(name)}`);
    addFeed(`Staff cleared flagged ${checkType} result for ${name}`, true);
  };

  const handleEscalate = (name: string) => {
    setFlaggedNames((prev) => prev.filter((x) => x !== name));
    showToast('Escalated to compliance');
  };

  return (
    <Page
      t="Screening Center"
      s="Background and eligibility checks across all caregivers"
      a={<Btn onClick={handleRequestChecks}>Request pending checks</Btn>}
    >
      <Tbl
        rows={SCR}
        cols={[
          ['Caregiver', (r) => <b className="text-stone-900">{deIdentify(r.caregiver)}</b>],
          ['Check', (r) => r.checkType],
          ['Provider', (r) => r.provider],
          [
            'Method',
            (r) =>
              r.provider === 'Manual' ? (
                <Chip h l="Manual tracking" />
              ) : (
                <Chip l="⚡ Request automatically" />
              ),
          ],
          ['Requested', (r) => r.requestedDate],
          ['Result', (r) => <span className="font-medium text-stone-800">{r.result}</span>],
          ['Expiry', (r) => r.expiry],
          [
            'Status',
            (r) => (
              <Pill
                c={
                  r.status === 'Complete'
                    ? 'green'
                    : r.status === 'Pending'
                    ? 'gray'
                    : r.status === 'Flagged'
                    ? 'red'
                    : 'amber'
                }
              >
                {r.status}
              </Pill>
            ),
          ],
        ]}
      />

      <Card>
        <H2>
          Review queue (flagged results) <Chip h />
        </H2>
        {flaggedNames.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {flaggedNames.map((name) => {
              const r = SCR.find((x) => x.caregiver === name)!;
              return (
                <div
                  key={name}
                  className="flex flex-wrap justify-between items-center gap-2 py-3 text-sm"
                >
                  <span className="text-stone-800">
                    <b className="text-stone-900">{deIdentify(name)}</b> · {r.checkType} · {r.result}
                  </span>
                  <span className="flex gap-2">
                    <Btn onClick={() => handleClear(name, r.checkType)}>Clear</Btn>
                    <Btn k="ghost" onClick={() => handleEscalate(name)}>
                      Escalate
                    </Btn>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-stone-500">
            No flagged results. The system will add any it finds here.
          </div>
        )}
      </Card>
    </Page>
  );
};
