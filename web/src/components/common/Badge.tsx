import React from 'react';
import { ExtractionStatus, ReviewStatus, ValidationSeverity } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, Clock, ShieldCheck, ArrowDownLeft } from 'lucide-react';

interface StatusBadgeProps {
  status: ExtractionStatus | ReviewStatus | ValidationSeverity | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';
  
  switch (status) {
    case 'extracted':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-[#15966A]/10 text-[#15966A] font-medium border border-[#15966A]/20 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {label || 'Extracted'}
        </span>
      );
    case 'concerning':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-[#DC5B5B]/10 text-[#DC5B5B] font-medium border border-[#DC5B5B]/20 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          {label || 'Concerning'}
        </span>
      );
    case 'missing':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-500 font-medium border border-slate-200 ${sizeClasses}`}>
          <HelpCircle className="w-3.5 h-3.5" />
          {label || 'Not Mentioned'}
        </span>
      );
    case 'ambiguous':
    case 'requires_verification':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-[#E8A23A]/10 text-[#E8A23A] font-medium border border-[#E8A23A]/20 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          {label || 'Verify'}
        </span>
      );
    case 'reviewed':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 ${sizeClasses}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          {label || 'ANM Approved'}
        </span>
      );
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          {label || 'Pending Review'}
        </span>
      );
    case 'returned':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200 ${sizeClasses}`}>
          <ArrowDownLeft className="w-3.5 h-3.5" />
          {label || 'Returned'}
        </span>
      );
    case 'critical':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 font-semibold border border-red-200 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          {label || 'Danger Sign'}
        </span>
      );
    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 font-medium border border-amber-200 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          {label || 'Clinical Warning'}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          {label || status}
        </span>
      );
  }
};
