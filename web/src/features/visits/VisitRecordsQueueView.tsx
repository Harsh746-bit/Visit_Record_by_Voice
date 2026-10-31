import React, { useState } from 'react';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import { StructuredVisit } from '../../types';
import { StatusBadge } from '../../components/common/Badge';

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

  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ashaName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.anmReviewStatus === statusFilter;
    const matchesLanguage = languageFilter === 'all' || r.language === languageFilter;

    return matchesSearch && matchesStatus && matchesLanguage;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B3A]">
            {filterPendingOnly ? 'Review Queue (Pending ANM Sign-off)' : 'All Spoken Visit Records'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Frontline voice-documented visits transcribed via Sarvam Saaras v3 with verified evidence spans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search beneficiary, record, ASHA..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#087F8C]"
            />
          </div>

          {!filterPendingOnly && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#087F8C]"
            >
              <option value="all">All Review Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Approved</option>
              <option value="returned">Returned</option>
            </select>
          )}

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#087F8C]"
          >
            <option value="all">All Languages</option>
            <option value="mr-IN">मराठी (Marathi)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#E4ECEC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7FAFA] text-slate-500 text-xs uppercase font-medium border-b border-[#E4ECEC]">
              <tr>
                <th className="px-5 py-3.5">Record ID</th>
                <th className="px-4 py-3.5">Beneficiary</th>
                <th className="px-4 py-3.5">ASHA Worker</th>
                <th className="px-4 py-3.5">Encounter Date</th>
                <th className="px-4 py-3.5">Language</th>
                <th className="px-4 py-3.5">Clinical Vitals</th>
                <th className="px-4 py-3.5">Review Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const hasDanger = rec.validationWarnings.some(w => w.severity === 'critical');
                  return (
                    <tr key={rec.recordId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#087F8C]">
                        {rec.recordId}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-xs text-[#172B3A]">{rec.beneficiaryName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{rec.beneficiaryId}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700">
                        {rec.ashaName}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {new Date(rec.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {rec.language === 'mr-IN' ? 'मराठी' : 'हिन्दी'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          BP: {rec.measurements.bloodPressureSystolic.value}/{rec.measurements.bloodPressureDiastolic.value} mmHg
                          {hasDanger && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
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
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#087F8C] hover:bg-[#087F8C] hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect Record
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs italic">
                    No matching visit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
