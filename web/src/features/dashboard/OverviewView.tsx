import React from 'react';
import { 
  Users, 
  Clock, 
  AlertOctagon, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  HeartHandshake,
  Activity,
  Mic,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { StructuredVisit, AshaWorker, Beneficiary } from '../../types';
import { translations } from '../../i18n/translations';

interface OverviewViewProps {
  records: StructuredVisit[];
  workers: AshaWorker[];
  beneficiaries: Beneficiary[];
  onSelectRecord: (record: StructuredVisit) => void;
  onNavigateTab: (tab: any) => void;
  lang?: 'mr' | 'hi' | 'en';
}

interface DailyDocumentationMetric {
  day: string;
  dayLabel: string;
  marathiVoice: number;
  hindiVoice: number;
  totalVisits: number;
  verified: number;
  flaggedRisk: number;
  avgDurationSec: number;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  records,
  workers,
  beneficiaries,
  onSelectRecord,
  onNavigateTab,
  lang = 'mr'
}) => {
  const t = translations[lang];
  const pendingRecords = records.filter(r => r.anmReviewStatus === 'pending');
  const highRiskBeneficiaries = beneficiaries.filter(b => b.highRisk);

  // Multilingual labels for 7 days
  const DAY_LABELS: Record<'mr' | 'hi' | 'en', string[]> = {
    mr: ['सोम', 'मंगळ', 'बुध', 'गुरू', 'शुक्र', 'शनि', 'रवि'],
    hi: ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'],
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const chartData: DailyDocumentationMetric[] = [
    { day: 'Mon', dayLabel: DAY_LABELS[lang][0], marathiVoice: 8,  hindiVoice: 4, totalVisits: 12, verified: 11, flaggedRisk: 2, avgDurationSec: 39 },
    { day: 'Tue', dayLabel: DAY_LABELS[lang][1], marathiVoice: 11, hindiVoice: 4, totalVisits: 15, verified: 14, flaggedRisk: 1, avgDurationSec: 42 },
    { day: 'Wed', dayLabel: DAY_LABELS[lang][2], marathiVoice: 12, hindiVoice: 6, totalVisits: 18, verified: 16, flaggedRisk: 3, avgDurationSec: 45 },
    { day: 'Thu', dayLabel: DAY_LABELS[lang][3], marathiVoice: 9,  hindiVoice: 5, totalVisits: 14, verified: 13, flaggedRisk: 1, avgDurationSec: 36 },
    { day: 'Fri', dayLabel: DAY_LABELS[lang][4], marathiVoice: 14, hindiVoice: 6, totalVisits: 20, verified: 19, flaggedRisk: 4, avgDurationSec: 44 },
    { day: 'Sat', dayLabel: DAY_LABELS[lang][5], marathiVoice: 11, hindiVoice: 5, totalVisits: 16, verified: 15, flaggedRisk: 2, avgDurationSec: 38 },
    { day: 'Sun', dayLabel: DAY_LABELS[lang][6], marathiVoice: 5,  hindiVoice: 3, totalVisits: 8,  verified: 8,  flaggedRisk: 0, avgDurationSec: 31 },
  ];

  const totalEncounters = chartData.reduce((acc, d) => acc + d.totalVisits, 0);
  const totalMarathi = chartData.reduce((acc, d) => acc + d.marathiVoice, 0);
  const totalHindi = chartData.reduce((acc, d) => acc + d.hindiVoice, 0);
  const totalVerified = chartData.reduce((acc, d) => acc + d.verified, 0);
  const conversionRate = Math.round((totalVerified / totalEncounters) * 100);

  // Custom high-contrast tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DailyDocumentationMetric;
      return (
        <div className="bg-slate-950 text-white p-4 rounded-xl shadow-2xl border-2 border-slate-600 text-xs sm:text-sm font-sans space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 font-black text-cyan-300">
            <span>{data.dayLabel} ({data.day})</span>
            <span className="text-white text-xs">{data.totalVisits} {lang === 'en' ? 'Total Visits' : 'एकूण भेटी'}</span>
          </div>
          <div className="space-y-1.5 font-bold">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                {t.graphMarathiVoice}:
              </span>
              <span className="font-mono font-black">{data.marathiVoice}</span>
            </div>
            <div className="flex items-center justify-between text-amber-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                {t.graphHindiVoice}:
              </span>
              <span className="font-mono font-black">{data.hindiVoice}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400 pt-1 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                {t.graphVerified}:
              </span>
              <span className="font-mono font-black">{data.verified}</span>
            </div>
            {data.flaggedRisk > 0 && (
              <div className="flex items-center justify-between text-rose-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  {t.dangerSigns}:
                </span>
                <span className="font-mono font-black">{data.flaggedRisk}</span>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
            {lang === 'en' ? 'Avg Audio' : 'सरासरी ऑडिओ'}: {data.avgDurationSec}s
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top Clinical Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C4A6E] via-[#0284C7] to-[#047857] p-6 sm:p-8 text-white shadow-brand-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs sm:text-sm font-bold backdrop-blur-md border border-white/30 text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>महाराष्ट्र शासन • सार्वजनिक आरोग्य विभाग ({t.khedCircle})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              {t.anmSupervisorDashboard}
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-cyan-50 font-medium leading-relaxed font-devanagari">
              {t.anmSupervisorSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={() => onNavigateTab('review_queue')}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-cyan-950 shadow-md transition hover:bg-cyan-50 cursor-pointer active:scale-95 border border-white"
            >
              <span>{t.reviewPendingQueue} ({pendingRecords.length})</span>
              <ArrowUpRight className="h-5 w-5 text-cyan-700" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.assignedAshaWorkers}
          value={`${workers.length} Active`}
          subtitle={t.activeInFieldToday}
          icon={Users}
          colorScheme="teal"
          onClick={() => onNavigateTab('workers')}
        />
        <StatCard
          title={t.registeredBeneficiaries}
          value={`${beneficiaries.length} Mothers`}
          subtitle="ANC Trimester 2 & 3 • PNC"
          icon={HeartHandshake}
          colorScheme="green"
          onClick={() => onNavigateTab('beneficiaries')}
        />
        <StatCard
          title={t.pendingReview}
          value={`${pendingRecords.length} Records`}
          subtitle={t.draftsAwaiting}
          icon={Clock}
          colorScheme="amber"
          onClick={() => onNavigateTab('review_queue')}
        />
        <StatCard
          title={t.highRiskAlerts}
          value={`${highRiskBeneficiaries.length} Flagged`}
          subtitle="Elevated BP / Severe Anemia"
          icon={AlertOctagon}
          colorScheme="rose"
          onClick={() => onNavigateTab('review_queue')}
        />
      </div>

      {/* Analytics Charts & High Risk Alert Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enhanced Daily Activity & Language Volume Chart */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-slate-300 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            {/* Chart Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-cyan-700" />
                  <h2 className="text-base sm:text-lg font-black text-slate-950">
                    {t.graphTitle}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                  {t.graphSubtitle}
                </p>
              </div>

              {/* Badges / Metrics Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-950 font-black text-xs border border-cyan-300">
                  <Mic className="w-3.5 h-3.5 text-cyan-700" />
                  <span>{totalEncounters} {lang === 'en' ? 'Voice Notes' : 'आवाज नोंदी'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{conversionRate}% {t.graphVerified}</span>
                </span>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 p-3 rounded-xl bg-slate-50 border-2 border-slate-200">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-bold text-slate-600 block">{t.graphMarathiVoice}</span>
                <span className="text-sm sm:text-base font-black text-cyan-800">{totalMarathi} ({Math.round(totalMarathi/totalEncounters*100)}%)</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-bold text-slate-600 block">{t.graphHindiVoice}</span>
                <span className="text-sm sm:text-base font-black text-amber-700">{totalHindi} ({Math.round(totalHindi/totalEncounters*100)}%)</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-bold text-slate-600 block">{t.graphVerified}</span>
                <span className="text-sm sm:text-base font-black text-emerald-700">{totalVerified} Records</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-bold text-slate-600 block">{t.graphTimePill}</span>
                <span className="text-sm sm:text-base font-black text-slate-900 font-mono">~39s / Note</span>
              </div>
            </div>

            {/* Visual Composed Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
                  <XAxis 
                    dataKey="dayLabel" 
                    stroke="#1E293B" 
                    fontSize={13} 
                    fontWeight="bold" 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#1E293B" 
                    fontSize={13} 
                    fontWeight="bold" 
                    tickLine={false} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  
                  {/* Stacked Bars for Spoken Audio Languages */}
                  <Bar 
                    dataKey="marathiVoice" 
                    name={t.graphMarathiVoice} 
                    stackId="audio" 
                    fill="#0284C7" 
                    radius={[0, 0, 4, 4]} 
                  />
                  <Bar 
                    dataKey="hindiVoice" 
                    name={t.graphHindiVoice} 
                    stackId="audio" 
                    fill="#F59E0B" 
                    radius={[6, 6, 0, 0]} 
                  />

                  {/* Verified Structured Records Conversion Line */}
                  <Line 
                    type="monotone" 
                    dataKey="verified" 
                    name={t.graphVerified} 
                    stroke="#059669" 
                    strokeWidth={3.5} 
                    dot={{ fill: '#059669', strokeWidth: 2, r: 5 }} 
                    activeDot={{ r: 8 }}
                  />

                  {/* Danger Signs Flagged Line */}
                  <Line 
                    type="monotone" 
                    dataKey="flaggedRisk" 
                    name={t.dangerSigns} 
                    stroke="#E11D48" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    dot={{ fill: '#E11D48', strokeWidth: 2, r: 4 }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-700"></span>
              Sarvam Saaras v3 ASR: 16 kHz Mono PCM
            </span>
            <span>Auto-synced with Khed-Shivapur Circle PHC Database</span>
          </div>
        </div>

        {/* Right 1 Col: Urgent High-Risk Pregnancy Alerts */}
        <div className="rounded-2xl border-2 border-rose-300 bg-white p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-800 mb-1">
              <ShieldAlert className="h-6 w-6 text-rose-700" />
              <h2 className="text-base sm:text-lg font-black text-slate-950">{t.urgentClinicalTriage}</h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mb-4">
              {t.urgentTriageSubtitle}
            </p>

            <div className="space-y-3">
              {highRiskBeneficiaries.map((ben) => {
                const relatedRecord = records.find(r => r.beneficiaryId === ben.id);
                return (
                  <div 
                    key={ben.id}
                    onClick={() => relatedRecord && onSelectRecord(relatedRecord)}
                    className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 hover:border-rose-500 transition cursor-pointer group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-rose-950">{ben.name} ({ben.gestationalWeeks}w)</span>
                      <StatusBadge status="high_risk" label={t.highRisk} size="sm" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-900 mt-1 font-bold">
                      {ben.highRiskReasons.join(' • ')}
                    </p>
                    <div className="flex items-center justify-between text-xs text-rose-900 font-extrabold mt-2 pt-2 border-t border-rose-200">
                      <span>ASHA: {ben.assignedAshaName}</span>
                      <span className="inline-flex items-center gap-0.5 group-hover:underline">
                        {t.evidenceReview} <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('review_queue')}
            className="w-full mt-4 py-3 px-3 text-xs sm:text-sm font-black rounded-xl bg-slate-200 text-slate-950 hover:bg-slate-300 transition text-center cursor-pointer border border-slate-300"
          >
            {t.reviewPendingQueue} ({pendingRecords.length})
          </button>
        </div>
      </div>

      {/* Submitted Records Table & ASHA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Submissions */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-slate-300 bg-white shadow-md overflow-hidden">
          <div className="p-5 border-b-2 border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950">{t.recentSubmissions}</h2>
              <p className="text-xs sm:text-sm font-bold text-slate-700">{t.recentSubmissionsSubtitle}</p>
            </div>
            <button 
              onClick={() => onNavigateTab('records')}
              className="text-xs sm:text-sm font-black text-cyan-800 hover:underline cursor-pointer bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-300"
            >
              {t.viewAll} ({records.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-950 font-black uppercase border-b-2 border-slate-300">
                <tr>
                  <th className="px-5 py-3.5">{t.beneficiaries}</th>
                  <th className="px-4 py-3.5">{t.workers}</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">{t.aiStructuredRecord}</th>
                  <th className="px-4 py-3.5">{t.statusHeader}</th>
                  <th className="px-5 py-3.5 text-right">{t.actionHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {records.map((rec) => (
                  <tr key={rec.recordId} className="hover:bg-slate-100/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-950">{rec.beneficiaryName}</div>
                      <div className="text-xs text-slate-700 font-mono font-bold">{rec.recordId}</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-950">
                      {rec.ashaName}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-slate-200 text-slate-900 border border-slate-300">
                        {rec.language === 'hi-IN' ? 'हिन्दी' : 'मराठी'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-black text-slate-950">
                        BP: {rec.measurements.bloodPressureSystolic.value}/{rec.measurements.bloodPressureDiastolic.value} mmHg
                      </div>
                      <div className="text-xs text-slate-700 font-bold">
                        Hb: {rec.measurements.hemoglobinGDl.value} g/dL • {rec.measurements.weightKg.value} kg
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={rec.anmReviewStatus} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => onSelectRecord(rec)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-100 text-cyan-900 hover:bg-cyan-700 hover:text-white transition font-black cursor-pointer border border-cyan-300"
                      >
                        {t.inspect}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: ASHA Workers Field Activity */}
        <div className="rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950">{t.ashaFieldProgress}</h2>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Sub-center village coverage</p>
            </div>
            <button 
              onClick={() => onNavigateTab('workers')}
              className="text-xs sm:text-sm font-black text-cyan-800 hover:underline cursor-pointer"
            >
              {t.viewAll}
            </button>
          </div>
          <div className="space-y-4">
            {workers.map((worker) => {
              const pct = Math.round((worker.completedToday / (worker.todayVisits || 1)) * 100);
              return (
                <div key={worker.id} className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-white transition shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-sm text-slate-950">{worker.name}</div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black border border-emerald-300">
                      {worker.completedToday}/{worker.todayVisits} Visits
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-bold mt-1">{worker.assignedArea}</div>
                  <div className="w-full bg-slate-300 h-2.5 rounded-full mt-3 overflow-hidden border border-slate-300">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
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
