import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { AshaWorker } from '../../types';

interface WorkerCardProps {
  worker: AshaWorker;
  onClick?: () => void;
  className?: string;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card hover:shadow-clinical-hover hover:border-[#087F8C] transition-all duration-200 cursor-pointer space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E1F6ED] text-[#15966A] flex items-center justify-center font-bold text-sm shrink-0">
            {worker.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#172B3A]">
              {worker.name}
            </h4>
            <p className="text-xs text-[#718096]">
              {worker.role}
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
          worker.status === 'active' 
            ? 'bg-[#E1F6ED] text-[#0F6E4E] border-emerald-200' 
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${worker.status === 'active' ? 'bg-[#15966A]' : 'bg-slate-400'}`} />
          <span>{worker.status === 'active' ? 'सक्रिय • Active' : 'Inactive'}</span>
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-[#718096] pt-1 border-t border-[#E5EBEF]">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
          <span>{worker.subCenter} ({worker.villageCovered ? worker.villageCovered.join(', ') : worker.assignedArea})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
          <span className="font-mono">{worker.phone}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5EBEF] text-center">
        <div className="bg-[#F5F8FA] p-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-[#718096]">Today's Visits</span>
          <p className="text-base font-bold text-[#087F8C]">{worker.todayVisits}</p>
        </div>
        <div className="bg-[#F5F8FA] p-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-[#718096]">Completed</span>
          <p className="text-base font-bold text-[#15966A]">{worker.completedToday}</p>
        </div>
      </div>
    </div>
  );
};
