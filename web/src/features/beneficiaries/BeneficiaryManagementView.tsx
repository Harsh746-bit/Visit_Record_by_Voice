import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldAlert, 
  LayoutGrid, 
  Table as TableIcon, 
  Filter, 
  Eye, 
  UserPlus,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import { Beneficiary, StructuredVisit } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { BeneficiaryCard } from '../../components/ui/BeneficiaryCard';
import { EmptyState } from '../../components/ui/EmptyState';

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
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'table' | 'grid'>('table');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const filtered = beneficiaries.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      b.name.toLowerCase().includes(term) ||
      (b.nameMr && b.nameMr.includes(searchTerm)) ||
      b.id.toLowerCase().includes(term) ||
      b.rchId.toLowerCase().includes(term) ||
      b.village.toLowerCase().includes(term);

    const matchesCategory = filterCategory === 'all' || b.category.includes(filterCategory);
    const matchesRisk = filterRisk === 'all' || (filterRisk === 'high' ? b.highRisk : !b.highRisk);

    return matchesSearch && matchesCategory && matchesRisk;
  });

  const highRiskCount = beneficiaries.filter(b => b.highRisk).length;
  const ancCount = beneficiaries.filter(b => b.category.includes('ANC')).length;
  const pncCount = beneficiaries.filter(b => b.category.includes('PNC')).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Maternal Beneficiary Directory"
        subtitle="Tracking antenatal & postnatal mothers across rural PHCs and sub-centres in Maharashtra (RCH Portal Synced)."
        badge={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F5] text-[#087F8C] border border-[#087F8C]/20">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{beneficiaries.length} Registered</span>
            </span>
            {highRiskCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE8E8] text-[#C53030] border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{highRiskCount} High Risk</span>
              </span>
            )}
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#087F8C] text-white text-xs font-bold hover:bg-[#065A63] transition shadow-clinical-card cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Mother</span>
            </button>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5EBEF] shadow-clinical-card">
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
          </div>
        }
      />

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by mother's name, Devanagari name, RCH ID, or village..."
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs py-2.5 px-3 rounded-xl border border-[#E5EBEF] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#087F8C] cursor-pointer shadow-clinical-card"
            >
              <option value="all">All Maternity Stages ({beneficiaries.length})</option>
              <option value="ANC">Antenatal Care (ANC - {ancCount})</option>
              <option value="PNC">Postnatal Care (PNC - {pncCount})</option>
            </select>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="text-xs py-2.5 px-3 rounded-xl border border-[#E5EBEF] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#087F8C] cursor-pointer shadow-clinical-card"
            >
              <option value="all">All Clinical Risk Levels</option>
              <option value="high">High Risk Alert ({highRiskCount})</option>
              <option value="normal">Normal Progression</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5EBEF] text-xs">
          <span className="text-[#718096] flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3 text-[#087F8C]" /> Quick filters:
          </span>
          <button
            onClick={() => { setFilterCategory('all'); setFilterRisk('all'); setSearchTerm(''); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterCategory === 'all' && filterRisk === 'all'
                ? 'bg-[#087F8C] text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Mothers ({beneficiaries.length})
          </button>
          <button
            onClick={() => { setFilterRisk('high'); setFilterCategory('all'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterRisk === 'high'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            High Risk Flags ({highRiskCount})
          </button>
          <button
            onClick={() => { setFilterCategory('ANC'); setFilterRisk('all'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterCategory === 'ANC'
                ? 'bg-[#15966A] text-white font-semibold'
                : 'bg-emerald-50 text-[#15966A] hover:bg-emerald-100'
            }`}
          >
            Antenatal (ANC - {ancCount})
          </button>
          <button
            onClick={() => { setFilterCategory('PNC'); setFilterRisk('all'); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterCategory === 'PNC'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Postnatal (PNC - {pncCount})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="No Beneficiaries Found"
          subtitle="No maternal records matched the selected filters. Try searching for a different name, village, or RCH ID."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSearchTerm('');
              setFilterCategory('all');
              setFilterRisk('all');
            }
          }}
        />
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ben) => {
            const benVisits = records.filter(r => r.beneficiaryId === ben.id);
            return (
              <BeneficiaryCard
                key={ben.id}
                beneficiary={ben}
                onClick={() => {
                  if (benVisits.length > 0) {
                    onSelectRecord(benVisits[0]);
                  }
                }}
              />
            );
          })}
        </div>
      ) : (
        /* Clinical Beneficiary Table */
        <div className="bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8FA] text-[#718096] text-xs uppercase font-semibold border-b border-[#E5EBEF]">
                <tr>
                  <th className="px-5 py-3.5">Mother / RCH Identifier</th>
                  <th className="px-4 py-3.5">Age & Stage</th>
                  <th className="px-4 py-3.5">Gestation & EDD</th>
                  <th className="px-4 py-3.5">Village / Sub-Centre</th>
                  <th className="px-4 py-3.5">Assigned ASHA</th>
                  <th className="px-4 py-3.5">Clinical Risk</th>
                  <th className="px-5 py-3.5 text-right">Voice Encounters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBEF]">
                {filtered.map((ben) => {
                  const benVisits = records.filter(r => r.beneficiaryId === ben.id);
                  return (
                    <tr 
                      key={ben.id} 
                      className="hover:bg-[#F5F8FA]/70 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-xs text-[#172B3A]">
                          {ben.name}
                        </div>
                        <div className="text-xs text-[#718096] font-devanagari">
                          {ben.nameMr}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          RCH: {ben.rchId}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A]">
                        <div className="font-medium">{ben.age} years</div>
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#718096] mt-0.5">
                          {ben.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        {ben.gestationalWeeks ? (
                          <>
                            <div className="font-semibold text-[#172B3A]">
                              {ben.gestationalWeeks} Weeks
                            </div>
                            <div className="text-[11px] text-[#718096] flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-[#087F8C]" />
                              <span>EDD: {ben.eddDate || 'N/A'}</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">PNC Phase</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A]">
                        <div className="font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
                          <span>{ben.village}</span>
                        </div>
                        <div className="text-[11px] text-[#718096] pl-4">
                          {ben.subCenter}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A]">
                        <div className="font-medium">{ben.assignedAshaName}</div>
                        <div className="text-[11px] text-[#718096] flex items-center gap-1 mt-0.5 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{ben.contactPhone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {ben.highRisk ? (
                          <div>
                            <StatusBadge status="high_risk" size="sm" />
                            <div className="text-[10px] font-semibold text-rose-600 mt-1 max-w-[170px] truncate" title={ben.highRiskReasons.join(' • ')}>
                              {ben.highRiskReasons.join(' • ')}
                            </div>
                          </div>
                        ) : (
                          <StatusBadge status="normal" size="sm" />
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {benVisits.length > 0 ? (
                          <button
                            onClick={() => onSelectRecord(benVisits[0])}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-50 text-[#087F8C] hover:bg-[#087F8C] hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{benVisits.length} Encounter{benVisits.length > 1 ? 's' : ''}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Encounters</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Registration Info Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E5EBEF] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5EBEF] pb-3">
              <div className="flex items-center gap-2 text-[#087F8C]">
                <UserPlus className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#172B3A]">Register New Beneficiary</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#718096] leading-relaxed">
              New pregnant mothers and postnatal infants are enrolled directly in the field via the ASHA Android mobile app or synchronized automatically from the Government of India RCH Portal API.
            </p>
            <div className="bg-[#F5F8FA] p-3.5 rounded-xl border border-[#E5EBEF] text-xs space-y-1.5 text-[#172B3A]">
              <div className="font-semibold text-[#087F8C]">Field Registration Instructions:</div>
              <div>1. Open the ASHA Mobile App in Marathi / Hindi.</div>
              <div>2. Tap <strong>नोंदणी (Register)</strong> and scan or enter the 12-digit RCH ID.</div>
              <div>3. Record initial maternal biometric details and voice baseline.</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-[#087F8C] text-white text-xs font-bold hover:bg-[#065A63] transition cursor-pointer"
              >
                Understood (ठीक आहे)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
