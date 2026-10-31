import React, { useState } from 'react';
import { Search, Phone, MapPin, Building, UserCheck } from 'lucide-react';
import { AshaWorker } from '../../types';

interface WorkersDirectoryViewProps {
  workers: AshaWorker[];
}

export const WorkersDirectoryView: React.FC<WorkersDirectoryViewProps> = ({ workers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');

  const filtered = workers.filter(w => {
    const matchesSearch = 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assignedArea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = filterDistrict === 'all' || w.district.toLowerCase() === filterDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172B3A]">ASHA Workers Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Frontline community health workers conducting voice-documented home encounters across Pune & Nashik sub-centers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by worker name, ID, area..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#087F8C]"
            />
          </div>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#087F8C]"
          >
            <option value="all">All Districts ({workers.length})</option>
            <option value="pune">Pune District</option>
            <option value="nashik">Nashik District</option>
          </select>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((worker) => (
          <div key={worker.id} className="bg-white rounded-2xl border border-[#E4ECEC] p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-teal-300 transition-all">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#087F8C] font-bold flex items-center justify-center text-sm shadow-2xs">
                  {worker.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Active in Field
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-base text-[#172B3A]">{worker.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{worker.id}</span>
              </div>

              <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{worker.subCenter} ({worker.phc})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{worker.assignedArea}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{worker.phone}</span>
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="bg-[#F7FAFA] p-3.5 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Today's Visits:</span>
                <span className="font-bold text-[#172B3A]">{worker.completedToday} / {worker.todayVisits} Completed</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#15966A] h-full rounded-full transition-all" 
                  style={{ width: `${(worker.completedToday / worker.todayVisits) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Pending drafts: <strong>{worker.pendingDrafts}</strong></span>
                <span>Monthly records: <strong>{worker.submittedMonth}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
