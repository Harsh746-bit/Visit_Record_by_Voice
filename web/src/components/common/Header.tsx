import React from 'react';
import { Mic, Smartphone, Monitor, Split, Globe } from 'lucide-react';
import { ViewMode } from '../../types';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  lang: string;
  onChangeLang: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  lang,
  onChangeLang
}) => {
  return (
    <header className="bg-white border-b border-[#E4ECEC] sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#087F8C] to-[#15966A] text-white flex items-center justify-center shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#172B3A] tracking-tight">Visit Record by Voice</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#087F8C] border border-teal-200">
                Maharashtra ASHA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-devanagari">
              आवाज द्वारे आरोग्य भेट नोंदणी • AI Multilingual Healthcare Platform
            </p>
          </div>
        </div>

        {/* View Mode Switcher (ANM Portal vs ASHA Mobile vs Dual) */}
        <div className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => onChangeViewMode('anm')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'anm'
                ? 'bg-white text-[#087F8C] shadow-xs'
                : 'text-slate-600 hover:text-[#172B3A]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>ANM Supervisor Portal</span>
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
            <span>ASHA Mobile App</span>
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

        {/* Right Section: Language & User */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 text-xs border border-slate-200 rounded-xl px-2.5 py-1 bg-white">
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

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-[#087F8C] font-bold flex items-center justify-center text-xs">
              SD
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-[#172B3A]">Sujata Deshmukh</div>
              <span className="text-[10px] text-slate-500">ANM Supervisor (Khed PHC)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
