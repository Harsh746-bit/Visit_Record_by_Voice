import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Users, 
  BarChart3, 
  Settings, 
  Smartphone, 
  Clock, 
  HeartHandshake
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { ViewMode, AnmNavigationTab } from '../types';
import { translations } from '../i18n/translations';

interface DashboardLayoutProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  activeTab: AnmNavigationTab;
  onChangeTab: (tab: AnmNavigationTab) => void;
  pendingCount: number;
  recordsCount: number;
  lang: 'mr' | 'hi' | 'en';
  onChangeLang: (lang: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  viewMode,
  onChangeViewMode,
  activeTab,
  onChangeTab,
  pendingCount,
  recordsCount,
  lang,
  onChangeLang,
  children
}) => {
  const t = translations[lang] || translations.en;

  return (
    <div className="min-h-screen bg-[#F7FAFA] flex flex-col text-[#172B3A]">
      {/* Top Navbar */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        lang={lang}
        onChangeLang={onChangeLang}
      />

      {/* Main App Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {viewMode === 'anm' ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 space-y-3">
              <nav className="bg-white rounded-2xl border border-[#E4ECEC] p-3 shadow-xs space-y-1">
                <button
                  onClick={() => onChangeTab('overview')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t.overview}</span>
                </button>

                <button
                  onClick={() => onChangeTab('review_queue')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'review_queue'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{t.reviewQueue}</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onChangeTab('records')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'records'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t.records}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === 'records' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {recordsCount}
                  </span>
                </button>

                <button
                  onClick={() => onChangeTab('beneficiaries')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'beneficiaries'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{t.beneficiaries}</span>
                </button>

                <button
                  onClick={() => onChangeTab('workers')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'workers'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{t.workers}</span>
                </button>

                <button
                  onClick={() => onChangeTab('reports')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{t.reports}</span>
                </button>

                <button
                  onClick={() => onChangeTab('settings')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#087F8C] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>{t.settings}</span>
                </button>
              </nav>

              {/* Quick switch helper callout */}
              <div className="bg-teal-50/70 border border-teal-200/60 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-[#087F8C] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Test Mobile Workflow</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Want to record a visit as an ASHA worker in Marathi? Switch to <strong>ASHA Mobile</strong> or <strong>Dual-View</strong> in the top bar.
                </p>
                <button
                  onClick={() => onChangeViewMode('dual')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#087F8C] text-white text-[11px] font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  Open Side-by-Side Dual View
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        ) : (
          <main className="w-full">
            {children}
          </main>
        )}
      </div>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-[#E4ECEC] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span><strong>Visit Record by Voice</strong> • Open-Innovation Frontline Healthcare Technology (Maharashtra, India)</span>
          <span className="font-devanagari">AI generates the record, evidence explains the record, and the healthcare worker makes the final decision.</span>
        </div>
      </footer>
    </div>
  );
};
