'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Tabs, Tbl, Switch, Chip } from '../ui';
import { SV, ET, RULES, TE, baseMatrixRule } from '@/data/mockData';

export const RulesPage: React.FC = () => {
  const { showToast } = useApp();
  const [tab, setTab] = useState('Service matrix');
  const [selectedCell, setSelectedCell] = useState<[string, string] | null>(null);
  const [drawerData, setDrawerData] = useState<Record<string, any>>({});
  const [overrides, setOverrides] = useState<Record<string, any>>({});
  const [ruleSwitches, setRuleSwitches] = useState<Record<number, boolean>>({});
  const [templateIndex, setTemplateIndex] = useState(0);
  const [lang, setLang] = useState<'EN' | 'ES'>('EN');
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});

  const [history, setHistory] = useState<string[]>([
    'Nov 12 · Maya R. · Missing-document reminder changed from 72h to 48h',
    'Nov 5 · Platform Admin · Added TB test (confirm if required) to PDN packet',
    'Oct 28 · Compliance · Credential alert 14d changed to 7d',
  ]);

  const addHistory = (msg: string) => {
    setHistory((prev) => [`Nov 16 · Admin Demo · ${msg}`, ...prev]);
  };

  const getRequirements = (svc: string, emp: string) => ({
    ...baseMatrixRule(svc, emp),
    ...(overrides[svc + emp] || {}),
  });

  const templateKey = `${templateIndex}_${lang}`;
  const currentBody =
    customTexts[templateKey] ?? TE[templateIndex][lang === 'EN' ? 1 : 2];

  const handleSaveRequirements = () => {
    if (!selectedCell) return;
    const [svc, emp] = selectedCell;
    setOverrides((prev) => ({
      ...prev,
      [svc + emp]: drawerData,
    }));
    addHistory(`Changed ${svc} / ${emp} requirements`);
    showToast('Requirements saved');
    setSelectedCell(null);
  };

  return (
    <Page
      t="Automation Rules"
      s="What the system does on its own, and when it asks a person"
      a={<Chip />}
    >
      <Tabs
        tabs={['Service matrix', 'Rule cards', 'Templates', 'Change history']}
        v={tab}
        set={setTab}
      />

      {/* Service Matrix Tab */}
      {tab === 'Service matrix' && (
        <Tbl
          rows={SV}
          cols={[
            ['Service', (s) => <b className="text-stone-900">{s}</b>],
            ...ET.map(
              (e) =>
                [
                  e + (e === 'Employee' ? ' · ~20 docs' : e === '1099' ? ' · ~15 docs' : ' · combined'),
                  (s: string) => {
                    const c = getRequirements(s, e);
                    return (
                      <button
                        type="button"
                        className="text-left text-xs rounded-lg border border-stone-200 p-2.5 hover:border-[#3E6B2B] hover:bg-green-50/70 w-full min-w-[170px] transition"
                        onClick={() => {
                          setSelectedCell([s, e]);
                          setDrawerData(c);
                        }}
                      >
                        <b className="text-stone-900">{c.docs} docs</b> · {c.checks}
                        <br />
                        <span className="text-stone-600 block mt-0.5">
                          {c.courses}
                          <br />
                          {c.rn}
                        </span>
                      </button>
                    );
                  },
                ] as [string, (s: string) => React.ReactNode]
            ),
          ]}
        />
      )}

      {/* Rule Cards Tab */}
      {tab === 'Rule cards' && (
        <div className="grid lg:grid-cols-2 gap-4">
          {RULES.map((r, i) => {
            const isChecked = ruleSwitches[i] ?? true;
            return (
              <Card key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase text-stone-500">When</div>
                  <div className="font-semibold text-sm text-stone-900 mt-0.5">
                    {r[0].replace(/^When /, '')}
                  </div>
                  <div className="text-xs font-bold uppercase text-stone-500 mt-2.5">Then</div>
                  <div className="text-sm text-stone-700 mt-0.5">{r[1]}</div>
                </div>
                <Switch
                  v={isChecked}
                  label={r[0]}
                  set={() => {
                    const next = !isChecked;
                    setRuleSwitches((prev) => ({ ...prev, [i]: next }));
                    addHistory((next ? 'Turned on: ' : 'Turned off: ') + r[0]);
                    showToast('Rule updated');
                  }}
                />
              </Card>
            );
          })}
        </div>
      )}

      {/* Templates Tab */}
      {tab === 'Templates' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <H2>Templates</H2>
            <div className="space-y-1 mt-2">
              {TE.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTemplateIndex(i)}
                  className={`w-full text-left p-2.5 rounded-lg text-sm transition ${
                    templateIndex === i
                      ? 'bg-green-50 font-semibold text-[#3E6B2B] ring-1 ring-[#3E6B2B]/30'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {t[0]}
                </button>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <H2 className="mb-0">{TE[templateIndex][0]}</H2>
              <div className="flex gap-1">
                {(['EN', 'ES'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={lang === l}
                    onClick={() => setLang(l)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
                      lang === l
                        ? 'bg-[#3E6B2B] text-white border-[#3E6B2B] shadow-sm'
                        : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {l === 'EN' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              aria-label="Template text"
              rows={6}
              value={currentBody}
              onChange={(e) =>
                setCustomTexts((prev) => ({ ...prev, [templateKey]: e.target.value }))
              }
              className="w-full border border-stone-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20 text-stone-900 leading-relaxed"
            />

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {['{caregiver_name}', '{client_name}', '{document}', '{case_manager}', '{date}'].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setCustomTexts((prev) => ({
                        ...prev,
                        [templateKey]: `${currentBody} ${tag}`,
                      }))
                    }
                    className="text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-800 rounded px-2 py-1 transition"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>

            <div className="mt-4">
              <Btn
                onClick={() => {
                  addHistory(`Edited template "${TE[templateIndex][0]}" (${lang})`);
                  showToast('Template saved');
                }}
              >
                Save template
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Change History Tab */}
      {tab === 'Change history' && (
        <Card>
          <ul className="divide-y divide-stone-100 text-sm">
            {history.map((x, idx) => (
              <li key={idx} className="py-2.5 text-stone-800">
                {x}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Slide-out Edit Requirements Drawer */}
      {selectedCell && (
        <div
          className="fixed inset-0 z-50 animate-fadeIn"
          onKeyDown={(e) => e.key === 'Escape' && setSelectedCell(null)}
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedCell(null)}
          />
          <aside
            role="dialog"
            aria-label="Edit requirements"
            className="absolute right-0 inset-y-0 w-full max-w-md bg-white p-6 overflow-y-auto shadow-2xl flex flex-col space-y-4"
          >
            <h2 className="font-bold text-lg text-stone-900">
              {selectedCell[0]} · {selectedCell[1]}
            </h2>
            <p className="text-xs text-stone-500 mb-2">
              Edits apply to future onboarding packets.
            </p>

            {[
              ['docs', 'Documents in packet'],
              ['checks', 'Required checks'],
              ['courses', 'Training courses'],
              ['rn', 'RN-visit rule'],
              ['comp', 'Compliance items'],
            ].map(([k, l]) => (
              <label key={k} className="block text-sm text-stone-700">
                {l}
                <input
                  value={drawerData[k] ?? ''}
                  onChange={(e) => setDrawerData({ ...drawerData, [k]: e.target.value })}
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20 text-stone-900"
                />
              </label>
            ))}

            <div className="flex gap-2 pt-3 border-t border-stone-100">
              <Btn onClick={handleSaveRequirements}>Save</Btn>
              <Btn k="ghost" onClick={() => setSelectedCell(null)}>
                Cancel
              </Btn>
            </div>
          </aside>
        </div>
      )}
    </Page>
  );
};
