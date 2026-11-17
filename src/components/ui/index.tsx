'use client';

import React from 'react';
import { PillColor } from '@/types';

export const PC: Record<PillColor, string> = {
  red: 'bg-red-100 text-red-800',
  amber: 'bg-amber-100 text-amber-900',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-stone-200 text-stone-700',
  gold: 'bg-yellow-100 text-yellow-900',
};

export const Pill: React.FC<{ c?: PillColor; children: React.ReactNode; className?: string }> = ({
  c = 'gray',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${PC[c]} ${className}`}
    >
      {children}
    </span>
  );
};

export const Bar: React.FC<{ v: number; c?: string }> = ({ v, c }) => {
  const barColor = c || (v < 50 ? 'bg-amber-500' : 'bg-[#3E6B2B]');
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 w-full min-w-[70px] bg-stone-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, v))}%` }}
        />
      </div>
      <span className="text-xs text-stone-600 w-9 text-right font-medium">{v}%</span>
    </div>
  );
};

export const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ className = '', children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-stone-200 rounded-xl p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export const Btn: React.FC<{
  k?: 'primary' | 'ghost' | 'gold';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ k = 'primary', onClick, children, className = '', disabled = false, type = 'button' }) => {
  const styles =
    k === 'ghost'
      ? 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 shadow-sm'
      : k === 'gold'
      ? 'bg-[#F2B632] text-stone-900 hover:brightness-95 shadow-sm'
      : 'bg-[#3E6B2B] text-white hover:bg-[#335a23] shadow-sm';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {children}
    </button>
  );
};

export const Page: React.FC<{
  t: string;
  s: string;
  a?: React.ReactNode;
  children: React.ReactNode;
}> = ({ t, s, a, children }) => {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1c2a17]">{t}</h1>
          <p className="text-stone-600 text-sm mt-1">{s}</p>
        </div>
        {a && <div className="flex items-center gap-2 flex-wrap">{a}</div>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h2 className={`font-bold text-[#1c2a17] mb-3 flex items-center gap-2 ${className}`}>{children}</h2>;
};

export interface TableCol<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export function Tbl<T>({
  cols,
  rows,
  onRow,
}: {
  cols: Array<[string, (row: T) => React.ReactNode]>;
  rows: T[];
  onRow?: (row: T) => void;
}) {
  return (
    <div className="overflow-auto max-h-[480px] rounded-xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th
                key={i}
                className="sticky top-0 z-10 bg-white border-b border-stone-200 text-left px-4 py-3 text-[11px] uppercase tracking-wide text-stone-500 font-semibold whitespace-nowrap"
              >
                {c[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-stone-100 transition-colors ${
                onRow ? 'cursor-pointer hover:bg-[#f3f6ef]' : 'hover:bg-stone-50/50'
              }`}
              onClick={onRow ? () => onRow(r) : undefined}
            >
              {cols.map((c, colIndex) => (
                <td key={colIndex} className="px-4 py-3 align-middle">
                  {c[1](r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="p-10 text-center text-stone-500 text-sm">
          Nothing here yet. Try clearing your filters.
        </div>
      )}
    </div>
  );
}

export const Tabs: React.FC<{
  tabs: string[];
  v: string;
  set: (tab: string) => void;
}> = ({ tabs, v, set }) => {
  return (
    <div role="tablist" className="flex gap-1 border-b border-stone-200 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={v === t}
          onClick={() => set(t)}
          className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
            v === t
              ? 'border-[#3E6B2B] text-[#3E6B2B]'
              : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export const Sel: React.FC<{
  v: string;
  set: (val: string) => void;
  opts: string[];
  label?: string;
}> = ({ v, set, opts, label }) => {
  return (
    <label className="text-sm text-stone-600 flex items-center gap-2">
      {label && <span>{label}</span>}
      <select
        value={v}
        onChange={(e) => set(e.target.value)}
        className="border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
      >
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
};

export const Chart: React.FC<{
  data: Array<[string, number]>;
  color?: string;
  fmt?: (x: number) => string | number;
}> = ({ data, color = '#3E6B2B', fmt = (x) => x }) => {
  const max = Math.max(...data.map((d) => d[1]), 1);
  return (
    <div className="flex items-end gap-3 h-40 pt-4" role="img" aria-label="Bar chart">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
          <span className="text-xs text-stone-600 font-medium">{fmt(d[1])}</span>
          <div
            className="w-full rounded-t-md hover:opacity-80 transition-all duration-300"
            style={{
              height: `${(d[1] / max) * 100 * 0.75}%`,
              backgroundColor: color,
            }}
          />
          <span className="text-[11px] text-stone-500 font-medium">{d[0]}</span>
        </div>
      ))}
    </div>
  );
};

export const Skel: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="sk h-8 w-64 mb-3" />
        <div className="sk h-4 w-96 mb-8" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="sk h-24" />
        ))}
      </div>
      <div className="sk h-64 mt-6" />
    </div>
  );
};

export const Chip: React.FC<{ h?: boolean; l?: string }> = ({ h, l }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${
        h ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-800'
      }`}
    >
      {l || (h ? 'Needs human' : '⚡ Automated')}
    </span>
  );
};

export const Switch: React.FC<{
  v: boolean;
  set: () => void;
  label?: string;
}> = ({ v, set, label }) => {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={v}
      aria-label={label}
      onClick={set}
      className={`shrink-0 w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
        v ? 'bg-[#3E6B2B]' : 'bg-stone-300'
      }`}
    >
      <span
        className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          v ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
