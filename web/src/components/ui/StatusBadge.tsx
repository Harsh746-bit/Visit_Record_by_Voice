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
    bg: 'bg-slate-200',
    text: 'text-slate-900',
    border: 'border-slate-300',
    dot: 'bg-slate-600',
    defaultLabel: status
  };

  if (normalized === 'pending' || normalized === 'pending_anm_review') {
    config = {
      bg: 'bg-amber-100',
      text: 'text-amber-950',
      border: 'border-amber-400',
      dot: 'bg-amber-600',
      defaultLabel: 'प्रलंबित • Pending'
    };
  } else if (normalized === 'reviewed' || normalized === 'approved' || normalized === 'approved_synced') {
    config = {
      bg: 'bg-emerald-100',
      text: 'text-emerald-950',
      border: 'border-emerald-400',
      dot: 'bg-emerald-600',
      defaultLabel: 'मंजूर • Approved'
    };
  } else if (normalized === 'returned') {
    config = {
      bg: 'bg-rose-100',
      text: 'text-rose-950',
      border: 'border-rose-400',
      dot: 'bg-rose-600',
      defaultLabel: 'पुन्हा तपासणी • Returned'
    };
  } else if (normalized === 'high_risk' || normalized === 'critical' || normalized === 'concerning' || normalized === 'flagged') {
    config = {
      bg: 'bg-rose-100',
      text: 'text-rose-950',
      border: 'border-rose-400',
      dot: 'bg-rose-600 animate-pulse',
      defaultLabel: 'उच्च जोखीम • High Risk'
    };
  } else if (normalized === 'moderate_risk') {
    config = {
      bg: 'bg-amber-100',
      text: 'text-amber-950',
      border: 'border-amber-400',
      dot: 'bg-amber-600',
      defaultLabel: 'मध्यम जोखीम • Moderate'
    };
  } else if (normalized === 'normal' || normalized === 'extracted') {
    config = {
      bg: 'bg-cyan-100',
      text: 'text-cyan-950',
      border: 'border-cyan-400',
      dot: 'bg-cyan-600',
      defaultLabel: 'सामान्य • Normal'
    };
  } else if (normalized === 'sync_pending') {
    config = {
      bg: 'bg-blue-100',
      text: 'text-blue-950',
      border: 'border-blue-400',
      dot: 'bg-blue-600 animate-spin',
      defaultLabel: 'सिंक प्रलंबित • Sync Pending'
    };
  } else if (normalized === 'synced') {
    config = {
      bg: 'bg-emerald-100',
      text: 'text-emerald-950',
      border: 'border-emerald-400',
      dot: 'bg-emerald-600',
      defaultLabel: 'सिंक झाले • Synced'
    };
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-0.5' 
    : 'text-xs sm:text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border-2 ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
