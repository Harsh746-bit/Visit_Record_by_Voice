import React, { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OverviewView } from './features/dashboard/OverviewView';
import { WorkersDirectoryView } from './features/workers/WorkersDirectoryView';
import { BeneficiaryManagementView } from './features/beneficiaries/BeneficiaryManagementView';
import { VisitRecordsQueueView } from './features/visits/VisitRecordsQueueView';
import { SplitEvidenceReviewView } from './features/evidence/SplitEvidenceReviewView';
import { ReportsAnalyticsView } from './features/reports/ReportsAnalyticsView';
import { AnmSettingsView } from './features/settings/AnmSettingsView';
import { AshaPhoneSimulator } from './features/simulator/AshaPhoneSimulator';
import { mockDataService } from './services/mockDataService';
import { ViewMode, AnmNavigationTab, StructuredVisit } from './types';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('anm');
  const [activeTab, setActiveTab] = useState<AnmNavigationTab>('overview');
  const [selectedRecord, setSelectedRecord] = useState<StructuredVisit | null>(null);
  const [records, setRecords] = useState<StructuredVisit[]>(() => mockDataService.getRecords());
  const [lang, setLang] = useState<'mr' | 'hi' | 'en'>('mr');

  const workers = mockDataService.getWorkers();
  const beneficiaries = mockDataService.getBeneficiaries();
  const pendingCount = records.filter(r => r.anmReviewStatus === 'pending').length;

  const handleUpdateRecordStatus = (recordId: string, status: 'reviewed' | 'returned', notes: string) => {
    const updated = mockDataService.updateReviewStatus(recordId, status, notes);
    if (updated) {
      setRecords(mockDataService.getRecords());
      setSelectedRecord(updated);
    }
  };

  const handleNewRecordSubmitted = (_newRecord: StructuredVisit) => {
    setRecords(mockDataService.getRecords());
  };

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
      {/* MODE 1: ASHA MOBILE PHONE SIMULATOR ONLY */}
      {viewMode === 'asha' && (
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md w-full mb-3 text-center">
            <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
              Frontline ASHA Worker Mobile Interface
            </span>
            <p className="text-xs text-slate-500">
              Interactive smartphone simulator in Marathi & Hindi. Test voice recording, transcription review, and traceable evidence verification.
            </p>
          </div>
          <AshaPhoneSimulator onRecordSubmitted={handleNewRecordSubmitted} />
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
                />
              )}
              {activeTab === 'records' && (
                <VisitRecordsQueueView
                  records={records}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                />
              )}
              {activeTab === 'review_queue' && (
                <VisitRecordsQueueView
                  records={records}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  filterPendingOnly={true}
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
              <span>(Interactive Simulation)</span>
            </div>
            <AshaPhoneSimulator onRecordSubmitted={handleNewRecordSubmitted} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
