import React from 'react';
import { 
  Users, 
  FileCheck2, 
  Clock, 
  AlertOctagon, 
  TrendingUp, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight
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
import { StatusBadge } from '../../components/common/Badge';
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
      {/* Top Banner / Healthcare Circle Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-950 via-[#087F8C] to-emerald-800 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full text-xs font-medium tracking-wide mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Primary Health Center — Khed Shivapur Circle, Pune District
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ANM Supervisor Clinical Dashboard</h1>
          <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Reviewing multilingual voice-generated visit records from frontline ASHA workers. Verify clinical evidence, approve verified records, and triage high-risk pregnancies across rural sub-centers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateTab('review_queue')}
            className="px-4 py-2.5 bg-white text-[#087F8C] rounded-xl font-bold text-xs hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
          >
            Review Pending Queue ({pendingRecords.length})
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workers */}
        <div 
          onClick={() => onNavigateTab('workers')}
          className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs flex items-center justify-between cursor-pointer hover:border-teal-300 transition-all"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned ASHA Workers</p>
            <h3 className="text-2xl font-bold text-[#172B3A] mt-1">{workers.length} Active</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% active in field today
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#087F8C]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Beneficiaries */}
        <div 
          onClick={() => onNavigateTab('beneficiaries')}
          className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs flex items-center justify-between cursor-pointer hover:border-teal-300 transition-all"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Beneficiaries</p>
            <h3 className="text-2xl font-bold text-[#172B3A] mt-1">{beneficiaries.length} Mothers</h3>
            <p className="text-xs text-slate-500 mt-1">
              ANC Trimester 2 & 3 • PNC
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#15966A]">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Review */}
        <div 
          onClick={() => onNavigateTab('review_queue')}
          className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending ANM Review</p>
            <h3 className="text-2xl font-bold text-[#E8A23A] mt-1">{pendingRecords.length} Record</h3>
            <p className="text-xs text-amber-700 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Needs clinical sign-off
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#E8A23A]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* High Risk Alerts */}
        <div 
          onClick={() => onNavigateTab('review_queue')}
          className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs flex items-center justify-between cursor-pointer hover:border-red-300 transition-all"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Risk / Danger Signs</p>
            <h3 className="text-2xl font-bold text-[#DC5B5B] mt-1">{highRiskBeneficiaries.length} Flagged</h3>
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Elevated BP / Severe Anemia
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#DC5B5B]">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts & High Risk Alert Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#172B3A]">Daily Visit Documentation Volume</h2>
              <p className="text-xs text-slate-500">Spoken Marathi & Hindi voice notes processed into structured records</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-[#087F8C]"></span> Total Visits
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-[#15966A]"></span> Verified
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#087F8C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#087F8C" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15966A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#15966A" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#087F8C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="completed" stroke="#15966A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Urgent High-Risk Pregnancy Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-base font-bold text-[#172B3A]">Urgent Clinical Triage</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Identified by clinical rule engine directly from spoken transcript evidence.
            </p>

            <div className="space-y-3">
              {highRiskBeneficiaries.map((ben) => {
                const relatedRecord = records.find(r => r.beneficiaryId === ben.id);
                return (
                  <div 
                    key={ben.id}
                    onClick={() => relatedRecord && onSelectRecord(relatedRecord)}
                    className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 hover:border-red-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-red-900">{ben.name} ({ben.gestationalWeeks}w)</span>
                      <StatusBadge status="critical" label="High Risk" />
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      {ben.highRiskReasons.join(' • ')}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-red-600 font-medium mt-2 pt-2 border-t border-red-200/60">
                      <span>ASHA: {ben.assignedAshaName}</span>
                      <span className="inline-flex items-center gap-1 group-hover:underline">
                        Review Evidence <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('review_queue')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-center cursor-pointer"
          >
            Open Full Clinical Review Queue
          </button>
        </div>
      </div>

      {/* Submitted Records Table & ASHA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E4ECEC] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E4ECEC] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#172B3A]">Recent Frontline Visit Submissions</h2>
              <p className="text-xs text-slate-500">Processed into structured records with character-level traceability</p>
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
              <thead className="bg-[#F7FAFA] text-slate-500 text-xs uppercase font-medium">
                <tr>
                  <th className="px-5 py-3">Beneficiary</th>
                  <th className="px-4 py-3">ASHA Worker</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Vitals Extracted</th>
                  <th className="px-4 py-3">Review Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => (
                  <tr key={rec.recordId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-xs text-[#172B3A]">{rec.beneficiaryName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{rec.recordId}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      {rec.ashaName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {rec.language === 'mr-IN' ? 'मराठी (Marathi)' : 'हिन्दी (Hindi)'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <div className="font-medium text-slate-800">
                        BP: {rec.measurements.bloodPressureSystolic.value}/{rec.measurements.bloodPressureDiastolic.value} mmHg
                      </div>
                      <div className="text-slate-500">
                        Hb: {rec.measurements.hemoglobinGDl.value} g/dL • {rec.measurements.weightKg.value} kg
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={rec.anmReviewStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => onSelectRecord(rec)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#087F8C] hover:bg-[#087F8C] hover:text-white transition-all text-xs font-semibold cursor-pointer"
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
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#172B3A]">ASHA Worker Field Status</h2>
            <button 
              onClick={() => onNavigateTab('workers')}
              className="text-xs font-semibold text-[#087F8C] hover:underline cursor-pointer"
            >
              All Workers
            </button>
          </div>
          <div className="space-y-4">
            {workers.map((worker) => (
              <div key={worker.id} className="p-3.5 rounded-xl border border-slate-100 bg-[#F7FAFA]">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-[#172B3A]">{worker.name}</div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    {worker.completedToday}/{worker.todayVisits} Visits
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{worker.assignedArea}</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-[#15966A] h-full rounded-full"
                    style={{ width: `${(worker.completedToday / worker.todayVisits) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
