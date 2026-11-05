import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Users,
  BarChart3,
  Settings,
  Smartphone,
  Clock,
  HeartHandshake,
  Menu,
  X,
  ChevronRight
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

const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',       labelMr: 'आढावा',          icon: LayoutDashboard },
  { id: 'review_queue', label: 'Review Queue',    labelMr: 'पुनरावलोकन',    icon: Clock,         badge: true },
  { id: 'records',      label: 'All Records',     labelMr: 'नोंदी',          icon: FileCheck2,    count: true },
  { id: 'beneficiaries',label: 'Beneficiaries',   labelMr: 'लाभार्थी',      icon: HeartHandshake },
  { id: 'workers',      label: 'ASHA Workers',    labelMr: 'आशा सेविका',    icon: Users },
  { id: 'reports',      label: 'Reports',         labelMr: 'अहवाल',         icon: BarChart3 },
  { id: 'settings',     label: 'Settings',        labelMr: 'सेटिंग्ज',      icon: Settings },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  viewMode, onChangeViewMode, activeTab, onChangeTab,
  pendingCount, recordsCount, lang, onChangeLang, children
}) => {
  const t = translations[lang] || translations.en;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeTab(item.id as AnmNavigationTab);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-cyan-700 text-white shadow-brand ring-2 ring-cyan-300'
                  : 'text-slate-900 hover:bg-slate-100 hover:text-cyan-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-cyan-700'}`} />
                <div className="text-left">
                  <div className={`text-sm font-black leading-tight ${isActive ? 'text-white' : 'text-slate-950'}`}>{item.label}</div>
                  <div className={`text-xs font-devanagari font-bold leading-tight mt-0.5 ${isActive ? 'text-cyan-100' : 'text-slate-700'}`}>{item.labelMr}</div>
                </div>
              </div>
              {item.badge && pendingCount > 0 && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-black shrink-0 ${
                  isActive ? 'bg-white text-cyan-900' : 'bg-amber-200 text-amber-950 border border-amber-300'
                }`}>
                  {pendingCount}
                </span>
              )}
              {item.count && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-black shrink-0 ${
                  isActive ? 'bg-white text-cyan-900' : 'bg-slate-200 text-slate-900'
                }`}>
                  {recordsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile workflow callout */}
      <div className="mx-3 mb-4 p-4 rounded-2xl bg-cyan-50 border-2 border-cyan-300">
        <div className="flex items-center gap-2 font-black text-cyan-900 text-xs sm:text-sm mb-1.5">
          <Smartphone className="w-4 h-4 text-cyan-700" />
          <span>Test ASHA Workflow</span>
        </div>
        <p className="text-xs text-slate-800 font-bold leading-relaxed mb-3">
          Record a Marathi/Hindi visit as an ASHA worker in the full 5-screen flow.
        </p>
        <button
          onClick={() => { onChangeViewMode('dual'); setMobileSidebarOpen(false); }}
          className="w-full py-2.5 px-3 rounded-xl bg-cyan-700 text-white text-xs font-black hover:bg-cyan-800 transition-colors cursor-pointer shadow-sm"
        >
          Open Dual-View Demo →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Fixed top header */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        lang={lang}
        onChangeLang={onChangeLang}
        pendingCount={pendingCount}
        onToggleMobileSidebar={() => setMobileSidebarOpen(v => !v)}
      />

      <div className="flex flex-1 pt-24 sm:pt-16"> {/* offset for fixed header */}

        {/* ── DESKTOP FIXED SIDEBAR (ANM only) ── */}
        {viewMode === 'anm' && (
          <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-56 xl:w-60 bg-white border-r border-slate-200 z-30">
            <SidebarContent />
          </aside>
        )}

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {viewMode === 'anm' && mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-clinical-modal md:hidden sidebar-transition">
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
                <span className="font-bold text-sm text-slate-900">Navigation</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="h-full overflow-y-auto">
                <SidebarContent />
              </div>
            </aside>
          </>
        )}

        {/* ── MAIN CONTENT ── */}
        <main
          className={`flex-1 min-w-0 w-full ${
            viewMode === 'anm' ? 'md:pl-56 xl:pl-60' : ''
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
