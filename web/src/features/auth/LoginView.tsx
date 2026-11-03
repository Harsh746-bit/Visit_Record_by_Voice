import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Lock, Phone, ArrowRight, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo & Title */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#087F8C] shadow-lg shadow-[#087F8C]/20 mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          आरोग्य पर्यवेक्षक पोर्टल • Health Portal
        </h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Visit Record by Voice — बोल. पडताळा. नोंदवा.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Government of Maharashtra Healthcare Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 sm:px-10">
          {/* Production vs Dev Indicator */}
          {isProduction ? (
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-700">🔒 उत्पादन मोड • Production Mode</span>
              <p className="text-[11px] text-slate-500 mt-0.5">अधिकृत आरोग्य खात्याचे तपशील प्रविष्ट करा (Real credentials required)</p>
            </div>
          ) : (
            /* Quick Demo Credentials Switcher */
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                झटपट डेमो खाती (Development Mode Only):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile('ANM')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'ANM'
                      ? 'border-[#087F8C] bg-[#087F8C]/5 ring-1 ring-[#087F8C]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">सुजाता देशमुख</span>
                    {selectedRole === 'ANM' && <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />}
                  </div>
                  <div className="text-[11px] text-slate-500">ANM Supervisor</div>
                  <div className="text-[10px] text-[#087F8C] font-mono mt-0.5">+91 94220 18834</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile('ADMIN')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'border-[#087F8C] bg-[#087F8C]/5 ring-1 ring-[#087F8C]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">डॉ. आनंद जोशी</span>
                    {selectedRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />}
                  </div>
                  <div className="text-[11px] text-slate-500">District Admin</div>
                  <div className="text-[10px] text-[#087F8C] font-mono mt-0.5">+91 99999 00001</div>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                मोबाईल क्रमांक (Mobile Number)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 94220 18834"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                पासवर्ड (Argon2id Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087F8C] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold bg-[#087F8C] hover:bg-[#076c77] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#087F8C] shadow-lg shadow-[#087F8C]/20 transition-all disabled:opacity-50 cursor-pointer"
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

          {onContinueAsGuest && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>डेमो मोडमध्ये पुढे जा (Continue in Preview Mode)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
