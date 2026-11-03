import React from 'react';
import { 
  Users, 
  Clock, 
  AlertOctagon, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  HeartHandshake,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StructuredVisit, AshaWorker, Beneficiary } from '../../types';
import { MOCK_ACTIVITY_DATA } from '../../data/mockData';

interface OverviewViewProps {
  records: StructuredVisit[];
  workers: AshaWorker[];
  beneficiaries: Beneficiary[];
  onSelectRecord: (record: StructuredVisit) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  records,
  workers,
  beneficiaries,
  onSelectRecord,
  onNavigateTab
}) => {
  const pendingRecords = records.filter(r => r.anmReviewStatus === 'pending');
  const highRiskBeneficiaries = beneficiaries.filter(b => b.highRisk);

  return (
    <div className="space-y-6">
      {/* Top Clinical Banner — Deep Healthcare Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#065A63] via-[#087F8C] to-[#15966A] p-6 text-white shadow-md">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>महाराष्ट्र शासन • सार्वजनिक आरोग्य विभाग (Khed-Shivapur PHC)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              ANM Supervisor Clinical Dashboard
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-teal-100 leading-relaxed font-sans">
              Reviewing voice-documented antenatal & postnatal visits from frontline ASHA workers. 
              Verify Marathi & Hindi transcript evidence, validate clinical indicators, and triage high-risk mothers.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={() => onNavigateTab('review_queue')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#087F8C] shadow-sm transition hover:bg-teal-50 cursor-pointer active:scale-98"
            >
              <span>Review Pending Queue ({pendingRecords.length})</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards — Unified Design System StatCard Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned ASHA Workers"
          value={`${workers.length} Active`}
          subtitle="100% active in field today"
          icon={Users}
          colorScheme="teal"
          onClick={() => onNavigateTab('workers')}
        />
        <StatCard
          title="Registered Beneficiaries"
          value={`${beneficiaries.length} Mothers`}
          subtitle="ANC Trimester 2 & 3 • PNC"
          icon={HeartHandshake}
          colorScheme="green"
          onClick={() => onNavigateTab('beneficiaries')}
        />
        <StatCard
          title="Pending ANM Review"
          value={`${pendingRecords.length} Records`}
          subtitle="Needs clinical sign-off"
          icon={Clock}
          colorScheme="amber"
          onClick={() => onNavigateTab('review_queue')}
        />
        <StatCard
          title="High Risk / Danger Signs"
          value={`${highRiskBeneficiaries.length} Flagged`}
          subtitle="Elevated BP / Severe Anemia"
          icon={AlertOctagon}
          colorScheme="rose"
          onClick={() => onNavigateTab('review_queue')}
        />
      </div>

      {/* Analytics Charts & High Risk Alert Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5EBEF] bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#087F8C]" />
                <h2 className="text-base font-bold text-[#172B3A]">Daily Visit Documentation Volume</h2>
              </div>
              <p className="text-xs text-[#718096]">Spoken Marathi & Hindi voice notes processed into structured records</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#172B3A]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#087F8C]"></span> Total Visits
              </span>
              <span className="flex items-center gap-1.5 text-[#172B3A]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#15966A]"></span> Verified
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#087F8C" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#087F8C" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15966A" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#15966A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E5EBEF', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="visits" stroke="#087F8C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="completed" stroke="#15966A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Urgent High-Risk Pregnancy Alerts */}
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#DC5B5B] mb-1">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="text-base font-bold text-[#172B3A]">Urgent Clinical Triage</h2>
            </div>
            <p className="text-xs text-[#718096] mb-4">
              Flagged by clinical decision rules directly from voice transcript evidence.
            </p>

            <div className="space-y-3">
              {highRiskBeneficiaries.map((ben) => {
                const relatedRecord = records.find(r => r.beneficiaryId === ben.id);
                return (
                  <div 
                    key={ben.id}
                    onClick={() => relatedRecord && onSelectRecord(relatedRecord)}
                    className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 hover:border-red-300 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-red-950">{ben.name} ({ben.gestationalWeeks}w)</span>
                      <StatusBadge status="flagged" label="High Risk" />
                    </div>
                    <p className="text-xs text-slate-700 mt-1 font-medium">
                      {ben.highRiskReasons.join(' • ')}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#DC5B5B] font-semibold mt-2 pt-2 border-t border-red-200/60">
                      <span>ASHA: {ben.assignedAshaName}</span>
                      <span className="inline-flex items-center gap-0.5 group-hover:underline">
                        Review Evidence <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('review_queue')}
            className="w-full mt-4 py-2.5 px-3 text-xs font-semibold rounded-xl bg-slate-100 text-[#172B3A] hover:bg-slate-200 transition text-center cursor-pointer"
          >
            Open Full Clinical Review Queue ({pendingRecords.length})
          </button>
        </div>
      </div>

      {/* Submitted Records Table & ASHA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Submissions */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5EBEF] bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E5EBEF] flex items-center justify-between bg-white">
            <div>
              <h2 className="text-base font-bold text-[#172B3A]">Recent Frontline Visit Submissions</h2>
              <p className="text-xs text-[#718096]">Processed into structured records with verbatim transcript evidence</p>
            </div>
            <button 
              onClick={() => onNavigateTab('records')}
              className="text-xs font-semibold text-[#087F8C] hover:underline cursor-pointer"
            >
              View Full Records ({records.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8FA] text-[#718096] text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Beneficiary</th>
                  <th className="px-4 py-3">ASHA Worker</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Vitals Extracted</th>
                  <th className="px-4 py-3">Review Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBEF]">
                {records.map((rec) => (
                  <tr key={rec.recordId} className="hover:bg-[#F5F8FA]/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-xs text-[#172B3A]">{rec.beneficiaryName}</div>
                      <div className="text-[11px] text-[#718096] font-mono">{rec.recordId}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#172B3A] font-medium">
                      {rec.ashaName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-[#172B3A]">
                        {rec.language === 'mr-IN' ? 'मराठी' : 'हिन्दी'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <div className="font-medium text-[#172B3A]">
                        BP: {rec.measurements.bloodPressureSystolic.value}/{rec.measurements.bloodPressureDiastolic.value} mmHg
                      </div>
                      <div className="text-[11px] text-[#718096]">
                        Hb: {rec.measurements.hemoglobinGDl.value} g/dL • {rec.measurements.weightKg.value} kg
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={rec.anmReviewStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => onSelectRecord(rec)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#087F8C] hover:bg-[#087F8C] hover:text-white transition text-xs font-semibold cursor-pointer active:scale-95"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: ASHA Workers Field Activity */}
        <div className="rounded-2xl border border-[#E5EBEF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#172B3A]">ASHA Field Progress</h2>
              <p className="text-xs text-[#718096]">Sub-center village coverage</p>
            </div>
            <button 
              onClick={() => onNavigateTab('workers')}
              className="text-xs font-semibold text-[#087F8C] hover:underline cursor-pointer"
            >
              All Workers
            </button>
          </div>
          <div className="space-y-3.5">
            {workers.map((worker) => {
              const pct = Math.round((worker.completedToday / (worker.todayVisits || 1)) * 100);
              return (
                <div key={worker.id} className="p-3.5 rounded-xl border border-[#E5EBEF] bg-[#F5F8FA]/50 hover:bg-white transition">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-[#172B3A]">{worker.name}</div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {worker.completedToday}/{worker.todayVisits} Visits
                    </span>
                  </div>
                  <div className="text-xs text-[#718096] mt-0.5">{worker.assignedArea}</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="bg-[#15966A] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
