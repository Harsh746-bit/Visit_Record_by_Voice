import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OverviewView } from './features/dashboard/OverviewView';
import { WorkersDirectoryView } from './features/workers/WorkersDirectoryView';
import { BeneficiaryManagementView } from './features/beneficiaries/BeneficiaryManagementView';
import { VisitRecordsQueueView } from './features/visits/VisitRecordsQueueView';
import { SplitEvidenceReviewView } from './features/evidence/SplitEvidenceReviewView';
import { ReportsAnalyticsView } from './features/reports/ReportsAnalyticsView';
import { AnmSettingsView } from './features/settings/AnmSettingsView';
import { AshaVisitFlowView } from './features/asha/AshaVisitFlowView';
import { AshaPhoneSimulator } from './features/simulator/AshaPhoneSimulator';
import { LoginView } from './features/auth/LoginView';
import { liveDataService } from './services/liveDataService';
import { ViewMode, AnmNavigationTab, StructuredVisit, Beneficiary, AshaWorker } from './types';
import { MOCK_WORKERS, MOCK_BENEFICIARIES, MOCK_VISIT_RECORDS } from './data/mockData';
import { ShieldCheck, Smartphone, LayoutList } from 'lucide-react';
import { translations } from './i18n/translations';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [guestMode, setGuestMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('asha');
  const [ashaDisplayMode, setAshaDisplayMode] = useState<'workflow' | 'phone'>('workflow');
  const [activeTab, setActiveTab] = useState<AnmNavigationTab>('overview');
  const [selectedRecord, setSelectedRecord] = useState<StructuredVisit | null>(null);
  const [records, setRecords] = useState<StructuredVisit[]>([...MOCK_VISIT_RECORDS]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([...MOCK_BENEFICIARIES]);
  const [workers, setWorkers] = useState<AshaWorker[]>([...MOCK_WORKERS]);
  const [lang, setLang] = useState<'mr' | 'hi' | 'en'>('mr');
  const t = translations[lang];

  // Load live data from FastAPI PostgreSQL backend
  useEffect(() => {
    liveDataService.getRecords().then(setRecords);
    liveDataService.getBeneficiaries().then(setBeneficiaries);
    liveDataService.getWorkers().then(setWorkers);
  }, [isAuthenticated]);

  // Real-time WebSocket sync: automatically refreshes records on 'visit.submitted' or 'high_risk.alert'
  const handleRealtimeEvent = useCallback(() => {
    liveDataService.getRecords().then(setRecords);
  }, []);
  useRealtimeSync('khed_shivapur_circle', handleRealtimeEvent);

  const pendingCount = records.filter(r => r.anmReviewStatus === 'pending').length;

  const handleUpdateRecordStatus = async (recordId: string, status: 'reviewed' | 'returned', notes: string) => {
    const updated = await liveDataService.updateReviewStatus(recordId, status, notes);
    if (updated) {
      setRecords(await liveDataService.getRecords());
      setSelectedRecord(updated);
    }
  };

  const handleNewRecordSubmitted = async (_newRecord: StructuredVisit) => {
    const updatedRecords = await liveDataService.getRecords();
    setRecords(updatedRecords);
  };

  // 1. Initial auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#087F8C]/30 border-t-[#087F8C] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">प्रणाली लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate: Show Login Screen
  if (!isAuthenticated && !guestMode) {
    return (
      <LoginView
        onSuccess={() => setGuestMode(false)}
        onContinueAsGuest={() => setGuestMode(true)}
      />
    );
  }

  // 3. Authenticated Dashboard Layout
  return (
    <DashboardLayout
      viewMode={viewMode}
      onChangeViewMode={setViewMode}
      activeTab={activeTab}
      onChangeTab={(tab) => {
        setSelectedRecord(null);
        setActiveTab(tab);
      }}
      pendingCount={pendingCount}
      recordsCount={records.length}
      lang={lang}
      onChangeLang={(l) => setLang(l as 'mr' | 'hi' | 'en')}
    >
      {/* MODE 1: ASHA FRONTLINE WORKFLOW */}
      {viewMode === 'asha' && (
        <div className="space-y-4 w-full">
          {/* Sub-navigation: Workflow UI vs Mobile Phone Frame */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-clinical-card w-full">
            <div>
              <span className="font-extrabold text-sm text-slate-900">
                {t.ashaFlowHeader}
              </span>
              <p className="text-xs text-slate-600 font-devanagari font-bold mt-0.5">
                {t.ashaFlowRoadmapSub}
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto shrink-0 border border-slate-200">
              <button
                onClick={() => setAshaDisplayMode('workflow')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  ashaDisplayMode === 'workflow'
                    ? 'bg-white text-cyan-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span>{t.roadmapFullUi}</span>
              </button>
              <button
                onClick={() => setAshaDisplayMode('phone')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  ashaDisplayMode === 'phone'
                    ? 'bg-white text-cyan-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{t.roadmapPhoneFrame}</span>
              </button>
            </div>
          </div>

          {ashaDisplayMode === 'workflow' ? (
            <AshaVisitFlowView
              onRecordCreated={handleNewRecordSubmitted}
              onOpenRecordDetail={(rec) => {
                setSelectedRecord(rec);
                setViewMode('anm');
              }}
              lang={lang}
              onChangeLang={(l) => setLang(l as 'mr' | 'hi' | 'en')}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-2">
              <AshaPhoneSimulator onRecordSubmitted={handleNewRecordSubmitted} />
            </div>
          )}
        </div>
      )}

      {/* MODE 2: ANM SUPERVISOR PORTAL */}
      {viewMode === 'anm' && (
        <>
          {selectedRecord ? (
            <SplitEvidenceReviewView
              record={selectedRecord}
              onBack={() => setSelectedRecord(null)}
              onUpdateStatus={handleUpdateRecordStatus}
            />
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  records={records}
                  workers={workers}
                  beneficiaries={beneficiaries}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  lang={lang}
                />
              )}
              {activeTab === 'workers' && (
                <WorkersDirectoryView workers={workers} />
              )}
              {activeTab === 'beneficiaries' && (
                <BeneficiaryManagementView
                  beneficiaries={beneficiaries}
                  records={records}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  lang={lang}
                />
              )}
              {activeTab === 'records' && (
                <VisitRecordsQueueView
                  records={records}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  lang={lang}
                />
              )}
              {activeTab === 'review_queue' && (
                <VisitRecordsQueueView
                  records={records}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  filterPendingOnly={true}
                  lang={lang}
                />
              )}
              {activeTab === 'reports' && (
                <ReportsAnalyticsView records={records} />
              )}
              {activeTab === 'settings' && (
                <AnmSettingsView />
              )}
            </>
          )}
        </>
      )}

      {/* MODE 3: LIVE DUAL-VIEW (ANM PORTAL + ASHA SIMULATOR SIDE-BY-SIDE) */}
      {viewMode === 'dual' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Side (7 cols): ANM Supervisor Review Queue */}
          <div className="xl:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#087F8C]" />
                <span className="font-bold text-sm text-[#172B3A]">ANM Supervisor Live Review Queue</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Connected & Synced
              </span>
            </div>

            {selectedRecord ? (
              <SplitEvidenceReviewView
                record={selectedRecord}
                onBack={() => setSelectedRecord(null)}
                onUpdateStatus={handleUpdateRecordStatus}
              />
            ) : (
              <VisitRecordsQueueView
                records={records}
                onSelectRecord={(rec) => setSelectedRecord(rec)}
              />
            )}
          </div>

          {/* Right Side (5 cols): Frontline ASHA Phone Simulator */}
          <div className="xl:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[390px] mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-[#087F8C]">Frontline ASHA Worker Device</span>
              <span>(Live Microphone Enabled)</span>
            </div>
            <AshaPhoneSimulator onRecordSubmitted={handleNewRecordSubmitted} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
