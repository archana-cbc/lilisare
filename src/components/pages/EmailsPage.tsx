'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2, Pill, Tbl } from '../ui';
import { TPL, APPR } from '@/data/mockData';
import { EmailTemplate } from '@/types';

export const EmailsPage: React.FC = () => {
  const { showToast, deIdentify } = useApp();
  const [templates, setTemplates] = useState<EmailTemplate[]>(TPL);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const currentTemplate = templates[selectedIndex] || templates[0];

  const updateCurrentBody = (body: string) => {
    setTemplates((prev) =>
      prev.map((t, idx) => (idx === selectedIndex ? { ...t, body } : t))
    );
  };

  return (
    <Page
      t="CA Emails"
      s="Case-manager templates and follow-ups"
      a={<Btn onClick={() => showToast('New template created')}>New template</Btn>}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Template List */}
        <Card>
          <H2>Template library</H2>
          <div className="space-y-1 mt-2">
            {templates.map((x, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`w-full text-left p-2.5 rounded-lg text-sm transition ${
                  selectedIndex === i
                    ? 'bg-green-50 font-semibold text-[#3E6B2B] ring-1 ring-[#3E6B2B]/30'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {x.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Template Editor */}
        <Card className="lg:col-span-2">
          <H2>{currentTemplate.title}</H2>
          <textarea
            aria-label="Template body"
            value={currentTemplate.body}
            onChange={(e) => updateCurrentBody(e.target.value)}
            rows={6}
            className="w-full border border-stone-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20 text-stone-900 leading-relaxed"
          />
          <div className="mt-3 flex gap-2">
            <Btn onClick={() => showToast('Template saved')}>Save</Btn>
            <Btn k="ghost" onClick={() => showToast('Preview opened')}>
              Preview
            </Btn>
          </div>
        </Card>
      </div>

      <div>
        <H2>Pending state approvals and auto follow-ups</H2>
        <Tbl
          rows={APPR}
          cols={[
            ['Client', (r) => <b className="text-stone-900">{deIdentify(r.client)}</b>],
            ['Case manager', (r) => r.caseManager],
            ['Request', (r) => r.requestType],
            ['Sent', (r) => r.sentDate],
            [
              'Follow-up status',
              (r) => (
                <Pill
                  c={
                    r.status === 'Overdue'
                      ? 'red'
                      : r.status.startsWith('Sched')
                      ? 'gray'
                      : 'amber'
                  }
                >
                  {r.status}
                </Pill>
              ),
            ],
          ]}
        />
      </div>
    </Page>
  );
};
