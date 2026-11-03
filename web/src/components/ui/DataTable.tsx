import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyState,
  isLoading,
  className = ''
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5EBEF] overflow-hidden p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-full rounded-xl animate-shimmer" />
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5EBEF] bg-[#F5F8FA]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EBEF]">
            {data.map((row, index) => {
              const rowKey = keyExtractor(row, index);
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick 
                      ? 'cursor-pointer hover:bg-[#F5F8FA]/80' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 text-xs sm:text-sm text-[#172B3A] ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render 
                        ? col.render(row, index) 
                        : (row as any)[col.key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
