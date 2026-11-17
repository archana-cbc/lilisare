'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Card, H2 } from '../ui';
import { ROLES, MODS } from '@/data/mockData';

export const UsersPage: React.FC = () => {
  const { showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState(ROLES[1]); // Agency Admin
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [accessScope, setAccessScope] = useState('Branch');

  const permKey = (mod: string, action: string) => `${selectedRole}_${mod}_${action}`;

  const isChecked = (mod: string, action: string) => {
    const key = permKey(mod, action);
    if (permissions[key] !== undefined) return permissions[key];
    // Default deterministic rule from original HTML
    return (mod.length + action.length + selectedRole.length) % 3 !== 0;
  };

  const togglePermission = (mod: string, action: string) => {
    const key = permKey(mod, action);
    const nextVal = !isChecked(mod, action);
    setPermissions((prev) => ({ ...prev, [key]: nextVal }));
    showToast('Permission updated (demo)');
  };

  return (
    <Page
      t="Users and Roles"
      s="Who can see and do what"
      a={<Btn onClick={() => showToast('Custom role builder opened')}>Create custom role</Btn>}
    >
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Roles Sidebar */}
        <Card className="!p-2">
          <div className="space-y-0.5">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition font-medium ${
                    isSelected
                      ? 'bg-[#3E6B2B] text-white font-semibold shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Permissions & Scope Panel */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <H2>Permissions: {selectedRole}</H2>
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] uppercase tracking-wide text-stone-500 py-2.5 font-semibold">
                      Module
                    </th>
                    {['View', 'Edit', 'Approve', 'Export'].map((act) => (
                      <th
                        key={act}
                        className="text-center text-[11px] uppercase tracking-wide text-stone-500 font-semibold"
                      >
                        {act}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {MODS.map((mod) => (
                    <tr key={mod} className="hover:bg-stone-50/50">
                      <td className="py-2.5 font-medium text-stone-800">{mod}</td>
                      {['View', 'Edit', 'Approve', 'Export'].map((act) => (
                        <td key={act} className="text-center">
                          <input
                            type="checkbox"
                            aria-label={`${mod} ${act}`}
                            checked={isChecked(mod, act)}
                            onChange={() => togglePermission(mod, act)}
                            className="w-4 h-4 accent-[#3E6B2B] rounded cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <H2>Data access scope</H2>
            <div className="flex flex-wrap gap-5 text-sm pt-1">
              {['Branch', 'Caseload', 'All branches'].map((scope) => (
                <label key={scope} className="flex gap-2 items-center cursor-pointer select-none text-stone-800 font-medium">
                  <input
                    type="radio"
                    name="scope_radio"
                    checked={accessScope === scope}
                    onChange={() => {
                      setAccessScope(scope);
                      showToast(`Access scope: ${scope}`);
                    }}
                    className="accent-[#3E6B2B] w-4 h-4 cursor-pointer"
                  />
                  {scope}-level access
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
