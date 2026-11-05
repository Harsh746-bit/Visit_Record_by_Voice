import React, { useState } from 'react';
import { Smartphone, Monitor, Split, Globe, LogOut, Bell, Menu, Mic } from 'lucide-react';
import { ViewMode } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { NotificationPanel, NotificationItem } from '../ui/NotificationPanel';
import appLogo from '../../assets/app_logo.png';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  lang: string;
  onChangeLang: (lang: string) => void;
  pendingCount?: number;
  onToggleMobileSidebar?: () => void;
}

const MODE_TABS = [
  { id: 'anm',  label: 'ANM Portal',     icon: Monitor,    desc: 'Supervisor' },
  { id: 'asha', label: 'ASHA Mobile',    icon: Mic,        desc: 'Field Worker' },
  { id: 'dual', label: 'Dual-View',      icon: Split,      desc: 'Live Demo' },
] as const;

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  lang,
  onChangeLang,
  pendingCount = 1,
  onToggleMobileSidebar,
}) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'high_risk',
      title: 'उच्च जोखीम इशारा: सुनिता शिंदे',
      message: 'रक्तदाब १४०/९५ mmHg आणि तीव्र डोकेदुखी नोंदवली गेली आहे. त्वरित PHC संदर्भ आवश्यक.',
      timestamp: '५ मिनिटांपूर्वी',
      read: false
    },
    {
      id: 'notif-2',
      type: 'visit_submitted',
      title: 'नवीन भेट नोंद सबमिट झाली',
      message: 'आशा सेविका रुक्मिणी जाधव यांनी पूजा पाटील (ANC २८ आठवडे) यांची नोंद सबमिट केली.',
      timestamp: '२० मिनिटांपूर्वी',
      read: false
    },
    {
      id: 'notif-3',
      type: 'info',
      title: 'Sarvam Saaras ASR इंजिन सक्रिय',
      message: 'मराठी व हिंदी देवनागरी व्हॉइस प्रोसेसिंग थेट चालू आहे.',
      timestamp: '१ तासापूर्वी',
      read: true
    }
  ]);

  const displayName = user ? (user.full_name_mr || user.full_name) : 'सुजाता देशमुख';
  const roleTitle = user ? `${user.role} • ${user.phc || 'खेड शिवापूर'}` : 'ANM Supervisor • खेड शिवापूर';
  const initials = displayName.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* ── LEFT: Hamburger (mobile, ANM only) + Brand ── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger for ANM sidebar */}
          {viewMode === 'anm' && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-white shrink-0">
              <img src={appLogo} alt="Visit Record by Voice" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-950 tracking-tight whitespace-nowrap">
                  Visit Record by Voice
                </span>
                <span className="hidden lg:inline-flex text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 whitespace-nowrap">
                  महाराष्ट्र शासन
                </span>
              </div>
              <p className="text-xs text-slate-700 font-devanagari font-semibold leading-tight">
                बोल • पडताळा • नोंदवा
              </p>
            </div>
          </div>
        </div>

        {/* ── CENTER: Mode Switcher ── */}
        <div className="hidden sm:flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300">
          {MODE_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeViewMode(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-700 text-white shadow-md'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'anm' && pendingCount > 0 && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── RIGHT: Status + Notifications + Lang + User ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live synced pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Live Synced
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-cyan-800 hover:bg-cyan-100 transition-colors cursor-pointer border border-slate-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white" />
              )}
            </button>
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onMarkAllAsRead={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            />
          </div>

          {/* Language picker */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm border-2 border-slate-300 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 bg-white hover:border-slate-400 transition-colors font-bold text-slate-900 shadow-2xs">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-700 shrink-0" />
            <select
              value={lang}
              onChange={e => onChangeLang(e.target.value)}
              className="text-xs sm:text-sm bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
            >
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* User + logout */}
          <div className="hidden md:flex items-center gap-2.5 pl-2.5 border-l-2 border-slate-300">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-800 text-white font-extrabold flex items-center justify-center text-sm shadow-brand shrink-0">
              {initials}
            </div>
            <div className="text-left hidden lg:block">
              <div className="font-bold text-sm text-slate-950 leading-tight line-clamp-1">{displayName}</div>
              <div className="text-xs text-slate-700 font-semibold line-clamp-1">{roleTitle}</div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MODE TABS (shown below header on xs screens) ── */}
      <div className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-300">
        {MODE_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeViewMode(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'text-slate-800 bg-white border border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </header>
  );
};
