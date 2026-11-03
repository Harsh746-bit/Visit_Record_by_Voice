import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger' | 'warning';
  children?: React.ReactNode;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  children,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    primary: {
      icon: CheckCircle2,
      iconBg: 'bg-[#E1F6ED] text-[#15966A]',
      button: 'bg-[#087F8C] hover:bg-[#065A63] text-white'
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-[#FEF3DC] text-[#E8A23A]',
      button: 'bg-[#E8A23A] hover:bg-amber-600 text-white'
    },
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-[#FCE8E8] text-[#DC5B5B]',
      button: 'bg-[#DC5B5B] hover:bg-rose-700 text-white'
    }
  }[variant];

  const IconComponent = variantStyles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-modal p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variantStyles.iconBg}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B3A]">{title}</h3>
              <p className="text-xs text-[#718096] mt-0.5">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children && (
          <div className="py-2">
            {children}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5EBEF]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-[#E5EBEF] text-xs font-semibold text-[#718096] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-2 ${variantStyles.button}`}
          >
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
