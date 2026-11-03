import React from 'react';

export type StatusType = 
  | 'pending'
  | 'reviewed'
  | 'approved'
  | 'returned'
  | 'high_risk'
  | 'moderate_risk'
  | 'normal'
  | 'sync_pending'
  | 'synced';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = ''
}) => {
  const normalized = status.toLowerCase().replace('-', '_');

  let config = {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    defaultLabel: status
  };

  if (normalized === 'pending' || normalized === 'pending_anm_review') {
    config = {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'प्रलंबित • Pending Review'
    };
  } else if (normalized === 'reviewed' || normalized === 'approved' || normalized === 'approved_synced') {
    config = {
      bg: 'bg-[#E1F6ED]',
      text: 'text-[#0F6E4E]',
      border: 'border-emerald-200',
      dot: 'bg-[#15966A]',
      defaultLabel: 'मंजूर • Approved'
    };
  } else if (normalized === 'returned') {
    config = {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'पुन्हा तपासणी • Returned'
    };
  } else if (normalized === 'high_risk' || normalized === 'critical' || normalized === 'concerning') {
    config = {
      bg: 'bg-[#FCE8E8]',
      text: 'text-[#C53030]',
      border: 'border-rose-300',
      dot: 'bg-[#DC5B5B] animate-pulse',
      defaultLabel: 'उच्च जोखीम • High Risk'
    };
  } else if (normalized === 'moderate_risk') {
    config = {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'मध्यम जोखीम • Moderate Risk'
    };
  } else if (normalized === 'normal') {
    config = {
      bg: 'bg-teal-50',
      text: 'text-[#087F8C]',
      border: 'border-teal-200',
      dot: 'bg-[#087F8C]',
      defaultLabel: 'सामान्य • Normal'
    };
  } else if (normalized === 'sync_pending') {
    config = {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500 animate-spin',
      defaultLabel: 'सिंक प्रलंबित • Sync Pending'
    };
  } else if (normalized === 'synced') {
    config = {
      bg: 'bg-[#E1F6ED]',
      text: 'text-[#0F6E4E]',
      border: 'border-emerald-200',
      dot: 'bg-[#15966A]',
      defaultLabel: 'सिंक झाले • Synced'
    };
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
