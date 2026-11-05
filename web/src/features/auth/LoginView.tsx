import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Lock,
  Phone,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Mic,
  ShieldCheck,
  HeartPulse,
  FileText,
} from 'lucide-react';

interface LoginViewProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onContinueAsGuest }) => {
  const isProduction = import.meta.env.VITE_APP_MODE === 'production' || import.meta.env.PROD;
  const { login, isLoading, error, clearError } = useAuth();
  const [phone, setPhone] = useState(isProduction ? '' : '+91 94220 18834');
  const [password, setPassword] = useState(isProduction ? '' : 'Anm#Pr0d_42!Deshmukh');
  const [selectedRole, setSelectedRole] = useState<'ANM' | 'ADMIN'>('ANM');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(phone, password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleSelectDemoProfile = (role: 'ANM' | 'ADMIN') => {
    if (isProduction) return;
    clearError();
    setSelectedRole(role);
    if (role === 'ANM') {
      setPhone('+91 94220 18834');
      setPassword('Anm#Pr0d_42!Deshmukh');
    } else {
      setPhone('+91 99999 00001');
      setPassword('Adm#Secure_99!Joshi');
    }
  };

  const features = [
    {
      icon: Mic,
      title: 'बोलून नोंद करा',
      subtitle: 'Voice-first ANC documentation in Marathi & Hindi',
    },
    {
      icon: HeartPulse,
      title: 'जोखीम ओळखा',
      subtitle: 'AI-powered danger sign detection & risk stratification',
    },
    {
      icon: FileText,
      title: 'सुरक्षित अभिलेख',
      subtitle: 'Tamper-proof records with traceable evidence chains',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ════════════════════════════════════════════════
          LEFT BRAND PANEL  (60% on desktop, hidden mobile)
      ════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between w-[60%] relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #065A63 0%, #087F8C 55%, #15966A 100%)' }}
      >
        {/* Decorative background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full bg-white/5" />
          <div className="absolute bottom-[-100px] left-[-60px] w-[320px] h-[320px] rounded-full bg-white/5" />
          <div className="absolute top-[45%] left-[55%] w-[180px] h-[180px] rounded-full bg-white/[0.04]" />
        </div>

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Top: logo + govt badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg shadow-black/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight tracking-tight">
                Visit Record by Voice
              </div>
              <div className="text-white/60 text-xs font-medium mt-0.5">महाराष्ट्र शासन • Government of Maharashtra</div>
            </div>
          </div>

          {/* Center: headline */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-200/80 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                ASHA Frontline AI Platform
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              बोल.{' '}
              <span className="text-teal-200">पडताळा.</span>{' '}
              <span className="text-emerald-300">नोंदवा.</span>
            </h1>
            <p className="text-white/70 text-base xl:text-lg leading-relaxed mb-2 font-medium">
              Speak. Verify. Record.
            </p>
            <p className="text-white/55 text-sm leading-relaxed">
              AI-powered antenatal visit documentation for ASHA workers across Maharashtra —
              in Marathi and Hindi, offline-ready.
            </p>

            {/* Feature bullets */}
            <div className="mt-10 space-y-4">
              {features.map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-4 h-4 text-teal-200" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{title}</div>
                    <div className="text-white/55 text-xs leading-relaxed mt-0.5">{subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="mt-auto pt-6 border-t border-white/15">
            <p className="text-white/40 text-xs leading-relaxed">
              AI generates the record, evidence explains the record, the healthcare worker makes
              the final decision.
            </p>
            <p className="text-white/25 text-[11px] mt-1">
              Sarvam Saaras v2 · Devanagari ASR · Open Innovation Healthcare
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          RIGHT LOGIN PANEL  (40% desktop, full mobile)
      ════════════════════════════════════════════════ */}
      <div className="flex-1 lg:w-[40%] flex flex-col justify-center bg-[#F5F8FA] relative">
        {/* Subtle radial highlight */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-56 opacity-40"
            style={{ background: 'radial-gradient(ellipse at top left, #E6F4F5 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-6 sm:px-8 py-10">
          {/* Mobile-only brand header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#087F8C] shadow-lg shadow-[#087F8C]/25 mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black text-[#172B3A] leading-tight">
              Visit Record by Voice
            </h2>
            <p className="text-sm text-[#718096] mt-1">बोल. पडताळा. नोंदवा.</p>
          </div>

          {/* Title */}
          <div className="mb-7">
            <h2 className="text-2xl font-black text-[#172B3A] leading-tight">
              आरोग्य पोर्टल
            </h2>
            <p className="text-sm text-[#718096] mt-1">Health Supervisor Login</p>
          </div>

          {/* Production indicator OR Demo credential switcher */}
          {isProduction ? (
            <div className="mb-6 p-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-center">
              <span className="text-xs font-semibold text-slate-700">🔒 उत्पादन मोड • Production Mode</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                अधिकृत आरोग्य खात्याचे तपशील प्रविष्ट करा
                <br />
                (Real credentials required)
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[#718096] uppercase tracking-widest mb-2">
                झटपट डेमो खाती
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      role: 'ANM' as const,
                      name: 'सुजाता देशमुख',
                      sub: 'ANM Supervisor',
                      phone: '+91 94220 18834',
                    },
                    {
                      role: 'ADMIN' as const,
                      name: 'डॉ. आनंद जोशी',
                      sub: 'District Admin',
                      phone: '+91 99999 00001',
                    },
                  ] as const
                ).map(({ role, name, sub, phone: dPhone }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectDemoProfile(role)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                      selectedRole === role
                        ? 'border-[#087F8C] bg-[#087F8C]/5 ring-1 ring-[#087F8C]/40 shadow-sm'
                        : 'border-[#E5EBEF] bg-white hover:border-[#087F8C]/40 hover:bg-[#F0F9FA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[12px] font-bold text-[#172B3A] leading-tight">{name}</span>
                      {selectedRole === role && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#087F8C] shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#718096] mt-0.5">{sub}</div>
                    <div className="text-[10px] text-[#087F8C] font-mono mt-1">{dPhone}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                मोबाईल क्रमांक&nbsp;
                <span className="font-normal text-[#718096]">(Mobile Number)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-[#087F8C]" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 94220 18834"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#E5EBEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]/40 focus:border-[#087F8C] transition-all font-mono placeholder:font-sans placeholder:text-slate-400 shadow-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                पासवर्ड&nbsp;
                <span className="font-normal text-[#718096]">(Password)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#087F8C]" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#E5EBEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C]/40 focus:border-[#087F8C] transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-white font-bold bg-[#087F8C] hover:bg-[#076c77] active:bg-[#065A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#087F8C] shadow-lg shadow-[#087F8C]/25 transition-all disabled:opacity-50 cursor-pointer text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>प्रमाणीकरण व लॉगिन करा • Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guest / preview mode */}
          {onContinueAsGuest && (
            <div className="mt-5 pt-5 border-t border-[#E5EBEF] text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs text-[#718096] hover:text-[#087F8C] transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>डेमो मोडमध्ये पुढे जा (Continue in Preview Mode)</span>
              </button>
            </div>
          )}

          {/* Footer note */}
          <p className="mt-8 text-center text-[10px] text-[#9FB0BC] leading-relaxed">
            Secure · Government of Maharashtra · NHM Initiative
          </p>
        </div>
      </div>
    </div>
  );
};
