'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Page, Btn, Pill } from '../ui';
import { ASSIGN, SRC, STG, INTAKE_STEPS, STAFF, DEF } from '@/data/mockData';
import { InquiryCard, PillColor } from '@/types';

// Helper for staff avatar initials & color
const getStaffInitials = (staff: string) => {
  const parts = staff.split(' ');
  return parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase();
};

const getStaffColor = (staff: string) => {
  switch (staff) {
    case 'Maya R.':
      return 'bg-emerald-700 text-white';
    case 'Jon P.':
      return 'bg-blue-700 text-white';
    case 'Alicia T.':
      return 'bg-purple-700 text-white';
    case 'Sam K.':
      return 'bg-amber-700 text-white';
    default:
      return 'bg-stone-700 text-white';
  }
};

// Column theme definition for the 7 stages
interface StageConfig {
  bg: string;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  dotColor: string;
}

const STAGE_CONFIGS: Record<string, StageConfig> = {
  'New Inquiry': {
    bg: 'bg-blue-50/50 border-blue-200/60',
    headerBg: 'text-blue-900',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    accentBorder: 'border-t-blue-500',
    dotColor: 'bg-blue-500',
  },
  Contacted: {
    bg: 'bg-emerald-50/50 border-emerald-200/60',
    headerBg: 'text-emerald-900',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    accentBorder: 'border-t-emerald-500',
    dotColor: 'bg-emerald-500',
  },
  'Needs Discussion': {
    bg: 'bg-amber-50/50 border-amber-200/60',
    headerBg: 'text-amber-900',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    accentBorder: 'border-t-amber-500',
    dotColor: 'bg-amber-500',
  },
  'Case Manager Coordination': {
    bg: 'bg-purple-50/50 border-purple-200/60',
    headerBg: 'text-purple-900',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    accentBorder: 'border-t-purple-500',
    dotColor: 'bg-purple-500',
  },
  'Family Decision': {
    bg: 'bg-indigo-50/50 border-indigo-200/60',
    headerBg: 'text-indigo-900',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    accentBorder: 'border-t-indigo-500',
    dotColor: 'bg-indigo-500',
  },
  Converted: {
    bg: 'bg-teal-50/50 border-[#3E6B2B]/20',
    headerBg: 'text-stone-900',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-[#3E6B2B]',
    accentBorder: 'border-t-[#3E6B2B]',
    dotColor: 'bg-[#3E6B2B]',
  },
  'Closed / Not Proceeding': {
    bg: 'bg-stone-100/60 border-stone-200',
    headerBg: 'text-stone-700',
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-600',
    accentBorder: 'border-t-stone-400',
    dotColor: 'bg-stone-400',
  },
};

export const IntakePage: React.FC = () => {
  const { showToast, addFeed, deIdentify, navigate } = useApp();

  // Cards State
  const [cards, setCards] = useState<InquiryCard[]>(ASSIGN);
  const [selectedCard, setSelectedCard] = useState<InquiryCard | null>(null);

  // Filters State
  const [filterOwner, setFilterOwner] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showSourceInsights, setShowSourceInsights] = useState(false);

  // Drag and Drop State
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Drawer & Modal States
  const [activeTab, setActiveTab] = useState<'overview' | 'needs' | 'cm' | 'comm' | 'docs' | 'activity'>('overview');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addPreselectedStage, setAddPreselectedStage] = useState('New Inquiry');
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [cardToConvert, setCardToConvert] = useState<InquiryCard | null>(null);
  const [familyCaregiverToggle, setFamilyCaregiverToggle] = useState(true);
  const [conversionSuccess, setConversionSuccess] = useState(false);
  const [isLogContactOpen, setIsLogContactOpen] = useState(false);
  const [contactType, setContactType] = useState<'Call' | 'Email' | 'SMS' | 'Note'>('Call');
  const [contactNote, setContactNote] = useState('');
  const [commDraft, setCommDraft] = useState('');

  // Add Form State & Dictation
  const [form, setForm] = useState<Record<string, string>>({});
  const [isDictatingForm, setIsDictatingForm] = useState(false);
  const [isDictatingNotes, setIsDictatingNotes] = useState(false);

  // Filter Cards
  const filteredCards = cards.filter((card) => {
    if (filterOwner !== 'All' && card.staff !== filterOwner) return false;
    if (filterService !== 'All' && card.service !== filterService) return false;
    if (filterSource !== 'All' && card.source !== filterSource) return false;
    if (filterOverdueOnly && !card.isOverdue) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = card.clientName.toLowerCase().includes(q);
      const matchSvc = card.service.toLowerCase().includes(q);
      const matchSource = card.source.toLowerCase().includes(q);
      if (!matchName && !matchSvc && !matchSource) return false;
    }
    return true;
  });

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, card: InquiryCard) => {
    e.dataTransfer.setData('text/plain', card.id);
    setDraggedCardId(card.id);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (!cardId) return;

    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard || targetCard.stage === targetStage) return;

    // Calculate stage step mapping
    const stepMapping: Record<string, number> = {
      'New Inquiry': 1,
      Contacted: 2,
      'Needs Discussion': 3,
      'Case Manager Coordination': 4,
      'Family Decision': 6,
      Converted: 7,
      'Closed / Not Proceeding': targetCard.currentStep,
    };

    const newStep = stepMapping[targetStage] ?? targetCard.currentStep;

    const updated = cards.map((c) => {
      if (c.id === cardId) {
        return {
          ...c,
          stage: targetStage,
          currentStep: newStep,
          daysInStage: 0,
          closedReason: targetStage === 'Closed / Not Proceeding' ? 'Went to another agency' : undefined,
          activityLog: [
            {
              date: 'Just now',
              text: `Moved from ${c.stage} to ${targetStage} via Kanban drag`,
              isAutomated: false,
            },
            ...(c.activityLog || []),
          ],
        };
      }
      return c;
    });

    setCards(updated);
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(updated.find((c) => c.id === cardId) || null);
    }
    showToast(`${deIdentify(targetCard.clientName)} moved to ${targetStage}`);
    addFeed(`${deIdentify(targetCard.clientName)} moved to ${targetStage}`, false);
    setDraggedCardId(null);
  };

  // Stepper: Advance current step in drawer
  const handleAdvanceStep = (card: InquiryCard) => {
    if (card.currentStep >= 7) return;
    const nextStep = card.currentStep + 1;
    const stepName = INTAKE_STEPS[nextStep - 1];

    let newStage = card.stage;
    if (nextStep === 2 && card.stage === 'New Inquiry') newStage = 'Contacted';
    if (nextStep === 3 && card.stage === 'Contacted') newStage = 'Needs Discussion';
    if (nextStep === 4 && card.stage === 'Needs Discussion') newStage = 'Case Manager Coordination';
    if (nextStep === 6) newStage = 'Family Decision';
    if (nextStep === 7) newStage = 'Converted';

    const updated = cards.map((c) => {
      if (c.id === card.id) {
        return {
          ...c,
          currentStep: nextStep,
          stage: newStage,
          activityLog: [
            {
              date: 'Just now',
              text: `Completed step "${INTAKE_STEPS[card.currentStep - 1]}". Advanced to "${stepName}".`,
              isAutomated: false,
            },
            ...(c.activityLog || []),
          ],
        };
      }
      return c;
    });

    setCards(updated);
    const updatedCard = updated.find((c) => c.id === card.id) || null;
    setSelectedCard(updatedCard);
    showToast(`Step marked complete: ${stepName}`);
  };

  // Convert to Client trigger & confirm
  const handleRequestConvert = (card: InquiryCard) => {
    setCardToConvert(card);
    // On by default for family inquiries, off for outside referral / RFP
    const isFamily = !(card.source === 'Case Management Agency' || card.source === 'RFP');
    setFamilyCaregiverToggle(isFamily);
    setConversionSuccess(false);
    setIsConvertModalOpen(true);
  };

  const handleConfirmConvert = () => {
    if (!cardToConvert) return;
    const updated = cards.map((c) => {
      if (c.id === cardToConvert.id) {
        return {
          ...c,
          stage: 'Converted',
          currentStep: 7,
          activityLog: [
            {
              date: 'Just now',
              text: familyCaregiverToggle
                ? '⚡ Converted to active client. Household created with Client and linked Caregiver records.'
                : '⚡ Converted to active client. Household created with Client record (Caregiver recruitment pending).',
              isAutomated: true,
            },
            ...(c.activityLog || []),
          ],
        };
      }
      return c;
    });

    setCards(updated);
    if (selectedCard && selectedCard.id === cardToConvert.id) {
      setSelectedCard(updated.find((c) => c.id === cardToConvert.id) || null);
    }
    setConversionSuccess(true);
    showToast(`Converted ${deIdentify(cardToConvert.clientName)} to Client!`);
    addFeed(
      familyCaregiverToggle
        ? `Converted ${deIdentify(cardToConvert.clientName)}: Household created with Client & Caregiver onboarding tracks`
        : `Converted ${deIdentify(cardToConvert.clientName)}: Household created with Client onboarding track`,
      true
    );
  };

  // Quick Action: Send Follow-up
  const handleSendFollowUp = (card: InquiryCard) => {
    const updated = cards.map((c) => {
      if (c.id === card.id) {
        return {
          ...c,
          isOverdue: false,
          followUp: 'Nov 24',
          commLog: [
            {
              date: 'Just now',
              type: 'Email' as const,
              text: `Follow-up sent: "Checking in on care preferences and CMA authorization schedule."`,
              staff: card.staff,
            },
            ...(c.commLog || []),
          ],
          activityLog: [
            {
              date: 'Just now',
              text: `Follow-up email dispatched by ${card.staff}. Next follow-up rescheduled to Nov 24.`,
              isAutomated: false,
            },
            ...(c.activityLog || []),
          ],
        };
      }
      return c;
    });

    setCards(updated);
    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(updated.find((c) => c.id === card.id) || null);
    }
    showToast(`Follow-up sent to ${deIdentify(card.clientName)}`);
  };

  // Log contact submission
  const handleLogContactSubmit = () => {
    if (!selectedCard || !contactNote.trim()) return;

    const updated = cards.map((c) => {
      if (c.id === selectedCard.id) {
        return {
          ...c,
          commLog: [
            {
              date: 'Just now',
              type: contactType,
              text: contactNote.trim(),
              staff: c.staff,
            },
            ...(c.commLog || []),
          ],
          activityLog: [
            {
              date: 'Just now',
              text: `${contactType} logged by ${c.staff}: "${contactNote.trim().slice(0, 50)}..."`,
              isAutomated: false,
            },
            ...(c.activityLog || []),
          ],
        };
      }
      return c;
    });

    setCards(updated);
    setSelectedCard(updated.find((c) => c.id === selectedCard.id) || null);
    setContactNote('');
    setIsLogContactOpen(false);
    showToast(`${contactType} logged successfully`);
  };

  // Communication template inserts
  const applyCommTemplate = (templateType: 'first' | 'checkin' | 'docs') => {
    if (!selectedCard) return;
    const name = selectedCard.clientName.split(' ')[0];
    let msg = '';
    if (templateType === 'first') {
      msg = `Hi ${name}, thank you for reaching out to LiliSare! We received your inquiry regarding our ${selectedCard.service} program. We’d love to connect with your family to discuss your care preferences and schedule a phone consultation.`;
    } else if (templateType === 'checkin') {
      msg = `Hello ${name}, warm greetings from LiliSare! Just checking in to see if you have any questions regarding our care team or how the Medicaid enrollment process works. We're here whenever you're ready.`;
    } else if (templateType === 'docs') {
      msg = `Hi ${name}, we're excited to finalize your care onboarding! Could you kindly upload a quick photo of your Medicaid card and photo ID so we can confirm authorization with your case manager? Thank you so much!`;
    }
    setCommDraft(msg);
  };

  const handleSendCommDraft = () => {
    if (!selectedCard || !commDraft.trim()) return;
    const updated = cards.map((c) => {
      if (c.id === selectedCard.id) {
        return {
          ...c,
          commLog: [
            {
              date: 'Just now',
              type: 'SMS' as const,
              text: commDraft.trim(),
              staff: c.staff,
            },
            ...(c.commLog || []),
          ],
          activityLog: [
            {
              date: 'Just now',
              text: `Message sent to ${c.phone || 'client'}: "${commDraft.trim().slice(0, 45)}..."`,
              isAutomated: false,
            },
            ...(c.activityLog || []),
          ],
        };
      }
      return c;
    });
    setCards(updated);
    setSelectedCard(updated.find((c) => c.id === selectedCard.id) || null);
    setCommDraft('');
    showToast('Message sent and logged');
  };

  // Simulate Dictation for New Inquiry Form
  const simulateDictation = () => {
    setIsDictatingForm(true);
    const steps: Array<[string, string]> = [
      ['name', 'Elena Rostova'],
      ['dob', '1988-06-14'],
      ['county', 'Denver'],
      ['phone', '(303) 555-0819'],
      ['source', 'Case Management Agency'],
      ['svc', 'IHSS'],
      ['owner', 'Maya R.'],
      ['notes', 'Client requires 28 hrs/wk IHSS attendant care. Spouse will be the primary caregiver.'],
    ];

    steps.forEach(([key, val], idx) => {
      setTimeout(() => {
        setForm((prev) => ({ ...prev, [key]: val }));
        if (idx === steps.length - 1) {
          setIsDictatingForm(false);
          showToast('Voice dictation complete: 8 fields filled');
        }
      }, 500 * (idx + 1));
    });
  };

  // Simulate Dictation for Notes in Drawer
  const simulateNoteDictation = () => {
    if (!selectedCard) return;
    setIsDictatingNotes(true);
    const dictatedText =
      ' Clinical assessment note: Client demonstrates mobility limitations following post-surgical discharge. Requires 2-person transfer support during morning routine and specialized dietary preparation. Case manager is supportive of full waiver hour allocation.';

    setTimeout(() => {
      const updated = cards.map((c) => {
        if (c.id === selectedCard.id) {
          const newNotes = (c.notes || '') + dictatedText;
          return {
            ...c,
            notes: newNotes,
            activityLog: [
              {
                date: 'Just now',
                text: '🎤 Voice clinical dictation transcribed to intake assessment notes',
                isAutomated: false,
              },
              ...(c.activityLog || []),
            ],
          };
        }
        return c;
      });
      setCards(updated);
      setSelectedCard(updated.find((c) => c.id === selectedCard.id) || null);
      setIsDictatingNotes(false);
      showToast('Clinical dictation saved to chart');
    }, 1800);
  };

  // Save New Inquiry from Form
  const handleSaveInquiry = () => {
    const newCard: InquiryCard = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      stage: addPreselectedStage,
      clientName: form.name || 'New Inquiry',
      source: form.source || 'Website',
      service: form.svc || 'IHSS',
      staff: form.owner || 'Maya R.',
      followUp: 'Nov 24',
      isOverdue: false,
      daysInStage: 1,
      currentStep: 1,
      statusChip: 'Auto follow-up sent',
      age: form.dob ? 2026 - parseInt(form.dob.split('-')[0]) : 35,
      county: form.county || 'Denver',
      responsibleParty: `${form.name || 'Client'} (Self)`,
      phone: form.phone || '(303) 555-0100',
      email: `${(form.name || 'client').toLowerCase().replace(' ', '.')}@example.com`,
      address: `${form.county || 'Denver'}, CO`,
      preferredLanguage: 'English',
      estimatedHours: 25,
      careNeeds: ['Personal care', 'Meal prep', 'Mobility support'],
      authStatus: 'Requested',
      authDaysWaiting: 1,
      packetStatus: 'Sent',
      notes: form.notes || 'Inquiry logged from new inquiry intake dialog.',
      nextBestAction: 'Schedule 15-minute phone consultation to introduce LiliSare care coordinator.',
      isNextBestAutomated: true,
      commLog: [
        { date: 'Just now', type: 'Email', text: 'Welcome letter dispatched automatically.', staff: 'System' },
      ],
      activityLog: [
        { date: 'Just now', text: `Inquiry created in ${addPreselectedStage}`, isAutomated: false },
      ],
    };

    setCards([newCard, ...cards]);
    setIsAddOpen(false);
    setForm({});
    showToast(`Inquiry created for ${deIdentify(newCard.clientName)}`);
    addFeed(`New inquiry created for ${deIdentify(newCard.clientName)} (${newCard.service})`, false);
  };

  // Summary Metrics
  const totalOpen = cards.filter((c) => c.stage !== 'Converted' && c.stage !== 'Closed / Not Proceeding').length;
  const totalOverdue = cards.filter((c) => c.isOverdue).length;
  const convertedMonth = cards.filter((c) => c.stage === 'Converted').length + 5; // realistic demo total
  const avgDaysToConvert = 11;

  return (
    <Page
      t="Client Intake"
      s="Track family and client inquiries from first call to conversion. Caregiver hiring is handled in Onboarding."
      a={
        <div className="flex items-center gap-2">
          <Btn
            k="primary"
            onClick={() => {
              setAddPreselectedStage('New Inquiry');
              setIsAddOpen(true);
            }}
          >
            + Add inquiry
          </Btn>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 1. SLIM SUMMARY ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center gap-3 px-3 py-1.5 border-r border-stone-100 last:border-none">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total open</div>
              <div className="text-lg font-black text-[#1c2a17] leading-tight">{totalOpen}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 border-r border-stone-100 last:border-none">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Overdue follow-ups</div>
              <div className="text-lg font-black text-red-700 leading-tight">{totalOverdue}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 border-r border-stone-100 last:border-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3E6B2B] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Converted this month</div>
              <div className="text-lg font-black text-[#3E6B2B] leading-tight">{convertedMonth}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Avg days to convert</div>
              <div className="text-lg font-black text-stone-900 leading-tight">{avgDaysToConvert}d</div>
            </div>
          </div>
        </div>

        {/* 2. FILTERS & VIEW TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 border border-stone-200 rounded-xl p-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by client name…"
                className="w-full bg-white border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
              />
              <span className="absolute left-2.5 top-2 text-stone-400 text-xs">🔍</span>
            </div>

            {/* Owner filter */}
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="All">All Owners</option>
              {STAFF.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Service filter */}
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="All">All Services</option>
              {Object.keys(DEF).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Source filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="All">All Sources</option>
              {SRC.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>

            {/* Overdue Only Toggle */}
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-stone-100 transition select-none">
              <input
                type="checkbox"
                checked={filterOverdueOnly}
                onChange={(e) => setFilterOverdueOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-red-600 rounded cursor-pointer"
              />
              <span className={filterOverdueOnly ? 'text-red-700' : ''}>Overdue follow-ups only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {/* Source Insights Toggle */}
            <button
              type="button"
              onClick={() => setShowSourceInsights(!showSourceInsights)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                showSourceInsights
                  ? 'bg-[#3E6B2B] text-white border-[#3E6B2B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <span>📊</span>
              <span>Source insights</span>
            </button>

            {/* Board / List Switcher */}
            <div className="flex items-center bg-stone-200 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`px-3 py-1 rounded-md transition ${
                  viewMode === 'board'
                    ? 'bg-white text-stone-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Board
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md transition ${
                  viewMode === 'list'
                    ? 'bg-white text-stone-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* 3. COLLAPSIBLE SOURCE INSIGHTS PANEL */}
        {showSourceInsights && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[#1c2a17]">
                Leads by source & conversion rates
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                Rolling 90-day intake analytics
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ['Case Management Agency', '31 leads', '42% conv', 'text-emerald-700', 'bg-emerald-50'],
                ['Direct Referral', '24 leads', '65% conv', 'text-emerald-700', 'bg-emerald-50'],
                ['Phone', '18 leads', '28% conv', 'text-stone-700', 'bg-stone-50'],
                ['Website', '16 leads', '34% conv', 'text-emerald-700', 'bg-emerald-50'],
                ['RFP', '5 leads', '20% conv', 'text-stone-700', 'bg-stone-50'],
              ].map(([source, count, rate, textColor, bgColor], i) => (
                <div key={i} className={`p-3 rounded-lg border border-stone-200 ${bgColor}`}>
                  <div className="text-xs text-stone-600 font-semibold truncate">{source}</div>
                  <div className="text-xl font-black text-stone-900 mt-1">{count}</div>
                  <div className={`text-xs font-bold mt-0.5 ${textColor}`}>{rate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. KANBAN BOARD VIEW */}
        {viewMode === 'board' ? (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start">
            {STG.map((stage) => {
              const stageCards = filteredCards.filter((c) => c.stage === stage);
              const cfg = STAGE_CONFIGS[stage] || STAGE_CONFIGS['New Inquiry'];
              const isDragOver = dragOverStage === stage;

              return (
                <div
                  key={stage}
                  onDragOver={(e) => handleDragOver(e, stage)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage)}
                  className={`min-w-[285px] w-[285px] rounded-xl border p-3 shrink-0 flex flex-col justify-between transition-colors ${
                    cfg.bg
                  } ${isDragOver ? 'ring-2 ring-[#3E6B2B] bg-emerald-50/80' : ''}`}
                >
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-stone-200/80">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${cfg.dotColor} shrink-0`} />
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-stone-800 truncate">
                          {stage}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}
                      >
                        {stageCards.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="space-y-3 min-h-[120px]">
                      {stageCards.map((card) => {
                        // Progress bar styling
                        const stepPct = Math.round((card.currentStep / 7) * 100);
                        const isStale = (card.daysInStage || 0) > 3;
                        let barCol = 'bg-[#3E6B2B]';
                        if (card.isOverdue) barCol = 'bg-red-500';
                        else if (isStale) barCol = 'bg-amber-500';

                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, card)}
                            onClick={() => setSelectedCard(card)}
                            className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs hover:shadow-md hover:border-[#3E6B2B] transition-all cursor-pointer group relative"
                          >
                            {/* Card Top: Client Name & Service Pill + CLIENT Badge */}
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-bold text-sm text-stone-900 group-hover:text-[#3E6B2B] transition-colors leading-snug">
                                {deIdentify(card.clientName)}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                  CLIENT
                                </span>
                                <Pill c="green">{card.service}</Pill>
                              </div>
                            </div>

                            {/* Inquiry Label: Family inquiry or Case manager referral */}
                            <div className="text-xs text-stone-500 font-medium mb-2.5">
                              {card.source === 'Case Management Agency' || card.source === 'RFP'
                                ? 'Case manager referral'
                                : 'Family inquiry'}{' '}
                              · <span className="text-stone-400">{card.source}</span>
                            </div>

                            {/* Converted Column Dual Progress Pills (Requirement 4b) */}
                            {card.stage === 'Converted' && (
                              <div className="flex items-center gap-1.5 mb-2.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                  Client 2/5
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Caregiver 3/8
                                </span>
                              </div>
                            )}

                            {/* Status Chip (if any) */}
                            {card.statusChip && (
                              <div className="mb-2.5">
                                <span
                                  className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
                                    card.statusChip === 'Awaiting case manager'
                                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                      : card.statusChip === 'Docs missing'
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                      : card.statusChip === 'Payment at risk'
                                      ? 'bg-red-50 text-red-800 border border-red-200'
                                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                                  }`}
                                >
                                  {card.statusChip}
                                </span>
                              </div>
                            )}

                            {/* Closed Reason (for closed column) */}
                            {card.closedReason && (
                              <div className="mb-2.5">
                                <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                                  Closed: {card.closedReason}
                                </span>
                              </div>
                            )}

                            {/* Intake Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-[11px] text-stone-600 font-medium mb-1">
                                <span>{card.currentStep} of 7 steps</span>
                                <span className="text-stone-400">
                                  {INTAKE_STEPS[card.currentStep - 1] || 'Done'}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${stepPct}%` }}
                                  className={`h-full ${barCol} rounded-full transition-all duration-300`}
                                />
                              </div>
                            </div>

                            {/* Card Footer: Avatar, Follow-up, Days in Stage */}
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                              <div className="flex items-center gap-1.5">
                                <span
                                  title={`Owner: ${card.staff}`}
                                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${getStaffColor(
                                    card.staff
                                  )}`}
                                >
                                  {getStaffInitials(card.staff)}
                                </span>
                                {card.followUp !== '—' && (
                                  <span
                                    className={
                                      card.isOverdue
                                        ? 'text-red-700 font-bold bg-red-50 px-1 rounded'
                                        : 'text-stone-600 font-medium'
                                    }
                                  >
                                    {card.isOverdue ? 'Overdue: ' : 'Follow-up '}
                                    {card.followUp}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-medium text-stone-400">
                                  {card.daysInStage}d
                                </span>
                                <span className="text-[#3E6B2B] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                                  View →
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dashed "+ Add inquiry" at the bottom of each column */}
                  <button
                    type="button"
                    onClick={() => {
                      setAddPreselectedStage(stage);
                      setIsAddOpen(true);
                    }}
                    className="mt-3 w-full py-2 px-3 border border-dashed border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:text-[#3E6B2B] hover:border-[#3E6B2B] hover:bg-white/80 transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>+ Add inquiry</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* 5. LIST VIEW ALTERNATIVE */
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Current Stage</th>
                    <th className="py-3 px-4">Intake Progress</th>
                    <th className="py-3 px-4">Next Follow-up</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Days</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className="hover:bg-stone-50/70 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-bold text-stone-900">
                        <div className="flex items-center gap-1.5">
                          <span>{deIdentify(card.clientName)}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            CLIENT
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Pill c="green">{card.service}</Pill>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{card.source}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800">{card.stage}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="h-1.5 w-16 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.round((card.currentStep / 7) * 100)}%` }}
                              className={`h-full ${
                                card.isOverdue
                                  ? 'bg-red-500'
                                  : (card.daysInStage || 0) > 3
                                  ? 'bg-amber-500'
                                  : 'bg-[#3E6B2B]'
                              }`}
                            />
                          </div>
                          <span className="text-stone-500">{card.currentStep}/7</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {card.isOverdue ? (
                          <span className="text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                            {card.followUp} (Overdue)
                          </span>
                        ) : (
                          card.followUp
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${getStaffColor(
                              card.staff
                            )}`}
                          >
                            {getStaffInitials(card.staff)}
                          </span>
                          <span>{card.staff}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-500">{card.daysInStage}d</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(card);
                          }}
                          className="text-[#3E6B2B] hover:underline font-semibold"
                        >
                          View chart →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tip at bottom */}
        <p className="text-xs text-stone-500">
          Tip: Drag cards to change stage, click to open.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 6. RIGHT-SIDE SLIDE-OVER DRAWER (CLIENT DETAIL & INTAKE WORKFLOW) */}
      {/* ========================================================================= */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn"
          onClick={() => setSelectedCard(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Client intake details"
            className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-extrabold text-[#1c2a17]">
                      {deIdentify(selectedCard.clientName)}
                    </h2>
                    <Pill c="green">{selectedCard.service}</Pill>
                    {selectedCard.statusChip && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {selectedCard.statusChip}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-medium flex-wrap">
                    <span>Age: {selectedCard.age || 34}</span>
                    <span>·</span>
                    <span>County: {selectedCard.county || 'Denver'}</span>
                    <span>·</span>
                    <span>Source: {selectedCard.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${getStaffColor(
                          selectedCard.staff
                        )}`}
                      >
                        {getStaffInitials(selectedCard.staff)}
                      </span>
                      {selectedCard.staff}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition"
                >
                  ✕
                </button>
              </div>

              {/* Stage Selector & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/80">
                {/* Stage dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500">Stage:</span>
                  <select
                    value={selectedCard.stage}
                    onChange={(e) => {
                      const newStage = e.target.value;
                      const updated = cards.map((c) =>
                        c.id === selectedCard.id ? { ...c, stage: newStage } : c
                      );
                      setCards(updated);
                      setSelectedCard({ ...selectedCard, stage: newStage });
                      showToast(`Stage changed to ${newStage}`);
                    }}
                    className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-800 focus:outline-none"
                  >
                    {STG.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLogContactOpen(!isLogContactOpen)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg shadow-2xs transition"
                  >
                    Log contact
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendFollowUp(selectedCard)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-lg shadow-2xs transition"
                  >
                    Send follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestConvert(selectedCard)}
                    className="px-3 py-1 text-xs font-bold text-white bg-[#3E6B2B] hover:bg-[#335a23] rounded-lg shadow-2xs transition"
                  >
                    Convert to client
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Log Contact Form Dropdown */}
            {isLogContactOpen && (
              <div className="bg-emerald-50/70 border-b border-emerald-200 p-4 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Log interaction with {deIdentify(selectedCard.clientName)}</span>
                  <button
                    type="button"
                    onClick={() => setIsLogContactOpen(false)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2 text-xs">
                  {(['Call', 'Email', 'SMS', 'Note'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setContactType(t)}
                      className={`px-2.5 py-1 rounded-md font-semibold transition ${
                        contactType === t
                          ? 'bg-[#3E6B2B] text-white'
                          : 'bg-white text-stone-700 border border-stone-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <textarea
                  value={contactNote}
                  onChange={(e) => setContactNote(e.target.value)}
                  placeholder={`Summary of ${contactType.toLowerCase()}…`}
                  rows={2}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#3E6B2B]"
                />
                <div className="flex justify-end gap-2">
                  <Btn k="ghost" onClick={() => setIsLogContactOpen(false)}>
                    Cancel
                  </Btn>
                  <Btn k="primary" onClick={handleLogContactSubmit}>
                    Save entry
                  </Btn>
                </div>
              </div>
            )}

            {/* Horizontal Stepper (7 Steps) */}
            <div className="px-5 py-4 bg-white border-b border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Intake Progress: Step {selectedCard.currentStep} of 7
                </span>
                {selectedCard.currentStep < 7 && (
                  <button
                    type="button"
                    onClick={() => handleAdvanceStep(selectedCard)}
                    className="text-xs font-bold text-[#3E6B2B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full transition"
                  >
                    Mark complete ✓
                  </button>
                )}
              </div>

              {/* Progress Stepper Bar */}
              <div className="grid grid-cols-7 gap-1">
                {INTAKE_STEPS.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = stepNum < selectedCard.currentStep;
                  const isCurrent = stepNum === selectedCard.currentStep;

                  return (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div
                        className={`w-full h-1.5 rounded-full mb-1.5 transition ${
                          isCompleted
                            ? 'bg-[#3E6B2B]'
                            : isCurrent
                            ? 'bg-amber-400 ring-1 ring-amber-500'
                            : 'bg-stone-200'
                        }`}
                      />
                      <span
                        className={`text-[10px] leading-tight truncate w-full ${
                          isCompleted
                            ? 'text-stone-700 font-semibold'
                            : isCurrent
                            ? 'text-[#1c2a17] font-bold'
                            : 'text-stone-400 font-normal'
                        }`}
                        title={step}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Best Action Card */}
            {selectedCard.nextBestAction && (
              <div className="mx-5 mt-4 p-3 bg-stone-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[#1c2a17]">Next best action</span>
                    {selectedCard.isNextBestAutomated ? (
                      <span className="bg-emerald-100 text-[#3E6B2B] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        ⚡ Automated
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        Action needed
                      </span>
                    )}
                  </div>
                  <p className="text-stone-600">{selectedCard.nextBestAction}</p>
                </div>
              </div>
            )}

            {/* Drawer Tabs Navigation */}
            <div className="flex gap-1 px-5 pt-3 border-b border-stone-200 text-xs font-bold overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'needs', label: 'Needs & Service Plan' },
                { id: 'cm', label: 'Case Manager & Auth' },
                { id: 'comm', label: `Communication (${selectedCard.commLog?.length || 0})` },
                { id: 'docs', label: 'Documents' },
                { id: 'activity', label: 'Activity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-2 px-3 border-b-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-[#3E6B2B] text-[#3E6B2B]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Tab Content Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm">Contact Information</h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-stone-700">
                      <div>
                        <span className="text-stone-400 block font-normal">Responsible party:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.responsibleParty || deIdentify(selectedCard.clientName)}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-normal">Preferred language:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.preferredLanguage || 'English'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-normal">Primary phone:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.phone || '(303) 555-0100'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-normal">Email address:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.email || 'client@example.com'}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-stone-400 block font-normal">Home address:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.address || 'Denver Metro Area, CO'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-stone-900 text-sm">Referral Source & Context</h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-stone-700">
                      <div>
                        <span className="text-stone-400 block">Channel:</span>
                        <span className="font-semibold text-stone-900">{selectedCard.source}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Assigned coordinator:</span>
                        <span className="font-semibold text-stone-900">{selectedCard.staff}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-sm">Intake Coordinator Notes</h4>
                      <button
                        type="button"
                        onClick={() => showToast('Notes saved to client profile')}
                        className="text-xs text-[#3E6B2B] hover:underline font-semibold"
                      >
                        Save
                      </button>
                    </div>
                    <textarea
                      defaultValue={selectedCard.notes || 'No preliminary notes recorded.'}
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#3E6B2B]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: NEEDS & SERVICE PLAN */}
              {activeTab === 'needs' && (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-stone-500 font-medium block">Program requested</span>
                      <span className="font-black text-lg text-[#1c2a17]">
                        {selectedCard.service} Program
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-500 font-medium block">Estimated weekly hours</span>
                      <span className="font-black text-lg text-[#3E6B2B]">
                        ~{selectedCard.estimatedHours || 25} hrs / wk
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-sm">Care Needs Checklist</h4>
                      <button
                        type="button"
                        onClick={simulateNoteDictation}
                        disabled={isDictatingNotes}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs transition ${
                          isDictatingNotes
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-[#F2B632] text-stone-900 hover:brightness-95'
                        }`}
                      >
                        <span>🎤</span>
                        <span>{isDictatingNotes ? 'Dictating…' : 'Dictate notes'}</span>
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-stone-800">
                      {[
                        'Bathing & personal grooming',
                        'Dressing & hygiene assistance',
                        'Mobility & transfer assistance',
                        'Meal preparation & nutrition',
                        'Medication administration / reminders',
                        'Light housekeeping & laundry',
                        'Community access & transport',
                        'Cognitive / behavioral support',
                      ].map((need) => (
                        <label
                          key={need}
                          className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            defaultChecked={
                              selectedCard.careNeeds?.some((n) =>
                                need.toLowerCase().includes(n.toLowerCase().split(' ')[0])
                              ) ?? true
                            }
                            className="w-3.5 h-3.5 accent-[#3E6B2B] rounded"
                          />
                          <span className="font-medium text-stone-800">{need}</span>
                        </label>
                      ))}
                    </div>

                    <div className="pt-2">
                      <span className="text-stone-500 font-semibold block mb-1">
                        Clinical Assessment Notes:
                      </span>
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 leading-relaxed">
                        {selectedCard.notes || 'Awaiting initial RN in-home assessment.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CASE MANAGER & AUTHORIZATION */}
              {activeTab === 'cm' && (
                <div className="space-y-4">
                  {/* Warning banner if overdue or at risk */}
                  {selectedCard.authStatus === 'Overdue' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      <span>
                        Payment at risk: State Medicaid authorization has been waiting{' '}
                        {selectedCard.authDaysWaiting || 14} days without approval.
                      </span>
                    </div>
                  )}

                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm">Linked Case Management Agency</h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-stone-800">
                      <div>
                        <span className="text-stone-400 block font-normal">Case Manager:</span>
                        <span className="font-bold text-stone-900">
                          {selectedCard.caseManagerName || 'Dana Whitfield'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-normal">CMA Agency:</span>
                        <span className="font-bold text-stone-900">
                          {selectedCard.caseManagerAgency || 'Rocky Mountain Human Services'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-normal">Email:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.caseManagerEmail || 'cm@example.org'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-normal">Direct Phone:</span>
                        <span className="font-semibold text-stone-900">
                          {selectedCard.caseManagerPhone || '(303) 555-0199'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Authorization Status</h4>
                        <span className="text-stone-500 font-medium">
                          {selectedCard.authDaysWaiting} days waiting on state determination
                        </span>
                      </div>
                      <Pill
                        c={
                          selectedCard.authStatus === 'Approved'
                            ? 'green'
                            : selectedCard.authStatus === 'Overdue'
                            ? 'red'
                            : 'amber'
                        }
                      >
                        {selectedCard.authStatus || 'Requested'}
                      </Pill>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800">Automated Case Manager Follow-ups</span>
                        <button
                          type="button"
                          onClick={() => {
                            showToast(
                              `Priority authorization nudge sent to ${
                                selectedCard.caseManagerName || 'Case Manager'
                              }`
                            );
                            addFeed(
                              `Automated PAR reminder dispatched to ${
                                selectedCard.caseManagerName || 'Case Manager'
                              } for ${deIdentify(selectedCard.clientName)}`,
                              true
                            );
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-[#3E6B2B] hover:bg-[#335a23] rounded-lg transition"
                        >
                          Send follow-up now
                        </button>
                      </div>
                      <div className="space-y-1.5 text-stone-600 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#3E6B2B]">✓</span>
                          <span>Day 1: Initial PAR packet submitted electronically</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#3E6B2B]">✓</span>
                          <span>Day 3: Automated status check inquiry sent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600">●</span>
                          <span>Day 7: State escalation reminder queued</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: COMMUNICATION */}
              {activeTab === 'comm' && (
                <div className="space-y-4">
                  {/* Template quick buttons */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                    <span className="text-stone-500 font-semibold block mb-2">
                      Quick message templates (LiliSare Caring Tone):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyCommTemplate('first')}
                        className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg hover:border-[#3E6B2B] font-semibold text-stone-700 transition"
                      >
                        “First contact”
                      </button>
                      <button
                        type="button"
                        onClick={() => applyCommTemplate('checkin')}
                        className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg hover:border-[#3E6B2B] font-semibold text-stone-700 transition"
                      >
                        “Checking in”
                      </button>
                      <button
                        type="button"
                        onClick={() => applyCommTemplate('docs')}
                        className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg hover:border-[#3E6B2B] font-semibold text-stone-700 transition"
                      >
                        “Missing documents”
                      </button>
                    </div>
                  </div>

                  {/* Message Composer */}
                  <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-2">
                    <textarea
                      value={commDraft}
                      onChange={(e) => setCommDraft(e.target.value)}
                      placeholder="Compose call summary, email or SMS text to client or family…"
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#3E6B2B]"
                    />
                    <div className="flex justify-end gap-2">
                      <Btn k="ghost" onClick={() => setCommDraft('')}>
                        Clear
                      </Btn>
                      <Btn k="primary" onClick={handleSendCommDraft}>
                        Send & Log
                      </Btn>
                    </div>
                  </div>

                  {/* Communication History */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-900 text-sm">Interaction History</h4>
                    <div className="space-y-2">
                      {selectedCard.commLog && selectedCard.commLog.length > 0 ? (
                        selectedCard.commLog.map((c, i) => (
                          <div
                            key={i}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between text-stone-500">
                              <span className="font-bold text-stone-800">
                                {c.type === 'Call'
                                  ? '📞 Phone Call'
                                  : c.type === 'Email'
                                  ? '✉️ Email'
                                  : c.type === 'SMS'
                                  ? '💬 SMS'
                                  : '📝 Note'}{' '}
                                · {c.staff}
                              </span>
                              <span>{c.date}</span>
                            </div>
                            <p className="text-stone-700 font-medium">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-500 italic">No communication logged yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DOCUMENTS */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-stone-500 font-medium block">Client Packet Status</span>
                      <span className="font-black text-base text-stone-900">
                        {selectedCard.packetStatus || 'Sent'}
                      </span>
                    </div>
                    <Pill
                      c={
                        selectedCard.packetStatus === 'Signed'
                          ? 'green'
                          : selectedCard.packetStatus === 'Missing'
                          ? 'red'
                          : 'amber'
                      }
                    >
                      {selectedCard.packetStatus || 'Sent'}
                    </Pill>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 text-sm">Intake Document Checklist</h4>
                      <button
                        type="button"
                        onClick={() => showToast('Simulated document upload: Form attached')}
                        className="text-xs font-semibold text-[#3E6B2B] border border-stone-300 rounded-lg px-2.5 py-1 hover:bg-stone-50"
                      >
                        + Upload document
                      </button>
                    </div>

                    <div className="divide-y divide-stone-100">
                      {[
                        { name: 'Client Intake Questionnaire', status: 'Signed', date: 'Nov 14' },
                        { name: 'Medicaid Card & State ID', status: 'Verified', date: 'Nov 15' },
                        { name: 'Physician Order / Medical Attestation', status: 'Missing', date: '—' },
                        { name: 'Case Management Agency PAR Authorization', status: 'Sent to CMA', date: 'Nov 12' },
                      ].map((doc, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-stone-900 block">{doc.name}</span>
                            <span className="text-stone-500 text-[11px]">Updated {doc.date}</span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              doc.status === 'Signed' || doc.status === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'Missing'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ACTIVITY TIMELINE */}
              {activeTab === 'activity' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm">Audit Trail & Timeline</h4>
                  <div className="space-y-2">
                    {selectedCard.activityLog && selectedCard.activityLog.length > 0 ? (
                      selectedCard.activityLog.map((act, i) => (
                        <div
                          key={i}
                          className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5"
                        >
                          <span className="text-base shrink-0">
                            {act.isAutomated ? '⚡' : '👤'}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center text-stone-500 mb-0.5">
                              <span className="font-bold text-stone-800">
                                {act.isAutomated ? 'LiliSare Automation' : 'Staff Action'}
                              </span>
                              <span>{act.date}</span>
                            </div>
                            <p className="text-stone-700 font-medium">{act.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-stone-500 italic">No activity entries recorded.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONVERT TO CLIENT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isConvertModalOpen && cardToConvert && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onKeyDown={(e) => e.key === 'Escape' && setIsConvertModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Convert to client confirmation"
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4"
          >
            {!conversionSuccess ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <span className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xl shrink-0 font-bold">
                    👥
                  </span>
                  <div>
                    <h3 className="font-black text-lg text-[#1c2a17]">
                      Convert to Client & Start Onboarding
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">
                      {deIdentify(cardToConvert.clientName)} · {cardToConvert.service} Program
                    </span>
                  </div>
                </div>

                {/* Always: Create Client Record */}
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      Create Client Record
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-900">
                      Always Created
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    Creates client record in the <b>{cardToConvert.service}</b> program, creates a new Household in Onboarding, and assigns digital intake consent packets.
                  </p>
                </div>

                {/* Family Caregiver Toggle */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-xs text-stone-900 flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={familyCaregiverToggle}
                        onChange={(e) => setFamilyCaregiverToggle(e.target.checked)}
                        className="w-4 h-4 accent-[#3E6B2B] rounded cursor-pointer"
                      />
                      <span>The family member will also be the caregiver</span>
                    </label>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        familyCaregiverToggle
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {familyCaregiverToggle ? 'CAREGIVER' : 'OFF'}
                    </span>
                  </div>

                  {familyCaregiverToggle ? (
                    <p className="text-[11px] text-stone-600 pl-6 leading-relaxed">
                      Reuses shared household contact and address data to automatically spawn a Caregiver Onboarding track for the family attendant.
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-500 pl-6 leading-relaxed">
                      Client-only onboarding. An outside caregiver can be recruited or linked later.
                    </p>
                  )}

                  {familyCaregiverToggle && (
                    <div className="pl-6 pt-1">
                      <button
                        type="button"
                        onClick={() => setFamilyCaregiverToggle(false)}
                        className="text-[11px] text-[#3E6B2B] hover:underline font-semibold"
                      >
                        Link caregiver later instead →
                      </button>
                    </div>
                  )}
                </div>

                {/* Next Steps Checklist */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 text-stone-700">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3E6B2B] font-bold">✓</span>
                    <span>Initiate digital client packet and case-manager approval</span>
                  </div>
                  {familyCaregiverToggle && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#3E6B2B] font-bold">✓</span>
                      <span>Dispatch caregiver packet & request background screening</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <Btn k="ghost" onClick={() => setIsConvertModalOpen(false)}>
                    Cancel
                  </Btn>
                  <Btn k="primary" onClick={handleConfirmConvert}>
                    Confirm Conversion
                  </Btn>
                </div>
              </>
            ) : (
              /* Success View After Confirmation */
              <div className="space-y-4 text-center py-2 animate-fadeIn">
                <span className="w-12 h-12 rounded-full bg-emerald-100 text-[#3E6B2B] flex items-center justify-center text-2xl mx-auto font-bold">
                  ✓
                </span>
                <div>
                  <h3 className="font-black text-lg text-[#1c2a17]">
                    Conversion Complete!
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    {deIdentify(cardToConvert.clientName)} household is now active in Onboarding.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-left space-y-1.5 text-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">●</span>
                    <span>Client track created: client packet sent, state authorization pending</span>
                  </div>
                  {familyCaregiverToggle ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[#3E6B2B] font-bold">●</span>
                      <span>Caregiver track created: hiring packet and CBI screening assigned</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600 font-bold">●</span>
                      <span>Caregiver track: pending assignment (link or recruit later)</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsConvertModalOpen(false);
                      navigate('onboarding');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition"
                  >
                    Open client onboarding →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsConvertModalOpen(false);
                      navigate('onboarding');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#3E6B2B] hover:bg-[#335a23] rounded-lg shadow-2xs transition"
                  >
                    Open caregiver onboarding →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. ADD INQUIRY MODAL WITH LIVE VOICE DICTATE */}
      {/* ========================================================================= */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onKeyDown={(e) => e.key === 'Escape' && setIsAddOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add inquiry"
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">Add New Inquiry</h3>
                <span className="text-xs text-stone-500">
                  Target column: <b>{addPreselectedStage}</b>
                </span>
              </div>
              <button
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isDictatingForm
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#F2B632] text-stone-900 hover:brightness-95'
                }`}
                onClick={simulateDictation}
              >
                {isDictatingForm ? '● Listening…' : '🎤 Dictate'}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <label className="block text-stone-700 sm:col-span-2">
                Client name
                <input
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                />
              </label>

              <label className="block text-stone-700">
                Date of birth
                <input
                  type="date"
                  value={form.dob || ''}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                />
              </label>

              <label className="block text-stone-700">
                County
                <input
                  value={form.county || ''}
                  onChange={(e) => setForm({ ...form, county: e.target.value })}
                  placeholder="e.g. Denver"
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                />
              </label>

              <label className="block text-stone-700">
                Primary phone
                <input
                  value={form.phone || ''}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(303) 555-0100"
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                />
              </label>

              <label className="block text-stone-700">
                Referral source
                <select
                  value={form.source || ''}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                >
                  <option value="">Select source…</option>
                  {SRC.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-stone-700">
                Service requested
                <select
                  value={form.svc || ''}
                  onChange={(e) => setForm({ ...form, svc: e.target.value })}
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                >
                  <option value="">Select service…</option>
                  {Object.keys(DEF).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-stone-700">
                Assigned staff
                <select
                  value={form.owner || ''}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                >
                  <option value="">Select owner…</option>
                  {STAFF.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-stone-700 sm:col-span-2">
                Initial intake notes
                <textarea
                  value={form.notes || ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Service requirements, family caregiver requests, schedule preferences…"
                  className="mt-1 w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#3E6B2B]/20"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <Btn k="ghost" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Btn>
              <Btn k="primary" onClick={handleSaveInquiry}>
                Save Inquiry
              </Btn>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};
