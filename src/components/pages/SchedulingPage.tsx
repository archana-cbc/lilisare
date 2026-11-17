'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Pill } from '../ui';
import { SH, DAYS } from '@/data/mockData';
import { EvvException, PillColor } from '@/types';

export const SchedulingPage: React.FC = () => {
  const { showToast, deIdentify } = useApp();
  const [exceptions, setExceptions] = useState<EvvException[]>([
    {
      type: 'Missed clock-out',
      caregiver: 'Luis Ruiz',
      client: 'Josefina R.',
      time: 'Nov 14 5:00 PM',
      status: 'Open',
    },
    {
      type: 'Self-correct request',
      caregiver: 'Grace Park',
      client: 'Aiden P.',
      time: 'Nov 15 6:10 PM',
      status: 'Pending approval',
    },
    {
      type: 'GPS mismatch',
      caregiver: 'Linh Nguyen',
      client: 'Harper N.',
      time: 'Nov 15 9:02 AM',
      status: 'Open',
    },
  ]);

  const updateExceptionStatus = (index: number, newStatus: EvvException['status']) => {
    setExceptions((prev) =>
      prev.map((e, idx) => (idx === index ? { ...e, status: newStatus } : e))
    );
    showToast(`Exception ${newStatus.toLowerCase()}`);
  };

  const unfilledShifts = SH.filter((s) => !s.caregiver);

  const getStatusColor = (status: EvvException['status']): PillColor => {
    if (status === 'Open') return 'red';
    if (status === 'Pending approval') return 'amber';
    return 'green';
  };

  return (
    <Page
      t="Scheduling and EVV"
      s="Week of Nov 16, 2026"
      a={<Btn onClick={() => showToast('Shift builder opened')}>New shift</Btn>}
    >
      {/* 7-Day Calendar Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-7 gap-2.5 min-w-[900px]">
          {DAYS.map((day, dayIdx) => {
            const dayShifts = SH.filter((s) => s.dayIndex === dayIdx);
            return (
              <div
                key={day}
                className="bg-white border border-stone-200 rounded-xl p-2.5 min-h-[160px] shadow-xs flex flex-col"
              >
                <div className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">
                  {day}
                </div>
                <div className="space-y-1.5 flex-1">
                  {dayShifts.map((shift, sIdx) => {
                    const isAssigned = !!shift.caregiver;
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() =>
                          showToast(
                            isAssigned
                              ? `Shift: ${deIdentify(shift.client)} with ${deIdentify(shift.caregiver!)}`
                              : 'Assign a caregiver to this shift'
                          )
                        }
                        className={`w-full text-left rounded-lg p-2 text-xs transition leading-snug ${
                          isAssigned
                            ? 'bg-green-50/80 border border-green-200 hover:bg-green-100/70 text-stone-900'
                            : 'bg-amber-50/80 border border-dashed border-amber-500 hover:bg-amber-100/70 text-amber-900'
                        }`}
                      >
                        <b className="font-semibold block">{shift.timeSlot}</b>
                        <div>{deIdentify(shift.client)}</div>
                        <span className="text-stone-500 block text-[11px] mt-0.5">
                          {shift.caregiver ? deIdentify(shift.caregiver) : 'Unfilled'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unfilled Shifts and EVV Exceptions Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <H2>Unfilled shifts ({unfilledShifts.length})</H2>
          <div className="divide-y divide-stone-100">
            {unfilledShifts.map((s, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-stone-800 font-medium">
                  {DAYS[s.dayIndex]} · {s.timeSlot} · {deIdentify(s.client)}
                </span>
                <Btn k="ghost" onClick={() => showToast('Suggested 3 available caregivers')}>
                  Find cover
                </Btn>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <H2>EVV exceptions</H2>
          <div className="divide-y divide-stone-100">
            {exceptions.map((e, idx) => (
              <div key={idx} className="py-3 text-sm">
                <div className="flex justify-between items-center gap-2">
                  <b className="text-stone-900">{e.type}</b>
                  <Pill c={getStatusColor(e.status)}>{e.status}</Pill>
                </div>
                <div className="text-stone-600 mt-1">
                  {deIdentify(e.caregiver)} · {deIdentify(e.client)} · {e.time}
                </div>
                {e.type === 'Self-correct request' && e.status === 'Pending approval' && (
                  <div className="mt-1.5 p-2 bg-stone-50 rounded text-xs italic text-stone-700">
                    “Forgot to clock out, left at 6:00 PM.” Caregiver remains responsible for
                    accuracy.
                  </div>
                )}
                {(e.status === 'Open' || e.status === 'Pending approval') && (
                  <div className="mt-2.5 flex gap-2">
                    {e.status === 'Open' ? (
                      <Btn k="ghost" onClick={() => updateExceptionStatus(idx, 'Correction requested')}>
                        Request self-correct
                      </Btn>
                    ) : (
                      <>
                        <Btn onClick={() => updateExceptionStatus(idx, 'Approved')}>Approve</Btn>
                        <Btn k="ghost" onClick={() => updateExceptionStatus(idx, 'Denied')}>
                          Deny
                        </Btn>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Workforce and Time Tracking Metrics */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <H2>Wasted / unverified hours (42.5 hrs)</H2>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-stone-900">42.5 hrs</div>
              <div className="text-xs text-stone-500">Unverified schedule deviations this period</div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-red-700">~$935.00</span>
              <span className="text-[11px] text-stone-500 block">Est. cost impact</span>
            </div>
          </div>
          <div className="space-y-2 text-xs mb-3">
            {[
              ['Missed clock-outs', '16.5 hrs', 39, 'bg-red-500'],
              ['Late clock-ins', '14.2 hrs', 33, 'bg-amber-500'],
              ['Early clock-outs', '11.8 hrs', 28, 'bg-blue-500'],
            ].map(([lbl, hrs, pct, col], i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-stone-700 mb-0.5">
                  <span>{lbl}</span>
                  <span className="font-semibold">{hrs}</span>
                </div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%` }} className={`h-full ${col}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <H2>Overtime and workforce allocation</H2>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-2xl font-black text-stone-900">14 Caregivers</div>
              <div className="text-xs text-stone-500">Approaching 40h threshold (37–39.5 hrs)</div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-amber-700">~$3,420</span>
              <span className="text-[11px] text-stone-500 block">Projected OT cost</span>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wide mb-1">
              Open shifts by region & program
            </div>
            {[
              ['Denver Metro', 'IHSS program', '4 shifts open'],
              ['Arapahoe / Douglas', 'PDN program', '2 shifts open'],
              ['Boulder / North', 'CFC program', '2 shifts open'],
            ].map(([reg, prog, count], i) => (
              <div key={i} className="flex justify-between py-1 border-b border-stone-100 last:border-none text-stone-800">
                <span><b>{reg}</b> · {prog}</span>
                <span className="font-semibold text-amber-800">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
};
