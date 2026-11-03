import React from 'react';
import { Activity, Clock, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { StructuredVisit } from '../../types';

interface VisitCardProps {
  record: StructuredVisit;
  onSelect?: () => void;
  className?: string;
}

export const VisitCard: React.FC<VisitCardProps> = ({
  record,
  onSelect,
  className = ''
}) => {
  const isHighRisk = record.anmReviewStatus === 'pending' && 
    (record.measurements.bloodPressureSystolic.value ? record.measurements.bloodPressureSystolic.value >= 140 : false);

  return (
    <div
      onClick={onSelect}
      className={`bg-white p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card hover:shadow-clinical-hover hover:border-[#087F8C] transition-all duration-200 cursor-pointer space-y-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-bold text-[#087F8C]">
            {record.recordId}
          </span>
          <h4 className="font-bold text-base text-[#172B3A] mt-0.5">
            {record.beneficiaryName}
          </h4>
          <p className="text-xs text-[#718096]">
            ASHA: {record.ashaName}
          </p>
        </div>

        <StatusBadge
          status={record.anmReviewStatus}
          size="sm"
        />
      </div>

      {/* Vitals Summary Pill Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5EBEF]">
        {record.measurements.bloodPressureSystolic.value && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${
            isHighRisk 
              ? 'bg-[#FCE8E8] text-[#C53030] border border-rose-200' 
              : 'bg-[#F5F8FA] text-[#172B3A] border border-[#E5EBEF]'
          }`}>
            <Activity className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>BP: {record.measurements.bloodPressureSystolic.value}/{record.measurements.bloodPressureDiastolic.value}</span>
          </span>
        )}

        {record.measurements.weightKg.value && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-[#F5F8FA] text-[#172B3A] border border-[#E5EBEF]">
            <span>वजन: {record.measurements.weightKg.value} kg</span>
          </span>
        )}

        {record.measurements.hemoglobinGDl.value && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-[#F5F8FA] text-[#172B3A] border border-[#E5EBEF]">
            <span>Hb: {record.measurements.hemoglobinGDl.value} g/dL</span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[#718096] pt-1">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {new Date(record.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
        <span className="text-[#087F8C] font-semibold flex items-center gap-0.5 hover:underline">
          Review Record <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
