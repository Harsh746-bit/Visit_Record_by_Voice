import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  subtitle,
  action,
  className = ''
}) => {
  const text = description || subtitle;
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#E6F4F5] flex items-center justify-center text-[#087F8C] mb-4">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#172B3A] tracking-tight">
        {title}
      </h3>

      {text && (
        <p className="text-xs sm:text-sm text-[#718096] max-w-sm mt-1.5 leading-relaxed">
          {text}
        </p>
      )}

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 px-4 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#065A63] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
