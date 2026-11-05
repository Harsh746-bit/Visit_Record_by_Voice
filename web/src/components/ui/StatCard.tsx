import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    text: string;
    positive?: boolean;
  };
  colorScheme?: 'teal' | 'green' | 'amber' | 'rose' | 'slate';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'teal',
  onClick,
  className = ''
}) => {
  const schemeStyles = {
    teal: {
      iconBg: 'bg-cyan-100 text-cyan-900 border border-cyan-300',
      borderHover: 'hover:border-cyan-600'
    },
    green: {
      iconBg: 'bg-emerald-100 text-emerald-950 border border-emerald-300',
      borderHover: 'hover:border-emerald-600'
    },
    amber: {
      iconBg: 'bg-amber-100 text-amber-950 border border-amber-300',
      borderHover: 'hover:border-amber-600'
    },
    rose: {
      iconBg: 'bg-rose-100 text-rose-950 border border-rose-300',
      borderHover: 'hover:border-rose-600'
    },
    slate: {
      iconBg: 'bg-slate-200 text-slate-900 border border-slate-300',
      borderHover: 'hover:border-slate-500'
    }
  }[colorScheme];

  const clickableStyles = onClick 
    ? 'cursor-pointer hover:shadow-clinical-hover transition-all duration-200 ' + schemeStyles.borderHover
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md flex items-start justify-between gap-4 ${clickableStyles} ${className}`}
    >
      <div className="space-y-1.5">
        <p className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm font-bold text-slate-800">
            {subtitle}
          </p>
        )}
        {trend && (
          <p className={`text-xs sm:text-sm font-extrabold pt-0.5 ${trend.positive ? 'text-emerald-800' : 'text-rose-800'}`}>
            {trend.text}
          </p>
        )}
      </div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${schemeStyles.iconBg}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};
