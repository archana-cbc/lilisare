'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/shell/Sidebar';
import { Header } from '@/components/shell/Header';
import { Drawer } from '@/components/shell/Drawer';
import { Toast } from '@/components/shell/Toast';
import { Skel } from '@/components/ui';

import { TodayPage } from '@/components/pages/TodayPage';
import { IntakePage } from '@/components/pages/IntakePage';
import { CaregiverIntakePage } from '@/components/pages/CaregiverIntakePage';
import { OnboardingPage } from '@/components/pages/OnboardingPage';
import { ClientsPage } from '@/components/pages/ClientsPage';
import { CaregiversPage } from '@/components/pages/CaregiversPage';
import { SchedulingPage } from '@/components/pages/SchedulingPage';
import { CompliancePage } from '@/components/pages/CompliancePage';
import { AuditPage } from '@/components/pages/AuditPage';
import { EmailsPage } from '@/components/pages/EmailsPage';
import { ScreeningPage } from '@/components/pages/ScreeningPage';
import { BillingPage } from '@/components/pages/BillingPage';
import { ProfitPage } from '@/components/pages/ProfitPage';
import { RulesPage } from '@/components/pages/RulesPage';
import { SystemsPage } from '@/components/pages/SystemsPage';
import { MigrationPage } from '@/components/pages/MigrationPage';
import { UsersPage } from '@/components/pages/UsersPage';
import { StubPage } from '@/components/pages/StubPage';
import { RoadmapPage } from '@/components/pages/RoadmapPage';

function DashboardContent() {
  const { page, isLoadingPage } = useApp();

  const renderCurrentPage = () => {
    if (isLoadingPage) {
      return <Skel />;
    }

    switch (page) {
      case 'today':
        return <TodayPage />;
      case 'intake':
        return <IntakePage />;
      case 'cg-intake':
        return <CaregiverIntakePage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'clients':
        return <ClientsPage />;
      case 'caregivers':
        return <CaregiversPage />;
      case 'scheduling':
        return <SchedulingPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'audit':
        return <AuditPage />;
      case 'emails':
        return <EmailsPage />;
      case 'screening':
        return <ScreeningPage />;
      case 'billing':
        return <BillingPage />;
      case 'profit':
        return <ProfitPage />;
      case 'rules':
        return <RulesPage />;
      case 'systems':
        return <SystemsPage />;
      case 'migration':
        return <MigrationPage />;
      case 'users':
        return <UsersPage />;
      case 'reports':
        return <StubPage type="reports" />;
      case 'settings':
        return <StubPage type="settings" />;
      case 'roadmap':
        return <RoadmapPage />;
      default:
        return <TodayPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />
        <main className="p-4 lg:p-6 max-w-[1400px] w-full flex-1 mx-auto">
          {renderCurrentPage()}
        </main>
      </div>
      <Drawer />
      <Toast />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
