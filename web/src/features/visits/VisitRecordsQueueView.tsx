import React, { useState } from 'react';
import { 
  Eye, 
  AlertTriangle, 
  LayoutGrid, 
  Table as TableIcon, 
  ShieldAlert, 
  Filter,
  Activity,
  FileCheck2,
  Clock
} from 'lucide-react';
import { StructuredVisit } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { VisitCard } from '../../components/ui/VisitCard';
import { EmptyState } from '../../components/ui/EmptyState';

interface VisitRecordsQueueViewProps {
  records: StructuredVisit[];
  onSelectRecord: (record: StructuredVisit) => void;
  filterPendingOnly?: boolean;
}

export const VisitRecordsQueueView: React.FC<VisitRecordsQueueViewProps> = ({
  records,
  onSelectRecord,
  filterPendingOnly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(filterPendingOnly ? 'pending' : 'all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [highRiskOnly, setHighRiskOnly] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'table' | 'grid'>('table');

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ashaName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.anmReviewStatus === statusFilter;
    const matchesLanguage = languageFilter === 'all' || r.language === languageFilter;
    
    const hasDangerSign = r.validationWarnings && r.validationWarnings.some(w => w.severity === 'critical');
    const matchesRisk = !highRiskOnly || hasDangerSign;

    return matchesSearch && matchesStatus && matchesLanguage && matchesRisk;
  });

  const pendingCount = records.filter(r => r.anmReviewStatus === 'pending').length;
  const criticalCount = records.filter(r => r.validationWarnings?.some(w => w.severity === 'critical')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={filterPendingOnly ? 'Clinical Review Queue' : 'Spoken Maternal Visit Records'}
        subtitle={
          filterPendingOnly
            ? 'Frontline visits awaiting clinical sign-off, evidence audit, or return for correction.'
            : 'Permanent archive of voice-documented encounters transcribed via Sarvam Saaras v3 with verbatim text spans.'
        }
        badge={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F5] text-[#087F8C] border border-[#087F8C]/20">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingCount} Pending</span>
            </span>
            {criticalCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE8E8] text-[#C53030] border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{criticalCount} High Risk</span>
              </span>
            )}
          </div>
        }
        actions={
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E5EBEF] shadow-clinical-card">
            <button
              onClick={() => setDisplayMode('table')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === 'table'
                  ? 'bg-[#087F8C] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#172B3A] hover:bg-slate-50'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setDisplayMode('grid')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                displayMode === 'grid'
                  ? 'bg-[#087F8C] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#172B3A] hover:bg-slate-50'
              }`}
              title="Grid Cards"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        }
      />

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by mother's name, record ID, or ASHA worker..."
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Selector */}
            {!filterPendingOnly && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-2.5 px-3 rounded-xl border border-[#E5EBEF] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#087F8C] cursor-pointer shadow-clinical-card"
              >
                <option value="all">All Review Statuses ({records.length})</option>
                <option value="pending">Pending Sign-off ({pendingCount})</option>
                <option value="reviewed">Approved Records</option>
                <option value="returned">Returned for Correction</option>
              </select>
            )}

            {/* Language Selector */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="text-xs py-2.5 px-3 rounded-xl border border-[#E5EBEF] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#087F8C] cursor-pointer shadow-clinical-card"
            >
              <option value="all">All Spoken Dialects</option>
              <option value="mr-IN">मराठी (Marathi)</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
            </select>

            {/* High Risk Toggle Button */}
            <button
              onClick={() => setHighRiskOnly(!highRiskOnly)}
              className={`text-xs py-2 px-3 rounded-xl border flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                highRiskOnly
                  ? 'bg-rose-50 border-rose-300 text-[#C53030] shadow-xs'
                  : 'bg-white border-[#E5EBEF] text-[#718096] hover:text-[#172B3A] hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>High Risk Only</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5EBEF] text-xs">
          <span className="text-[#718096] flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3 text-[#087F8C]" /> Quick filters:
          </span>
          <button
            onClick={() => { setStatusFilter('all'); setHighRiskOnly(false); setLanguageFilter('all'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              statusFilter === 'all' && !highRiskOnly && languageFilter === 'all'
                ? 'bg-[#087F8C] text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Encounters ({records.length})
          </button>
          <button
            onClick={() => { setStatusFilter('pending'); setHighRiskOnly(false); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              statusFilter === 'pending' && !highRiskOnly
                ? 'bg-amber-500 text-white font-semibold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Pending Verification ({pendingCount})
          </button>
          <button
            onClick={() => { setHighRiskOnly(true); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              highRiskOnly
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Clinical Danger Signs ({criticalCount})
          </button>
          <button
            onClick={() => { setLanguageFilter('mr-IN'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              languageFilter === 'mr-IN'
                ? 'bg-teal-700 text-white font-semibold'
                : 'bg-teal-50 text-[#087F8C] hover:bg-teal-100'
            }`}
          >
            मराठी रेकॉर्ड्स
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Visit Records Found"
          subtitle="No recorded encounters match your active search terms and filter criteria."
          action={{
            label: 'Clear All Filters',
            onClick: () => {
              setSearchTerm('');
              setStatusFilter('all');
              setLanguageFilter('all');
              setHighRiskOnly(false);
            }
          }}
        />
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((rec) => (
            <VisitCard
              key={rec.recordId}
              record={rec}
              onSelect={() => onSelectRecord(rec)}
            />
          ))}
        </div>
      ) : (
        /* Clinical Data Table */
        <div className="bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8FA] text-[#718096] text-xs uppercase font-semibold border-b border-[#E5EBEF]">
                <tr>
                  <th className="px-5 py-3.5">Record ID</th>
                  <th className="px-4 py-3.5">Beneficiary Mother</th>
                  <th className="px-4 py-3.5">ASHA Field Worker</th>
                  <th className="px-4 py-3.5">Encounter Date</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">Clinical Vitals</th>
                  <th className="px-4 py-3.5">Sign-off Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBEF]">
                {filteredRecords.map((rec) => {
                  const hasDanger = rec.validationWarnings && rec.validationWarnings.some(w => w.severity === 'critical');
                  return (
                    <tr 
                      key={rec.recordId} 
                      onClick={() => onSelectRecord(rec)}
                      className="hover:bg-[#F5F8FA]/70 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold text-[#087F8C]">
                          {rec.recordId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-xs text-[#172B3A] group-hover:text-[#087F8C] transition">
                          {rec.beneficiaryName}
                        </div>
                        <div className="text-[11px] text-[#718096] font-mono">
                          ID: {rec.beneficiaryId}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A] font-medium">
                        {rec.ashaName}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#718096]">
                        {new Date(rec.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-[#172B3A]">
                          {rec.language === 'mr-IN' ? 'मराठी' : 'हिन्दी'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="font-semibold text-[#172B3A] flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#087F8C]" />
                          <span>BP: {rec.measurements.bloodPressureSystolic.value}/{rec.measurements.bloodPressureDiastolic.value} mmHg</span>
                          {hasDanger && (
                            <span title="Critical danger signs flagged">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 animate-bounce" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#718096] mt-0.5">
                          Hb: {rec.measurements.hemoglobinGDl.value} g/dL • {rec.measurements.weightKg.value} kg
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={rec.anmReviewStatus} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(rec);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-50 text-[#087F8C] hover:bg-[#087F8C] hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit Evidence</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
