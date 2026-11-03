import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  badge,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EBEF] ${className}`}>
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-[#718096] mb-1">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="hover:text-[#087F8C] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-[#172B3A]' : ''}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A] tracking-tight">
            {title}
          </h1>
          {badge}
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-[#718096] max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
