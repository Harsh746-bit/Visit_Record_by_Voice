import React from 'react';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Beneficiary } from '../../types';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onClick?: () => void;
  className?: string;
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
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
          <div className="w-11 h-11 rounded-xl bg-[#E6F4F5] text-[#087F8C] flex items-center justify-center font-bold text-sm shrink-0">
            {beneficiary.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#172B3A]">
              {beneficiary.name}
            </h4>
            <p className="text-xs text-[#718096] font-devanagari">
              {beneficiary.nameMr}
            </p>
          </div>
        </div>

        <StatusBadge
          status={beneficiary.highRisk ? 'high_risk' : 'normal'}
          size="sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-[#718096] pt-1 border-t border-[#E5EBEF]">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
          <span className="truncate">{beneficiary.village}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
          <span>{beneficiary.category} • {beneficiary.age} yrs</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#718096] pt-1">
        <span className="font-mono text-[11px] text-slate-500">
          RCH: {beneficiary.rchId}
        </span>
        <span className="text-[#087F8C] font-semibold flex items-center gap-0.5 hover:underline">
          View Profile <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
