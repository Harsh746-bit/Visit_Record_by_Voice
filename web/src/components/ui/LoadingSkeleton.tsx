import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'row' | 'stat' | 'field';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  className = ''
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'stat') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {items.map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#E5EBEF] flex items-center justify-between">
            <div className="space-y-2 w-2/3">
              <div className="h-3 w-1/2 rounded animate-shimmer" />
              <div className="h-7 w-3/4 rounded animate-shimmer" />
              <div className="h-3 w-1/3 rounded animate-shimmer" />
            </div>
            <div className="w-12 h-12 rounded-xl animate-shimmer shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((i) => (
          <div key={i} className="h-12 w-full rounded-xl animate-shimmer" />
        ))}
      </div>
    );
  }

  if (type === 'field') {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#E5EBEF] space-y-2">
            <div className="h-4 w-1/3 rounded animate-shimmer" />
            <div className="h-6 w-1/2 rounded animate-shimmer" />
            <div className="h-3 w-full rounded animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-[#E5EBEF] space-y-3">
          <div className="h-5 w-1/4 rounded animate-shimmer" />
          <div className="h-4 w-3/4 rounded animate-shimmer" />
          <div className="h-20 w-full rounded-xl animate-shimmer" />
        </div>
      ))}
    </div>
  );
};
