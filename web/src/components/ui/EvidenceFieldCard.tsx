import React from 'react';
import { AlertTriangle, Edit3, Sparkles } from 'lucide-react';
import { ExtractedField } from '../../types';

interface EvidenceFieldCardProps {
  label: string;
  field: ExtractedField<any>;
  unit?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const EvidenceFieldCard: React.FC<EvidenceFieldCardProps> = ({
  label,
  field,
  unit,
  isSelected = false,
  onSelect,
  onEdit,
  className = ''
}) => {
  const isConcerning = field.status === 'concerning';
  const hasValue = field.value !== null && field.value !== undefined && field.value !== '';

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer space-y-2.5 ${
        isSelected
          ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
          : isConcerning
          ? 'border-rose-200 bg-[#FCE8E8]/30 hover:border-rose-300'
          : 'border-[#E5EBEF] bg-white hover:border-slate-300 shadow-clinical-card'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
            {label}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg sm:text-xl font-bold tracking-tight ${
              hasValue 
                ? (isConcerning ? 'text-[#C53030]' : 'text-[#172B3A]')
                : 'text-slate-400 font-normal italic'
            }`}>
              {hasValue ? String(field.value) : 'Not mentioned in speech'}
            </span>
            {hasValue && unit && (
              <span className="text-xs text-[#718096] font-medium">{unit}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {field.confidence !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-[#E5EBEF] text-[#718096]">
              <Sparkles className="w-3 h-3 text-[#087F8C]" />
              <span>{Math.round(field.confidence * 100)}%</span>
            </span>
          )}

          {isConcerning && (
            <span className="p-1 rounded-md bg-[#FCE8E8] text-[#DC5B5B]" title="Concerning value detected">
              <AlertTriangle className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      {/* Verbatim Source Evidence */}
      {field.supportingPhrase ? (
        <div className="p-2.5 rounded-xl bg-[#F5F8FA] border border-[#E5EBEF] text-xs font-devanagari text-[#172B3A] flex items-start gap-2">
          <span className="text-[10px] uppercase font-bold text-[#087F8C] shrink-0 pt-0.5">पुरावा:</span>
          <span className="italic leading-relaxed">"{field.supportingPhrase}"</span>
        </div>
      ) : (
        <p className="text-[11px] text-[#A0AEC0] italic">
          No verbatim phrase identified • Zero hallucination preserved
        </p>
      )}

      {/* Edit Trigger */}
      {onEdit && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-xs font-semibold text-[#087F8C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>दुरुस्त करा • Edit</span>
          </button>
        </div>
      )}
    </div>
  );
};
