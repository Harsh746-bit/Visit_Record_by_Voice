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
      iconBg: 'bg-[#E6F4F5] text-[#087F8C]',
      borderHover: 'hover:border-[#087F8C]'
    },
    green: {
      iconBg: 'bg-[#E1F6ED] text-[#15966A]',
      borderHover: 'hover:border-[#15966A]'
    },
    amber: {
      iconBg: 'bg-[#FEF3DC] text-[#E8A23A]',
      borderHover: 'hover:border-[#E8A23A]'
    },
    rose: {
      iconBg: 'bg-[#FCE8E8] text-[#DC5B5B]',
      borderHover: 'hover:border-[#DC5B5B]'
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700',
      borderHover: 'hover:border-slate-300'
    }
  }[colorScheme];

  const clickableStyles = onClick 
    ? 'cursor-pointer hover:shadow-clinical-hover transition-all duration-200 ' + schemeStyles.borderHover
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card flex items-start justify-between gap-4 ${clickableStyles} ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-[#172B3A] tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#718096]">
            {subtitle}
          </p>
        )}
        {trend && (
          <p className={`text-xs font-medium pt-0.5 ${trend.positive ? 'text-[#15966A]' : 'text-[#DC5B5B]'}`}>
            {trend.text}
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${schemeStyles.iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
