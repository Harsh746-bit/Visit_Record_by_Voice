import React from 'react';
import { Bell, AlertTriangle, FileCheck, RefreshCw, X } from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'high_risk' | 'visit_submitted' | 'record_returned' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-modal z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5EBEF] bg-[#F5F8FA]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#087F8C]" />
          <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
            Live Clinical Notifications
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E6F4F5] text-[#087F8C] font-bold">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onMarkAllAsRead && notifications.some(n => !n.read) && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-[#087F8C] hover:underline font-semibold cursor-pointer"
            >
              Mark read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#E5EBEF]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#718096]">
            No unread notifications. Live WebSocket stream is active.
          </div>
        ) : (
          notifications.map((n) => {
            const iconConfig = {
              high_risk: {
                icon: AlertTriangle,
                bg: 'bg-[#FCE8E8] text-[#DC5B5B]'
              },
              visit_submitted: {
                icon: FileCheck,
                bg: 'bg-[#E1F6ED] text-[#15966A]'
              },
              record_returned: {
                icon: RefreshCw,
                bg: 'bg-[#FEF3DC] text-[#E8A23A]'
              },
              info: {
                icon: Bell,
                bg: 'bg-slate-100 text-[#087F8C]'
              }
            }[n.type];

            const Icon = iconConfig.icon;

            return (
              <div
                key={n.id}
                onClick={() => onSelectNotification && onSelectNotification(n)}
                className={`p-3.5 flex items-start gap-3 hover:bg-[#F5F8FA] transition-colors cursor-pointer ${
                  !n.read ? 'bg-[#E6F4F5]/30' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconConfig.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#172B3A] truncate">{n.title}</h4>
                    <span className="text-[10px] text-[#718096] shrink-0">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#718096] line-clamp-2 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 text-center border-t border-[#E5EBEF] bg-[#F5F8FA]">
        <span className="text-[11px] text-[#718096]">
          Connected to Circle: <strong className="text-[#087F8C]">Khed Shivapur PHC</strong>
        </span>
      </div>
    </div>
  );
};
