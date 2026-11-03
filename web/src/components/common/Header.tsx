import React, { useState } from 'react';
import { Smartphone, Monitor, Split, Globe, LogOut, Bell } from 'lucide-react';
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
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  lang,
  onChangeLang,
  pendingCount: _pendingCount = 1
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

  const displayName = user ? (user.full_name_mr || user.full_name) : 'सुजाता देशमुख (Sujata Deshmukh)';
  const roleTitle = user ? `${user.role} (${user.phc || 'खेड शिवापूर प्रा.आ.केंद्र'})` : 'ANM Supervisor • खेड शिवापूर उपकेंद्र';
  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-[#E5EBEF] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E5EBEF] shadow-xs bg-white flex items-center justify-center shrink-0">
            <img src={appLogo} alt="Visit Record by Voice" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#172B3A] tracking-tight">Visit Record by Voice</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4F5] text-[#087F8C] border border-[#087F8C]/20 hidden sm:inline-block">
                महाराष्ट्र शासन
              </span>
            </div>
            <p className="text-[11px] text-[#718096] font-devanagari">
              बोल. पडताळा. नोंदवा. • Frontline AI Healthcare Platform
            </p>
          </div>
        </div>

        {/* View Mode Switcher (ANM Portal vs ASHA Mobile vs Dual) */}
        <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-[#E5EBEF] text-xs">
          <button
            onClick={() => onChangeViewMode('anm')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'anm'
                ? 'bg-white text-[#087F8C] shadow-xs'
                : 'text-slate-600 hover:text-[#172B3A]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>ANM Portal</span>
          </button>

          <button
            onClick={() => onChangeViewMode('asha')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'asha'
                ? 'bg-white text-[#087F8C] shadow-xs'
                : 'text-slate-600 hover:text-[#172B3A]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>ASHA Mobile</span>
          </button>

          <button
            onClick={() => onChangeViewMode('dual')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'dual'
                ? 'bg-white text-[#087F8C] shadow-xs'
                : 'text-slate-600 hover:text-[#172B3A]'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>Live Dual-View</span>
          </button>
        </div>

        {/* Right Section: Sync Status, Notifications, Language & User */}
        <div className="flex items-center gap-3">
          {/* Real-time WebSocket Connectivity Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E1F6ED] border border-[#15966A]/30 text-[11px] font-semibold text-[#0F6E4E]">
            <span className="w-2 h-2 rounded-full bg-[#15966A] animate-pulse"></span>
            <span>Live Synced</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-[#087F8C] hover:bg-slate-100 transition-colors cursor-pointer"
              title="सूचना (Notifications)"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC5B5B] ring-2 ring-white"></span>
              )}
            </button>

            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onMarkAllAsRead={() => {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
              }}
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-xs border border-[#E5EBEF] rounded-xl px-2.5 py-1 bg-white">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={lang}
              onChange={(e) => onChangeLang(e.target.value)}
              className="text-xs bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* User Badge & Logout */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-[#E5EBEF]">
            <div className="w-8 h-8 rounded-full bg-[#E6F4F5] text-[#087F8C] font-bold flex items-center justify-center text-xs border border-[#087F8C]/20">
              {initials}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-[#172B3A] line-clamp-1">{displayName}</div>
              <span className="text-[10px] text-[#718096] line-clamp-1">{roleTitle}</span>
            </div>
            <button
              onClick={() => logout()}
              title="लॉग आऊट (Logout)"
              className="p-1.5 ml-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
