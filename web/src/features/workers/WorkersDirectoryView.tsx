import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Phone, 
  MapPin, 
  Building, 
  LayoutGrid, 
  Table as TableIcon,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { AshaWorker } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { WorkerCard } from '../../components/ui/WorkerCard';
import { EmptyState } from '../../components/ui/EmptyState';

interface WorkersDirectoryViewProps {
  workers: AshaWorker[];
}

export const WorkersDirectoryView: React.FC<WorkersDirectoryViewProps> = ({ workers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid');

  const filtered = workers.filter(w => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      w.name.toLowerCase().includes(term) ||
      w.id.toLowerCase().includes(term) ||
      w.assignedArea.toLowerCase().includes(term) ||
      w.subCenter.toLowerCase().includes(term);
    
    const matchesDistrict = filterDistrict === 'all' || w.district.toLowerCase() === filterDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  const activeCount = workers.filter(w => w.status === 'active').length;
  const totalCompletedToday = workers.reduce((sum, w) => sum + (w.completedToday || 0), 0);
  const totalTargetToday = workers.reduce((sum, w) => sum + (w.todayVisits || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Frontline ASHA Worker Directory"
        subtitle="Accredited Social Health Activists (ASHAs) conducting voice-documented home encounters across rural sub-centers in Maharashtra."
        badge={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E1F6ED] text-[#0F6E4E] border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5 text-[#15966A]" />
              <span>{activeCount} Active in Field</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F5] text-[#087F8C] border border-[#087F8C]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{totalCompletedToday}/{totalTargetToday} Visits Today</span>
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5EBEF] shadow-clinical-card">
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
          </div>
        }
      />

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by worker name, ASHA ID, assigned area, or sub-center..."
            className="w-full lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="text-xs py-2.5 px-3 rounded-xl border border-[#E5EBEF] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#087F8C] cursor-pointer shadow-clinical-card"
            >
              <option value="all">All Healthcare Districts ({workers.length})</option>
              <option value="pune">Pune District (पुणे जिल्हा)</option>
              <option value="nashik">Nashik District (नाशिक जिल्हा)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5EBEF] text-xs">
          <span className="text-[#718096] flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3 text-[#087F8C]" /> Jurisdiction filters:
          </span>
          <button
            onClick={() => { setFilterDistrict('all'); setSearchTerm(''); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterDistrict === 'all'
                ? 'bg-[#087F8C] text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Workers ({workers.length})
          </button>
          <button
            onClick={() => setFilterDistrict('pune')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterDistrict === 'pune'
                ? 'bg-[#15966A] text-white font-semibold'
                : 'bg-emerald-50 text-[#15966A] hover:bg-emerald-100'
            }`}
          >
            Pune (Khed-Shivapur Circle)
          </button>
          <button
            onClick={() => setFilterDistrict('nashik')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
              filterDistrict === 'nashik'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Nashik (Trimbak Circle)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No ASHA Workers Found"
          subtitle="No frontline health workers matched your search or district filter."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSearchTerm('');
              setFilterDistrict('all');
            }
          }}
        />
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
            />
          ))}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8FA] text-[#718096] text-xs uppercase font-semibold border-b border-[#E5EBEF]">
                <tr>
                  <th className="px-5 py-3.5">ASHA Health Worker</th>
                  <th className="px-4 py-3.5">Sub-Centre / PHC</th>
                  <th className="px-4 py-3.5">Assigned Village Area</th>
                  <th className="px-4 py-3.5">Contact Phone</th>
                  <th className="px-4 py-3.5">Field Status</th>
                  <th className="px-4 py-3.5">Today's Visits</th>
                  <th className="px-5 py-3.5 text-right">Monthly Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EBEF]">
                {filtered.map((worker) => {
                  const pct = Math.round((worker.completedToday / (worker.todayVisits || 1)) * 100);
                  return (
                    <tr key={worker.id} className="hover:bg-[#F5F8FA]/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#E1F6ED] text-[#15966A] flex items-center justify-center font-bold text-xs shrink-0">
                            {worker.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#172B3A]">{worker.name}</div>
                            <div className="text-[11px] text-[#718096] font-mono">{worker.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A]">
                        <div className="font-medium flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
                          <span>{worker.subCenter}</span>
                        </div>
                        <div className="text-[11px] text-[#718096] pl-4">{worker.phc}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A]">
                        <div className="font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
                          <span>{worker.assignedArea}</span>
                        </div>
                        <div className="text-[11px] text-[#718096] pl-4">
                          {worker.district} District
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#172B3A] font-mono">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{worker.phone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E1F6ED] text-[#0F6E4E] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15966A]" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="flex items-center justify-between font-semibold text-[#172B3A] text-xs">
                          <span>{worker.completedToday}/{worker.todayVisits}</span>
                          <span className="text-[11px] text-[#15966A]">{pct}%</span>
                        </div>
                        <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-[#15966A] h-full rounded-full" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-xs text-[#087F8C]">
                        {worker.submittedMonth} records
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
