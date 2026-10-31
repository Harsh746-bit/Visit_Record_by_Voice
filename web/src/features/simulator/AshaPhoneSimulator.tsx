import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  User, 
  Search, 
  FileText, 
  Settings, 
  Globe, 
  LogOut, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Volume2, 
  Edit3, 
  Sparkles,
  Wifi,
  Battery,
  ChevronRight,
  Send,
  Info
} from 'lucide-react';
import { Beneficiary, StructuredVisit } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { mockDataService } from '../../services/mockDataService';
import { translations } from '../../i18n/translations';
import appLogo from '../../assets/app_logo.png';

export type AshaScreenId = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'language'
  | 'home'
  | 'beneficiary_list'
  | 'beneficiary_profile'
  | 'recording'
  | 'transcription_review'
  | 'structured_record'
  | 'evidence_review'
  | 'validation'
  | 'confirmation'
  | 'visit_history'
  | 'settings';

interface AshaPhoneSimulatorProps {
  onRecordSubmitted?: (record: StructuredVisit) => void;
}

export const AshaPhoneSimulator: React.FC<AshaPhoneSimulatorProps> = ({ onRecordSubmitted }) => {
  const [currentScreen, setCurrentScreen] = useState<AshaScreenId>('home');
  const [lang, setLang] = useState<'mr' | 'hi'>('mr');
  
  const beneficiaries = mockDataService.getBeneficiaries();
  const records = mockDataService.getRecords();
  
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary>(beneficiaries[0]);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioWaveIndex, setAudioWaveIndex] = useState(0);
  const [simulatedTranscript, setSimulatedTranscript] = useState(records[0]?.transcript || '');
  
  // Simulated editable vitals
  const [editedBpSystolic, setEditedBpSystolic] = useState<number>(140);
  const [editedBpDiastolic, setEditedBpDiastolic] = useState<number>(95);
  const [editedHb, setEditedHb] = useState<number>(10.2);
  const [editedWeight, setEditedWeight] = useState<number>(54.0);

  const handleLanguageChange = (newLang: 'mr' | 'hi') => {
    setLang(newLang);
    if (newLang === 'mr') {
      setSimulatedTranscript(records[0]?.transcript || '');
      setEditedBpSystolic(140);
      setEditedBpDiastolic(95);
      setEditedHb(10.2);
      setEditedWeight(54.0);
    } else {
      setSimulatedTranscript(records[1]?.transcript || '');
      setEditedBpSystolic(118);
      setEditedBpDiastolic(76);
      setEditedHb(11.5);
      setEditedWeight(49.0);
    }
  };

  // Recording timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        setAudioWaveIndex((prev) => (prev + 1) % 10);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setCurrentScreen('transcription_review');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const t = translations[lang];

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {/* Simulator Guidance Bar */}
      <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info className="w-4 h-4 text-[#087F8C]" />
          <span>Frontline Screen:</span>
        </div>
        <select
          value={currentScreen}
          onChange={(e) => setCurrentScreen(e.target.value as AshaScreenId)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-[#087F8C] cursor-pointer"
        >
          <option value="splash">1. Splash Screen</option>
          <option value="onboarding">2. Onboarding (3 Steps)</option>
          <option value="login">3. Login & Demo Profile</option>
          <option value="language">4. Language Selection</option>
          <option value="home">5. ASHA Home Dashboard</option>
          <option value="beneficiary_list">6. Beneficiary Registry</option>
          <option value="beneficiary_profile">7. Beneficiary Profile</option>
          <option value="recording">8. Voice Recording</option>
          <option value="transcription_review">9. Transcription Review</option>
          <option value="structured_record">10. AI Structured Form</option>
          <option value="evidence_review">11. Signature Evidence Review</option>
          <option value="validation">12. Validation & Danger Signs</option>
          <option value="confirmation">13. Final Confirmation</option>
          <option value="visit_history">14. Visit History</option>
          <option value="settings">15. ASHA Settings</option>
        </select>
        <button
          onClick={() => handleLanguageChange(lang === 'mr' ? 'hi' : 'mr')}
          className="px-2.5 py-1 rounded bg-teal-50 text-[#087F8C] font-semibold text-xs border border-teal-200 cursor-pointer"
        >
          {lang === 'mr' ? 'मराठी' : 'हिन्दी'}
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="w-[390px] h-[780px] bg-[#172B3A] rounded-[48px] p-3 shadow-2xl relative border-4 border-slate-800 flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
        </div>

        {/* Screen Content Container */}
        <div className="w-full h-full bg-[#F7FAFA] rounded-[38px] flex flex-col overflow-hidden relative font-sans">
          
          {/* Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-[#172B3A] font-medium z-40 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* SCREEN 1: SPLASH SCREEN */}
          {currentScreen === 'splash' && (
            <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-white via-teal-50/30 to-[#F7FAFA] text-center">
              <div className="w-full flex justify-end">
                <span className="text-[11px] text-slate-400 font-mono">v1.0.0</span>
              </div>
              <div className="space-y-4">
                <img 
                  src={appLogo} 
                  alt="Visit Record Logo" 
                  className="w-24 h-24 mx-auto rounded-3xl object-cover shadow-lg border border-teal-100" 
                />
                <div>
                  <h1 className="text-2xl font-black text-[#172B3A] tracking-tight">{t.appTitle}</h1>
                  <p className="text-sm font-semibold text-[#087F8C] mt-1 font-devanagari">{t.tagline}</p>
                </div>
                <p className="text-xs text-slate-500 max-w-[240px] mx-auto">
                  Frontline Multilingual Healthcare Voice Platform for Maharashtra ASHA Workers
                </p>
              </div>
              <button
                onClick={() => setCurrentScreen('onboarding')}
                className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>सुरू करा • Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 2: ONBOARDING */}
          {currentScreen === 'onboarding' && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-white">
              <div className="space-y-2 mt-4">
                <div className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">३ सोप्या पायऱ्या • 3 Steps</div>
                <h2 className="text-xl font-bold text-[#172B3A] font-devanagari">हे ॲप कसे काम करते?</h2>
                <p className="text-xs text-slate-500">How to use Visit Record by Voice</p>
              </div>

              <div className="space-y-5 my-auto">
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100">
                  <div className="w-10 h-10 rounded-xl bg-[#087F8C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    १
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#172B3A] font-devanagari">सहज बोला</h3>
                    <p className="text-xs text-slate-600 font-devanagari mt-0.5">
                      मराठी किंवा हिंदीत लाभार्थीच्या घरी झालेल्या भेटीचे वर्णन करा.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-[#15966A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    २
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#172B3A] font-devanagari">AI नोंद तयार करतो</h3>
                    <p className="text-xs text-slate-600 font-devanagari mt-0.5">
                      रक्तदाब, वजन, गोळ्या आणि तक्रारी आपोआप नोंदवल्या जातात.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ३
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#172B3A] font-devanagari">पडताळा व पाठवा</h3>
                    <p className="text-xs text-slate-600 font-devanagari mt-0.5">
                      प्रत्येक आकड्याचा आवाजातील पुरावा तपासा आणि खात्री करून सबमिट करा.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreen('login')}
                className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>लॉगिन करा • Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 3: LOGIN */}
          {currentScreen === 'login' && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-white">
              <div className="mt-4">
                <img 
                  src={appLogo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl object-cover border border-teal-100 shadow-xs mb-3" 
                />
                <h2 className="text-xl font-bold text-[#172B3A] font-devanagari">आशा कार्यकर्ता लॉगिन</h2>
                <p className="text-xs text-slate-500 mt-0.5">ASHA Frontline Mobile Authentication</p>
              </div>

              <div className="space-y-4 my-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-devanagari">
                    मोबाईल क्रमांक (Mobile Number)
                  </label>
                  <input
                    type="text"
                    defaultValue="+91 98810 99401"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-devanagari">
                    पासवर्ड / पिन (PIN)
                  </label>
                  <input
                    type="password"
                    defaultValue="••••"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900">
                  <span className="font-semibold">Demo Profile:</span> Rukmini Vithal Jadhav (Khed Circle, Pune)
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>लॉगिन करा • Login</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('language')}
                  className="w-full py-2.5 text-xs text-slate-500 font-semibold text-center hover:text-slate-800 cursor-pointer"
                >
                  भाषा बदला • Change Language
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: LANGUAGE SELECTION */}
          {currentScreen === 'language' && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-white">
              <div className="mt-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#087F8C] flex items-center justify-center mb-3">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#172B3A] font-devanagari">तुमची भाषा निवडा</h2>
                <p className="text-xs text-slate-500">Select your preferred regional language</p>
              </div>

              <div className="space-y-3 my-auto">
                <div 
                  onClick={() => handleLanguageChange('mr')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    lang === 'mr' ? 'border-[#087F8C] bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#172B3A] font-devanagari">मराठी</h3>
                    <p className="text-xs text-slate-500 font-devanagari">महाराष्ट्र राज्य अधिकृत भाषा</p>
                  </div>
                  {lang === 'mr' && <CheckCircle className="w-6 h-6 text-[#087F8C]" />}
                </div>

                <div 
                  onClick={() => handleLanguageChange('hi')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    lang === 'hi' ? 'border-[#087F8C] bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#172B3A] font-devanagari">हिन्दी</h3>
                    <p className="text-xs text-slate-500 font-devanagari">राष्ट्रीय भाषा</p>
                  </div>
                  {lang === 'hi' && <CheckCircle className="w-6 h-6 text-[#087F8C]" />}
                </div>
              </div>

              <button
                onClick={() => setCurrentScreen('home')}
                className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 transition-all text-center cursor-pointer"
              >
                निवड जतन करा • Save Selection
              </button>
            </div>
          )}

          {/* SCREEN 5: ASHA HOME DASHBOARD */}
          {currentScreen === 'home' && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="bg-white p-5 border-b border-[#E4ECEC]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-[#087F8C] font-bold flex items-center justify-center text-sm">
                      RJ
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-[#172B3A] font-devanagari">{t.ashaGreeting}</h2>
                      <p className="text-[11px] text-slate-500 font-devanagari">{t.khedCircle}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentScreen('settings')}
                    className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* Today's Stats Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-[#F7FAFA] p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 font-medium font-devanagari">{t.todayVisits}</span>
                    <div className="text-lg font-bold text-[#172B3A]">8</div>
                  </div>
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-center">
                    <span className="text-[10px] text-emerald-700 font-medium font-devanagari">{t.completed}</span>
                    <div className="text-lg font-bold text-emerald-800">5</div>
                  </div>
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-center">
                    <span className="text-[10px] text-amber-700 font-medium font-devanagari">{t.pending}</span>
                    <div className="text-lg font-bold text-amber-800">3</div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-4 space-y-4 flex-1">
                {/* PROMINENT PRIMARY ACTION: RECORD NEW VISIT */}
                <button
                  onClick={() => setCurrentScreen('recording')}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#087F8C] to-[#15966A] text-white shadow-lg shadow-teal-700/20 flex items-center justify-between hover:opacity-95 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Mic className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <div className="text-base font-bold font-devanagari">{t.recordNewVisit}</div>
                      <p className="text-xs text-teal-100 font-devanagari">मराठी किंवा हिंदीत बोला</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Quick Search */}
                <div 
                  onClick={() => setCurrentScreen('beneficiary_list')}
                  className="p-3 bg-white rounded-xl border border-[#E4ECEC] flex items-center gap-2 text-slate-400 text-xs cursor-pointer shadow-2xs"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="font-devanagari">{t.searchBeneficiary}</span>
                </div>

                {/* Today's Beneficiary Queue */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xs text-[#172B3A] uppercase tracking-wider font-devanagari">
                      आजच्या भेटीची यादी (Visit Queue)
                    </h3>
                    <span 
                      onClick={() => setCurrentScreen('beneficiary_list')}
                      className="text-xs text-[#087F8C] font-semibold cursor-pointer"
                    >
                      सर्व पहा
                    </span>
                  </div>

                  <div className="space-y-2">
                    {beneficiaries.slice(0, 3).map((ben) => (
                      <div
                        key={ben.id}
                        onClick={() => {
                          setSelectedBeneficiary(ben);
                          setCurrentScreen('beneficiary_profile');
                        }}
                        className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs flex items-center justify-between hover:border-teal-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                            ben.highRisk ? 'bg-red-50 text-red-700' : 'bg-teal-50 text-[#087F8C]'
                          }`}>
                            {ben.age}y
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#172B3A]">{ben.name}</h4>
                            <span className="text-[11px] text-slate-500 font-devanagari">{ben.nameMr}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {ben.highRisk ? (
                            <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                              High Risk
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">ANC</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Peek */}
                <div 
                  onClick={() => setCurrentScreen('evidence_review')}
                  className="p-3 rounded-xl bg-white border border-[#E4ECEC] shadow-2xs cursor-pointer hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 font-devanagari">मागील भेट नोंद (Sunita Shinde)</span>
                    <span className="text-[#087F8C] text-[11px] font-bold">पुरावा पहा →</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-devanagari mt-1 line-clamp-1">
                    "बीपी १४०/९५ एवढा जास्त भरला आहे... डोकेदुखीचा त्रास होत आहे..."
                  </p>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
                <button onClick={() => setCurrentScreen('home')} className="flex flex-col items-center text-[#087F8C] font-semibold cursor-pointer">
                  <Activity className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5 font-devanagari">होम</span>
                </button>
                <button onClick={() => setCurrentScreen('beneficiary_list')} className="flex flex-col items-center hover:text-slate-700 cursor-pointer">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5 font-devanagari">लाभार्थी</span>
                </button>
                <button onClick={() => setCurrentScreen('recording')} className="flex flex-col items-center text-[#087F8C] cursor-pointer">
                  <div className="w-10 h-10 -mt-5 rounded-full bg-[#087F8C] text-white flex items-center justify-center shadow-md">
                    <Mic className="w-5 h-5" />
                  </div>
                </button>
                <button onClick={() => setCurrentScreen('visit_history')} className="flex flex-col items-center hover:text-slate-700 cursor-pointer">
                  <Calendar className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5 font-devanagari">इतिहास</span>
                </button>
                <button onClick={() => setCurrentScreen('settings')} className="flex flex-col items-center hover:text-slate-700 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5 font-devanagari">सेटिंग्ज</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 6: BENEFICIARY LIST */}
          {currentScreen === 'beneficiary_list' && (
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="font-bold text-base text-[#172B3A] font-devanagari">सर्व लाभार्थी ({beneficiaries.length})</h2>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {beneficiaries.map((ben) => (
                  <div
                    key={ben.id}
                    onClick={() => {
                      setSelectedBeneficiary(ben);
                      setCurrentScreen('beneficiary_profile');
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#087F8C] transition-all cursor-pointer shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#172B3A]">{ben.name}</h4>
                      {ben.highRisk && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          High Risk
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-devanagari">{ben.nameMr} • {ben.category}</div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                      <span>वय: {ben.age} वर्ष</span>
                      <span>मागील भेट: {ben.lastVisitDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 7: BENEFICIARY PROFILE */}
          {currentScreen === 'beneficiary_profile' && (
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h2 className="font-bold text-base text-[#172B3A] font-devanagari">लाभार्थी प्रोफाइल</h2>
                </div>
                <StatusBadge status={selectedBeneficiary.highRisk ? 'critical' : 'extracted'} label={selectedBeneficiary.highRisk ? 'High Risk' : 'Normal'} />
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-[#F7FAFA] p-4 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-base text-[#172B3A]">{selectedBeneficiary.name}</h3>
                  <p className="text-xs text-slate-500 font-devanagari">{selectedBeneficiary.nameMr}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div><strong>RCH ID:</strong> {selectedBeneficiary.rchId}</div>
                    <div><strong>वय:</strong> {selectedBeneficiary.age} वर्ष</div>
                    <div><strong>उपकेंद्र:</strong> {selectedBeneficiary.subCenter}</div>
                    <div><strong>फोन:</strong> {selectedBeneficiary.contactPhone}</div>
                  </div>
                </div>

                {selectedBeneficiary.highRiskReasons.length > 0 && (
                  <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 text-xs text-red-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      उच्च जोखीम कारणे (High Risk Reasons):
                    </div>
                    {selectedBeneficiary.highRiskReasons.map((r, i) => (
                      <div key={i}>• {r}</div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setCurrentScreen('recording')}
                  className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer font-devanagari"
                >
                  <Mic className="w-4 h-4" />
                  <span>या लाभार्थीसाठी भेट नोंदवा</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 8: VOICE RECORDING SCREEN */}
          {currentScreen === 'recording' && (
            <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-teal-900 to-[#172B3A] text-white text-center">
              <div className="flex items-center justify-between text-xs">
                <button onClick={() => setCurrentScreen('home')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <div className="px-3 py-1 rounded-full bg-white/10 text-teal-200 font-semibold font-devanagari">
                  भाषा: {lang === 'mr' ? 'मराठी' : 'हिन्दी'}
                </div>
                <button onClick={() => handleLanguageChange(lang === 'mr' ? 'hi' : 'mr')} className="text-xs text-teal-300 font-medium underline cursor-pointer">
                  बदला
                </button>
              </div>

              <div className="space-y-6 my-auto">
                <div className="space-y-1">
                  <span className="text-xs text-teal-300 uppercase tracking-widest font-bold">
                    {isRecording ? 'नोंद सुरू आहे • Recording' : 'तयार आहे • Ready to Record'}
                  </span>
                  <div className="text-4xl font-mono font-bold tracking-wider">
                    {formatTimer(recordingSeconds)}
                  </div>
                </div>

                {/* Animated Waveform */}
                <div className="h-16 flex items-center justify-center gap-1.5 px-4">
                  {[25, 45, 75, 30, 95, 60, 85, 40, 70, 30, 90, 50, 80, 35, 65].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isRecording ? 'bg-teal-400' : 'bg-white/20'
                      }`}
                      style={{
                        height: isRecording 
                          ? `${Math.max(12, ((h + audioWaveIndex * 8) % 100) * 0.6)}px`
                          : '12px'
                      }}
                    ></div>
                  ))}
                </div>

                {/* Big Pulse Mic Button */}
                <div className="relative inline-block">
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-teal-400/30 animate-ping"></div>
                  )}
                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all relative z-10 cursor-pointer ${
                      isRecording ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#087F8C] hover:bg-teal-600'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-9 h-9 text-white fill-white" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-teal-100 max-w-xs mx-auto leading-relaxed font-devanagari">
                  "{t.speakingGuidance}"
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                {isRecording ? (
                  <button
                    onClick={handleStopRecording}
                    className="px-6 py-3 rounded-2xl bg-white text-[#172B3A] font-bold text-xs shadow-md cursor-pointer"
                  >
                    पूर्ण झाले • Finish & Review
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    className="px-6 py-3 rounded-2xl bg-teal-500 text-white font-bold text-xs shadow-md cursor-pointer font-devanagari"
                  >
                    रेकॉर्डिंग सुरू करा
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SCREEN 9: TRANSCRIPTION REVIEW */}
          {currentScreen === 'transcription_review' && (
            <div className="flex-1 flex flex-col justify-between p-5 bg-white overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#087F8C]" />
                    <h2 className="font-bold text-sm text-[#172B3A] font-devanagari">आवाजाचे रूपांतर (Transcript)</h2>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-[#087F8C] font-semibold">
                    Sarvam Saaras v3
                  </span>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-[#F7FAFA] border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-[#087F8C]" /> 00:44 Sec Audio
                    </span>
                    <button className="text-[11px] text-[#087F8C] font-semibold flex items-center gap-1 cursor-pointer">
                      <Edit3 className="w-3 h-3" /> एडिट करा
                    </button>
                  </div>
                  <p className="text-xs text-[#172B3A] leading-relaxed font-devanagari">
                    {simulatedTranscript}
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 font-devanagari">
                  * टीप: उच्चार किंवा आवाजातील त्रुटी असल्यास आपण वरील मजकूर दुरुस्त करू शकता.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => setCurrentScreen('structured_record')}
                  className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI माहिती तयार करा • Extract Record</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('recording')}
                  className="w-full py-2.5 text-xs text-slate-500 font-semibold text-center cursor-pointer"
                >
                  पुन्हा रेकॉर्ड करा • Re-record
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 10: AI STRUCTURED RECORD */}
          {currentScreen === 'structured_record' && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-[#F7FAFA] overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base text-[#172B3A] font-devanagari">तयार झालेली भेट नोंद</h2>
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    AI Generated
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">A. मोजमापे (Measurements)</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-500">रक्तदाब (BP)</span>
                      <div className="font-bold text-[#172B3A] text-sm">{editedBpSystolic}/{editedBpDiastolic} mmHg</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-500">वजन (Weight)</span>
                      <div className="font-bold text-[#172B3A] text-sm">{editedWeight} kg</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 col-span-2">
                      <span className="text-slate-500">हिमोग्लोबिन (Hb)</span>
                      <div className="font-bold text-[#172B3A] text-sm">{editedHb} g/dL</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">B. लक्षणे (Observations)</div>
                  <div className="text-xs space-y-1 text-slate-700">
                    <div className="flex justify-between"><span>डोकेदुखी (Headache):</span> <strong className="text-red-600">होय (आहे)</strong></div>
                    <div className="flex justify-between"><span>पायावर सूज (Swelling):</span> <strong className="text-red-600">होय (हलकी)</strong></div>
                    <div className="flex justify-between"><span>बाळाची हालचाल (Fetal Movement):</span> <strong className="text-emerald-700">नॉर्मल</strong></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  onClick={() => setCurrentScreen('evidence_review')}
                  className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>पुरावा पडताळा • Review Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 11: EVIDENCE REVIEW (SIGNATURE CORE FEATURE) */}
          {currentScreen === 'evidence_review' && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-white overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentScreen('structured_record')} className="p-1 cursor-pointer">
                      <ArrowLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <h2 className="font-bold text-sm text-[#172B3A] font-devanagari">पुरावा पडताळणी (Evidence)</h2>
                  </div>
                  <span className="text-[10px] bg-teal-50 text-[#087F8C] font-semibold px-2 py-0.5 rounded-full">
                    Traceable Words
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">फील्ड: रक्तदाब (Blood Pressure)</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      पुरावा सापडला (99%)
                    </span>
                  </div>
                  <div className="text-base font-bold text-[#172B3A]">
                    {editedBpSystolic}/{editedBpDiastolic} mmHg
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-teal-100 text-xs text-slate-800 font-devanagari">
                    <strong>आवाजातील मूळ वाक्य:</strong>
                    <div className="mt-1 text-teal-900 font-semibold bg-teal-100/60 p-1.5 rounded">
                      "तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे."
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 font-devanagari">नियम: पुराव्याशिवाय नोंद नाही</div>
                  <p className="text-[11px] leading-relaxed font-devanagari">
                    AI ने काढलेला प्रत्येक घटक मूळ बोललेल्या वाक्याशी थेट जोडलेला आहे. कोणतीही खोटी माहिती जोडली जात नाही.
                  </p>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  onClick={() => setCurrentScreen('validation')}
                  className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>वैद्यकीय इशारे तपासा • Validate Rules</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 12: CLINICAL VALIDATION SCREEN */}
          {currentScreen === 'validation' && (
            <div className="flex-1 flex flex-col justify-between p-4 bg-white overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <button onClick={() => setCurrentScreen('evidence_review')} className="p-1 cursor-pointer">
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <h2 className="font-bold text-sm text-[#172B3A] font-devanagari">वैद्यकीय धोक्याचे इशारे</h2>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    धोका: उच्च रक्तदाब (High BP Danger)
                  </div>
                  <p className="text-xs text-slate-700 font-devanagari">
                    रक्तदाब १४०/९५ भरला असून डोकेदुखीची तक्रार आहे. हा प्री-एक्लॅम्पसियाचा धोका असू शकतो.
                  </p>
                  <div className="text-[11px] bg-white p-2 rounded border border-red-100 font-bold text-red-800 font-devanagari">
                    कृती: तातडीने PHC डॉक्टरांकडे पाठवावे (Referral Required)
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 font-devanagari">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    माहितीची नोंद तपासा:
                  </div>
                  <p className="text-[11px] font-devanagari">
                    आयर्नच्या गोळ्या (IFA) नियमित घेण्याचा सल्ला दिलेला आहे.
                  </p>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  onClick={() => setCurrentScreen('confirmation')}
                  className="w-full py-3.5 bg-[#087F8C] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>अंतिम खात्री करा • Final Confirmation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 13: CONFIRMATION SCREEN */}
          {currentScreen === 'confirmation' && (
            <div className="flex-1 flex flex-col justify-between p-5 bg-white overflow-y-auto">
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-[#087F8C] flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h2 className="font-bold text-base text-[#172B3A] font-devanagari">नोंद अंतिम करा</h2>
                  <p className="text-xs text-slate-500">ASHA Worker Explicit Sign-off</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7FAFA] border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between"><strong>लाभार्थी:</strong> <span>{selectedBeneficiary.name}</span></div>
                  <div className="flex justify-between"><strong>रक्तदाब:</strong> <span>{editedBpSystolic}/{editedBpDiastolic} mmHg</span></div>
                  <div className="flex justify-between"><strong>हिमोग्लोबिन:</strong> <span>{editedHb} g/dL</span></div>
                  <div className="flex justify-between"><strong>रेफरल:</strong> <span className="text-red-600 font-bold">खेड प्राथमिक आरोग्य केंद्र</span></div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 text-teal-900 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                  <span className="font-devanagari">
                    मी खात्री करते की ही माहिती मी प्रत्यक्ष तपासणी करून आवाजाद्वारे नोंदवली आहे.
                  </span>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  onClick={() => {
                    const newRec: StructuredVisit = {
                      recordId: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      beneficiaryId: selectedBeneficiary.id,
                      beneficiaryName: selectedBeneficiary.name,
                      ashaId: selectedBeneficiary.assignedAshaId,
                      ashaName: selectedBeneficiary.assignedAshaName,
                      language: lang === 'mr' ? 'mr-IN' : 'hi-IN',
                      transcript: simulatedTranscript,
                      audioDurationSeconds: 44.0,
                      recordedAt: new Date().toISOString(),
                      visitType: 'ANC',
                      isConfirmedByAsha: true,
                      confirmedAt: new Date().toISOString(),
                      anmReviewStatus: 'pending',
                      measurements: {
                        bloodPressureSystolic: { value: editedBpSystolic, unit: 'mmHg', status: 'concerning', supportingPhrase: 'बीपी १४०/९५' },
                        bloodPressureDiastolic: { value: editedBpDiastolic, unit: 'mmHg', status: 'concerning', supportingPhrase: 'बीपी १४०/९५' },
                        weightKg: { value: editedWeight, unit: 'kg', status: 'extracted', supportingPhrase: 'वजन ५४ किलो आहे' },
                        hemoglobinGDl: { value: editedHb, unit: 'g/dL', status: 'extracted', supportingPhrase: 'हिमोग्लोबिन १०.२ ग्रॅम भरले' }
                      },
                      pregnancyDetails: {
                        gestationalAgeWeeks: { value: selectedBeneficiary.gestationalWeeks || 28, status: 'extracted', supportingPhrase: '२८ आठवड्यांची' },
                        trimester: { value: 3, status: 'extracted' },
                        highRiskPregnancy: { value: selectedBeneficiary.highRisk, status: selectedBeneficiary.highRisk ? 'concerning' : 'extracted' }
                      },
                      symptoms: {
                        fever: { value: false, status: 'extracted' },
                        headacheOrBlurredVision: { value: true, status: 'concerning', supportingPhrase: 'डोकेदुखीचा त्रास होत आहे' },
                        swellingPedalEdema: { value: true, status: 'concerning', supportingPhrase: 'पायावर हलकी सूज आहे' },
                        bleedingOrSpotting: { value: false, status: 'extracted' },
                        fetalMovementNormal: { value: true, status: 'extracted', supportingPhrase: 'बाळाची हालचाल व्यवस्थित आहे' }
                      },
                      interventions: {
                        ifaTabletsGiven: { value: true, status: 'extracted', supportingPhrase: 'आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला' },
                        calciumTabletsGiven: { value: true, status: 'extracted' },
                        referralRecommended: { value: true, status: 'concerning' }
                      },
                      evidenceSpans: [
                        { fieldName: 'bloodPressureSystolic', extractedValue: editedBpSystolic, startChar: 145, endChar: 154, sourceText: 'बीपी १४०/९५', confidence: 0.99, status: 'concerning' }
                      ],
                      validationWarnings: [
                        { field: 'bloodPressure', severity: 'critical', code: 'ELEVATED_BP_DANGER_SIGN', messageEn: 'Elevated BP recorded.', messageMr: 'रक्तदाब जास्त भरला आहे.', messageHi: 'रक्तचाप अधिक है।' }
                      ]
                    };

                    mockDataService.addRecord(newRec);
                    if (onRecordSubmitted) {
                      onRecordSubmitted(newRec);
                    }
                    alert(t.successMsg);
                    setCurrentScreen('home');
                  }}
                  className="w-full py-3.5 bg-[#15966A] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer font-devanagari"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.confirmSubmit}</span>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 14: VISIT HISTORY */}
          {currentScreen === 'visit_history' && (
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 cursor-pointer">
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <h2 className="font-bold text-sm text-[#172B3A] font-devanagari">भेटीचा इतिहास (History)</h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">ऑक्टोबर २०२६</span>
              </div>

              <div className="p-4 space-y-3">
                {records.map((rec) => (
                  <div key={rec.recordId} className="p-3.5 rounded-2xl border border-slate-200 bg-[#F7FAFA] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172B3A]">{rec.beneficiaryName}</span>
                      <StatusBadge status={rec.anmReviewStatus} />
                    </div>
                    <div className="text-[11px] text-slate-500 font-devanagari">
                      BP: {rec.measurements.bloodPressureSystolic.value}/{rec.measurements.bloodPressureDiastolic.value} • {rec.language === 'mr-IN' ? 'मराठी' : 'हिन्दी'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 15: SETTINGS */}
          {currentScreen === 'settings' && (
            <div className="flex-1 flex flex-col justify-between p-5 bg-white overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <button onClick={() => setCurrentScreen('home')} className="p-1 cursor-pointer">
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <h2 className="font-bold text-sm text-[#172B3A] font-devanagari">सेटिंग्ज (Settings)</h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div 
                    onClick={() => setCurrentScreen('language')}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 font-devanagari">भाषा निवडा (Language)</div>
                      <span className="text-slate-500">{lang === 'mr' ? 'मराठी (Marathi)' : 'हिन्दी (Hindi)'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 font-devanagari">स्थानिक डेटा (Offline Sync)</div>
                      <span className="text-emerald-600 font-medium font-devanagari">स्थानिक मेमरीमध्ये जतन आहे</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200">
                    <div className="font-semibold text-slate-800 font-devanagari">ऑडिओ गोपनीयता धोरण (Audio Policy)</div>
                    <p className="text-[11px] text-slate-500 mt-1 font-devanagari">
                      ध्वनिमुद्रण केवळ भाषांतर व पडताळणीसाठी वापरले जाते. ३० दिवसांनंतर मूळ ऑडिओ आपोआप हटवला जातो.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreen('login')}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉगआउट करा • Logout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
