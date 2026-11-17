'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, Pill, Bar } from '../ui';

export const MigrationPage: React.FC = () => {
  const { showToast } = useApp();
  const [progress, setProgress] = useState<Record<string, number>>({
    AccessCare: 0,
    CareTime: 0,
    Frisco: 0,
  });

  const runImport = (key: string) => {
    showToast(`Mock import started: ${key}`);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextVal = Math.min(100, (prev[key] || 0) + 10);
        if (nextVal >= 100) {
          clearInterval(interval);
        }
        return { ...prev, [key]: nextVal };
      });
    }, 400);
  };

  return (
    <Page
      t="Data Migration"
      s="One-time migration; legacy systems are not kept connected."
    >
      <div className="grid lg:grid-cols-3 gap-5">
        {Object.keys(progress).map((key) => {
          const val = progress[key];
          const isComplete = val === 100;
          const isRunning = val > 0 && val < 100;
          return (
            <Card key={key}>
              <div className="flex justify-between items-center">
                <b className="text-stone-900 text-base">{key}</b>
                <Pill c={isComplete ? 'green' : isRunning ? 'amber' : 'gray'}>
                  {isComplete ? 'Complete' : isRunning ? 'Importing' : 'Not started'}
                </Pill>
              </div>

              <div className="mt-5 text-xs text-stone-600 font-medium mb-1">Records</div>
              <Bar v={val} />

              <div className="mt-3.5 text-xs text-stone-600 font-medium mb-1">Documents</div>
              <Bar v={Math.max(0, val - 20)} />

              <div className="mt-5">
                <Btn
                  disabled={isRunning}
                  onClick={() => runImport(key)}
                  className="w-full sm:w-auto text-center"
                >
                  {isComplete ? 'Re-run mock import' : 'Run mock import'}
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
};
