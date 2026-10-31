import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { Beneficiary, StructuredVisit } from '../../types';

interface BeneficiaryManagementViewProps {
  beneficiaries: Beneficiary[];
  records: StructuredVisit[];
  onSelectRecord: (record: StructuredVisit) => void;
}

export const BeneficiaryManagementView: React.FC<BeneficiaryManagementViewProps> = ({
  beneficiaries,
  records,
  onSelectRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const filtered = beneficiaries.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.nameMr.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.rchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || b.category.includes(filterCategory);
    const matchesRisk = filterRisk === 'all' || (filterRisk === 'high' ? b.highRisk : !b.highRisk);

    return matchesSearch && matchesCategory && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172B3A]">Beneficiary Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maternal and child healthcare registry for rural sub-centers in Maharashtra.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, RCH ID, village..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#087F8C]"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#087F8C]"
          >
            <option value="all">All Encounters ({beneficiaries.length})</option>
            <option value="ANC">Antenatal (ANC)</option>
            <option value="PNC">Postnatal (PNC)</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#087F8C]"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk Only</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-2xl border border-[#E4ECEC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7FAFA] text-slate-500 text-xs uppercase font-medium border-b border-[#E4ECEC]">
              <tr>
                <th className="px-5 py-3.5">Beneficiary / RCH ID</th>
                <th className="px-4 py-3.5">Age & Category</th>
                <th className="px-4 py-3.5">Gestation & EDD</th>
                <th className="px-4 py-3.5">Village / Sub-Center</th>
                <th className="px-4 py-3.5">Assigned ASHA</th>
                <th className="px-4 py-3.5">Risk Status</th>
                <th className="px-5 py-3.5 text-right">Encounters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ben) => {
                const benVisits = records.filter(r => r.beneficiaryId === ben.id);
                return (
                  <tr key={ben.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-xs text-[#172B3A]">{ben.name}</div>
                      <div className="text-xs text-slate-500 font-devanagari">{ben.nameMr}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{ben.rchId}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      <div>{ben.age} years</div>
                      <div className="text-[11px] text-slate-500">{ben.category}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      {ben.gestationalWeeks ? (
                        <>
                          <div className="font-semibold text-[#172B3A]">{ben.gestationalWeeks} Weeks</div>
                          <div className="text-[11px] text-slate-500">EDD: {ben.eddDate || 'N/A'}</div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">PNC Phase</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <div>{ben.village}</div>
                      <div className="text-[11px] text-slate-400">{ben.subCenter}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      <div>{ben.assignedAshaName}</div>
                      <div className="text-[11px] text-slate-400">{ben.contactPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      {ben.highRisk ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" /> High Risk
                          </span>
                          <div className="text-[10px] text-red-600 mt-0.5 max-w-[150px] truncate" title={ben.highRiskReasons.join(', ')}>
                            {ben.highRiskReasons[0]}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Normal
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {benVisits.length > 0 ? (
                        <button
                          onClick={() => onSelectRecord(benVisits[0])}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-[#087F8C] hover:bg-[#087F8C] hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {benVisits.length} Visit{benVisits.length > 1 ? 's' : ''}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Visits</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
