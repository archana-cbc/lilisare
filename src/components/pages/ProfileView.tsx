'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, Pill, Tbl, Tabs, Chip } from '../ui';
import { ClientRecord } from '@/types';
import { CDOC, STC, mkDocs } from '@/data/mockData';

const Timeline: React.FC<{ who: string }> = ({ who }) => {
  const events: Array<[string, 'S' | 'H', string]> = [
    ['Nov 16 9:02 AM', 'S', 'Reminder #2 sent: ID upload missing'],
    ['Nov 15 4:40 PM', 'H', 'Alicia T. reviewed uploaded ID: verified'],
    ['Nov 14 8:00 AM', 'S', 'CBI check requested'],
    ['Nov 13 10:15 AM', 'S', `Packet sent to ${who} household`],
    ['Nov 12 2:30 PM', 'H', 'Maya R. converted the inquiry to a client'],
    ['Nov 12 2:30 PM', 'S', 'Linked caregiver record created'],
  ];

  return (
    <Card>
      <ol className="space-y-4 pt-1">
        {events.map((e, idx) => (
          <li key={idx} className="flex gap-3 text-sm">
            <span className="text-xs text-stone-500 w-32 shrink-0 font-medium">{e[0]}</span>
            <div>
              <span className="text-stone-800">{e[2]}</span>{' '}
              <Chip h={e[1] === 'H'} l={e[1] === 'H' ? 'Human action' : undefined} />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
};

const AuditLog: React.FC<{ who: string }> = ({ who }) => {
  return (
    <Tbl
      rows={[
        ['System', 'Assigned IHSS employee packet', 'Nov 13 10:15 AM'],
        ['Maya R.', 'Edited service plan: added meal prep', 'Nov 12 3:10 PM'],
        ['Alicia T.', 'Marked ID as Verified', 'Nov 15 4:40 PM'],
        ['System', 'Sent reminder #2 (SMS + email)', 'Nov 16 9:02 AM'],
        ['Admin Demo', `Viewed record: ${who}`, 'Nov 16 11:20 AM'],
      ]}
      cols={[
        ['Who', (r) => <span className="font-semibold text-stone-900">{r[0]}</span>],
        ['What', (r) => r[1]],
        ['When', (r) => <span className="text-stone-500">{r[2]}</span>],
      ]}
    />
  );
};

export const ProfileView: React.FC<{ client: ClientRecord; back: () => void }> = ({
  client,
  back,
}) => {
  const { showToast, deIdentify } = useApp();
  const [tab, setTab] = useState('Overview');
  const displayName = deIdentify(client.name);
  const caregivers = client.caregivers.map((cg) => deIdentify(cg));

  const ListCard: React.FC<{ items: string[] }> = ({ items }) => (
    <Card>
      <ul className="divide-y divide-stone-100 text-sm">
        {items.map((item, idx) => (
          <li key={idx} className="py-2.5 text-stone-800">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );

  const renderTabContent = () => {
    switch (tab) {
      case 'Overview':
        return (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['Client ID', client.id],
              ['Program', client.program],
              ['Case manager', client.caseManager],
              ['Authorization', client.authorization],
              ['Next RN visit', client.nextRnVisit],
              ['Branch', 'Denver Metro'],
            ].map(([lbl, val], idx) => (
              <Card key={idx}>
                <div className="text-xs uppercase text-stone-500 font-semibold">{lbl}</div>
                <div className="font-bold text-stone-900 text-base mt-1">{val}</div>
              </Card>
            ))}
          </div>
        );

      case 'Caregivers':
        return (
          <Tbl
            rows={caregivers}
            cols={[
              ['Caregiver', (n) => <b className="text-stone-900">{n}</b>],
              ['Relationship', () => 'Family caregiver'],
              ['Employment', () => 'Employee'],
              ['Hours / week', () => '28'],
            ]}
          />
        );

      case 'Service plan':
        return (
          <ListCard
            items={[
              'Personal care: bathing, dressing, 3×/week',
              'Homemaker: meal prep and light housekeeping',
              'Health maintenance: medication reminders',
              'Goal: increase independence in meal prep by March',
            ]}
          />
        );

      case 'Authorizations':
        return (
          <Tbl
            rows={[
              ['AUTH-5521', client.program, 'Jul 1 – Dec 31', '1,040 hrs', client.authorization],
              ['AUTH-4410', client.program, 'Jan 1 – Jun 30', '1,040 hrs', 'Expired'],
            ]}
            cols={[
              ['Auth #', (r) => <span className="font-semibold">{r[0]}</span>],
              ['Program', (r) => r[1]],
              ['Period', (r) => r[2]],
              ['Units', (r) => r[3]],
              [
                'Status',
                (r) => (
                  <Pill c={r[4] === 'Active' ? 'green' : r[4] === 'Expired' ? 'red' : 'amber'}>
                    {r[4]}
                  </Pill>
                ),
              ],
            ]}
          />
        );

      case 'Documents':
        return (
          <Tbl
            rows={mkDocs(CDOC, 3)}
            cols={[
              ['Document', (d) => <span className="font-medium">{d.n}</span>],
              ['Status', (d) => <Pill c={STC[d.s]}>{d.s}</Pill>],
              ['Submitted', (d) => d.sub],
            ]}
          />
        );

      case 'Care notes':
        return (
          <ListCard
            items={[
              `Nov 14 · ${caregivers[0]}: Assisted with breakfast; client chose oatmeal.`,
              `Nov 13 · ${caregivers[0]}: Medication reminder given at 9 AM.`,
              `Nov 12 · ${caregivers[0]}: Walked 15 minutes with supervision.`,
            ]}
          />
        );

      case 'Visits':
        return (
          <Tbl
            rows={[
              ['Nov 3', 'RN virtual', 'Alicia T.', 'Complete'],
              ['Aug 4', 'RN home visit', 'Alicia T.', 'Complete'],
              [client.nextRnVisit, 'RN virtual', 'Alicia T.', 'Scheduled'],
            ]}
            cols={[
              ['Date', (r) => r[0]],
              ['Type', (r) => r[1]],
              ['Staff', (r) => r[2]],
              ['Status', (r) => <Pill c={r[3] === 'Complete' ? 'green' : 'gray'}>{r[3]}</Pill>],
            ]}
          />
        );

      case 'Activity Timeline':
        return <Timeline who={displayName} />;

      case 'Audit Log':
        return <AuditLog who={displayName} />;

      default:
        return null;
    }
  };

  return (
    <Page
      t={displayName}
      s={`${client.id} · ${client.program} · linked to ${caregivers.join(', ')}`}
      a={
        <>
          <Btn k="ghost" onClick={back}>
            ← All clients
          </Btn>
          <Btn onClick={() => showToast('Edit mode opened')}>Edit</Btn>
        </>
      }
    >
      <Tabs
        tabs={[
          'Overview',
          'Caregivers',
          'Service plan',
          'Authorizations',
          'Documents',
          'Care notes',
          'Visits',
          'Activity Timeline',
          'Audit Log',
        ]}
        v={tab}
        set={setTab}
      />
      {renderTabContent()}
    </Page>
  );
};
