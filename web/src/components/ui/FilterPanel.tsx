import React from 'react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterGroupProps {
  label?: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-[#718096] mr-1">
          {label}:
        </span>
      )}
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#087F8C] text-white shadow-xs'
                : 'bg-white border border-[#E5EBEF] text-[#718096] hover:text-[#172B3A] hover:bg-slate-50'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#718096]'
              }`}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
