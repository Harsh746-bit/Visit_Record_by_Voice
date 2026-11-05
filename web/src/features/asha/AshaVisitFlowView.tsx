import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Globe, 
  Heart, 
  Play, 
  Pause, 
  Download, 
  FileDown, 
  Upload, 
  Check, 
  Loader2, 
  FileSpreadsheet,
  Edit3,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { StructuredVisit, Beneficiary } from '../../types';
import { mockDataService } from '../../services/mockDataService';
import { apiClient } from '../../services/apiClient';
import { translations } from '../../i18n/translations';

export type FlowStep = 
  | 'dashboard' 
  | 'recording' 
  | 'transcript' 
  | 'structured' 
  | 'confirmation';

interface AshaVisitFlowViewProps {
  onRecordCreated?: (record: StructuredVisit) => void;
  onOpenRecordDetail?: (record: StructuredVisit) => void;
  lang?: 'mr' | 'hi' | 'en';
  onChangeLang?: (l: 'mr' | 'hi' | 'en') => void;
}

const DEFAULT_DEMO_TRANSCRIPTS: Record<'mr' | 'hi' | 'en', string> = {
  mr: "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. सुनिताचे वय २४ वर्षे असून ती सध्या २८ आठवड्यांची गरोदर आहे. तिचा रक्तदाब तपासला असता बीपी १४०/९५ एवढा जास्त भरला आहे. वजन ५४ किलो आहे. हिमोग्लोबिन १०.२ ग्रॅम भरले. तिला गेल्या दोन दिवसांपासून डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे. बाळाची हालचाल व्यवस्थित आहे. मी तिला तातडीने प्राथमिक आरोग्य केंद्रात डॉक्टरांकडे जाण्यास सांगितले आणि आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला.",
  hi: "आज दिनांक 31 अक्टूबर को मैंने सुनीता शिंदे के घर भेंट की। सुनीता की उम्र 24 वर्ष है और वह 28 सप्ताह की गर्भवती हैं। उनका रक्तचाप जांचने पर बीपी 140/95 पाया गया। वजन 54 किलो है और हीमोग्लोबिन 10.2 ग्राम है। उन्हें पिछले दो दिनों से सिरदर्द हो रहा है और पैरों में हल्की सूजन है। शिशु की हलचल सामान्य है। मैंने उन्हें प्राथमिक स्वास्थ्य केंद्र जाने और आयरन की गोलियां नियमित लेने की सलाह दी।",
  en: "Today on 31st October, I visited Sunita Shinde at her home. Sunita is 24 years old and currently in her 28th week of pregnancy. Her blood pressure check revealed elevated BP of 140/95 mmHg. Weight is 54 kg. Hemoglobin is 10.2 g/dL. She complains of headache for two days and mild pedal edema. Fetal movements are normal. I advised her to urgently visit the PHC and continue daily IFA tablets."
};

export const AshaVisitFlowView: React.FC<AshaVisitFlowViewProps> = ({
  onRecordCreated,
  onOpenRecordDetail,
  lang = 'mr',
  onChangeLang
}) => {
  const t = translations[lang];
  const [step, setStep] = useState<FlowStep>('dashboard');
  
  // Data state
  const beneficiaries = mockDataService.getBeneficiaries();
  const [records, setRecords] = useState<StructuredVisit[]>(() => mockDataService.getRecords());
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary>(beneficiaries[0]);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveVolume, setLiveVolume] = useState<number>(10);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  
  // Transcript state
  const [transcriptText, setTranscriptText] = useState<string>(DEFAULT_DEMO_TRANSCRIPTS[lang]);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);

  // Sync transcript text if changed before any user recording
  useEffect(() => {
    if (!recordedAudioBlob) {
      setTranscriptText(DEFAULT_DEMO_TRANSCRIPTS[lang]);
    }
  }, [lang, recordedAudioBlob]);
  
  // Extracted clinical fields
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(28);
  const [bpSystolic, setBpSystolic] = useState<number>(140);
  const [bpDiastolic, setBpDiastolic] = useState<number>(95);
  const [weightKg, setWeightKg] = useState<number>(54.0);
  const [hemoglobin, setHemoglobin] = useState<number>(10.2);
  const [hasHeadache, setHasHeadache] = useState<boolean>(true);
  const [hasEdema, setHasEdema] = useState<boolean>(true);
  const [fetalMovementOk, setFetalMovementOk] = useState<boolean>(true);
  const [ifaGiven, setIfaGiven] = useState<boolean>(true);
  const [nextVisitDate, setNextVisitDate] = useState<string>(lang === 'en' ? "Next Monday" : "पुढील सोमवार");
  const [activeEditingField, setActiveEditingField] = useState<string | null>(null);
  const [workerConfirmed, setWorkerConfirmed] = useState<boolean>(false);
  
  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const asrLocale = lang === 'hi' ? 'hi-IN' : 'mr-IN';

  // START RECORDING
  const handleStartRecording = async () => {
    setTranscriptionError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Web Audio API volume visualizer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        audioContextRef.current = ctx;

        const dataArr = new Uint8Array(analyser.frequencyBinCount);
        const updateVol = () => {
          analyser.getByteFrequencyData(dataArr);
          let sum = 0;
          for (let i = 0; i < dataArr.length; i++) sum += dataArr[i];
          setLiveVolume(sum / dataArr.length);
          animFrameRef.current = requestAnimationFrame(updateVol);
        };
        updateVol();
      } catch (e) {
        console.warn("Audio analyser error:", e);
      }

      let mime = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mime = 'audio/webm;codecs=opus';
      else if (MediaRecorder.isTypeSupported('audio/mp4')) mime = 'audio/mp4';
      else if (MediaRecorder.isTypeSupported('audio/wav')) mime = 'audio/wav';

      const recorder = new MediaRecorder(stream, { mimeType: mime });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        setIsTranscribing(true);
        setStep('transcript');

        try {
          const res = await apiClient.transcribeAudio(blob, asrLocale);
          if (res && res.transcript) {
            setTranscriptText(res.transcript);
            runExtractionOnTranscript(res.transcript);
          }
        } catch (err: any) {
          console.error("Sarvam transcription error:", err);
          setTranscriptionError(err.message || "Transcription failed");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(200);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (err: any) {
      alert(`मायक्रोफोन परवानगी आवश्यक आहे: ${err.message || err}`);
      setIsRecording(false);
    }
  };

  // STOP RECORDING
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    setIsRecording(false);
  };

  // FILE UPLOAD HANDLER
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRecordedAudioBlob(file);
    const url = URL.createObjectURL(file);
    setRecordedAudioUrl(url);

    setIsTranscribing(true);
    setStep('transcript');

    try {
      const res = await apiClient.transcribeAudio(file, asrLocale);
      if (res && res.transcript) {
        setTranscriptText(res.transcript);
        runExtractionOnTranscript(res.transcript);
      }
    } catch (err: any) {
      console.error("Sarvam upload transcription error:", err);
      setTranscriptionError(err.message || "Upload transcription failed");
    } finally {
      setIsTranscribing(false);
    }
  };

  // EXTRACT VITALS FROM TRANSCRIPT
  const runExtractionOnTranscript = async (text: string) => {
    try {
      const ext = await apiClient.extractRecord(text, asrLocale, selectedBeneficiary.id);
      if (ext && ext.vitals_extracted) {
        const v = ext.vitals_extracted;
        if (v.bp_systolic) setBpSystolic(v.bp_systolic);
        if (v.bp_diastolic) setBpDiastolic(v.bp_diastolic);
        if (v.weight_kg) setWeightKg(v.weight_kg);
        if (v.hemoglobin_g_dl) setHemoglobin(v.hemoglobin_g_dl);
        if (v.gestational_weeks) setPregnancyWeek(v.gestational_weeks);
        if (v.headache !== undefined) setHasHeadache(v.headache);
        if (v.pedal_edema !== undefined) setHasEdema(v.pedal_edema);
      }
    } catch (err) {
      console.warn("Extraction parsing fallback:", err);
    }
  };

  // PLAY RECORDED AUDIO (with native SpeechSynthesis fallback)
  const handleTogglePlayAudio = () => {
    if (isPlayingRecorded) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingRecorded(false);
      return;
    }

    if (recordedAudioUrl) {
      try {
        const audio = new Audio(recordedAudioUrl);
        audioPlayerRef.current = audio;
        audio.onplay = () => setIsPlayingRecorded(true);
        audio.onpause = () => setIsPlayingRecorded(false);
        audio.onended = () => setIsPlayingRecorded(false);
        audio.play().catch(e => {
          console.warn("Audio element play error, falling back to speech synthesis:", e);
          playSpeechSynthFallback();
        });
        return;
      } catch {
        playSpeechSynthFallback();
        return;
      }
    }

    playSpeechSynthFallback();
  };

  const playSpeechSynthFallback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(transcriptText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'en' ? 'en-US' : 'mr-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingRecorded(true);
      utterance.onend = () => setIsPlayingRecorded(false);
      utterance.onerror = () => setIsPlayingRecorded(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // SAVE & EXPORT HANDLERS
  const handleConfirmAndSave = () => {
    const isHighRisk = bpSystolic >= 140 || bpDiastolic >= 90 || hemoglobin < 11.0;
    const newRecord: StructuredVisit = {
      recordId: `REC-2026-ANC-${Math.floor(1000 + Math.random() * 9000)}`,
      beneficiaryId: selectedBeneficiary.id,
      beneficiaryName: selectedBeneficiary.name,
      ashaId: selectedBeneficiary.assignedAshaId || 'ASHA-PUN-104',
      ashaName: 'रुक्मिणी जाधव',
      language: asrLocale,
      transcript: transcriptText,
      audioDurationSeconds: recordingSeconds || 42.0,
      recordedAt: new Date().toISOString(),
      visitType: 'ANC',
      isConfirmedByAsha: true,
      confirmedAt: new Date().toISOString(),
      anmReviewStatus: isHighRisk ? 'pending' : 'reviewed',
      measurements: {
        bloodPressureSystolic: { value: bpSystolic, unit: 'mmHg', status: bpSystolic >= 140 ? 'concerning' : 'extracted', supportingPhrase: `बीपी ${bpSystolic}/${bpDiastolic}` },
        bloodPressureDiastolic: { value: bpDiastolic, unit: 'mmHg', status: bpDiastolic >= 90 ? 'concerning' : 'extracted', supportingPhrase: `बीपी ${bpSystolic}/${bpDiastolic}` },
        weightKg: { value: weightKg, unit: 'kg', status: 'extracted', supportingPhrase: `वजन ${weightKg} किलो` },
        hemoglobinGDl: { value: hemoglobin, unit: 'g/dL', status: hemoglobin < 11.0 ? 'concerning' : 'extracted', supportingPhrase: `हिमोग्लोबिन ${hemoglobin} ग्रॅम` }
      },
      pregnancyDetails: {
        gestationalAgeWeeks: { value: pregnancyWeek, status: 'extracted', supportingPhrase: `${pregnancyWeek} आठवड्यांची` },
        trimester: { value: 2, status: 'extracted' },
        highRiskPregnancy: { value: isHighRisk, status: isHighRisk ? 'concerning' : 'extracted' }
      },
      symptoms: {
        fever: { value: false, status: 'extracted' },
        headacheOrBlurredVision: { value: hasHeadache, supportingPhrase: hasHeadache ? "डोकेदुखीचा त्रास होत आहे" : undefined, status: hasHeadache ? 'concerning' : 'extracted', isVerified: true },
        swellingPedalEdema: { value: hasEdema, supportingPhrase: hasEdema ? "पायावर हलकी सूज आहे" : undefined, status: hasEdema ? 'concerning' : 'extracted', isVerified: true },
        bleedingOrSpotting: { value: false, status: 'extracted' },
        fetalMovementNormal: { value: fetalMovementOk, supportingPhrase: "बाळाची हालचाल व्यवस्थित आहे", status: 'extracted', isVerified: true }
      },
      interventions: {
        ifaTabletsGiven: { value: ifaGiven, supportingPhrase: "आयर्नच्या गोळ्या नियमित घेण्याचा सल्ला दिला", status: 'extracted' },
        calciumTabletsGiven: { value: true, status: 'extracted' },
        referralRecommended: { value: isHighRisk, supportingPhrase: isHighRisk ? 'Elevated BP + Headache (Possible Pre-eclampsia)' : undefined, status: isHighRisk ? 'concerning' : 'extracted' },
        referralFacility: isHighRisk ? { value: 'PHC Khed-Shivapur', status: 'extracted' } : undefined
      },
      evidenceSpans: [
        { fieldName: 'pregnancyWeek', extractedValue: `${pregnancyWeek} weeks`, startChar: 40, endChar: 60, sourceText: `${pregnancyWeek} आठवड्यांची`, confidence: 0.99, status: 'extracted' },
        { fieldName: 'bloodPressure', extractedValue: `${bpSystolic}/${bpDiastolic} mmHg`, startChar: 80, endChar: 105, sourceText: `बीपी ${bpSystolic}/${bpDiastolic}`, confidence: 0.98, status: bpSystolic >= 140 ? 'concerning' : 'extracted' },
        { fieldName: 'weight', extractedValue: `${weightKg} kg`, startChar: 110, endChar: 130, sourceText: `वजन ${weightKg} किलो`, confidence: 0.99, status: 'extracted' },
        { fieldName: 'hemoglobin', extractedValue: `${hemoglobin} g/dL`, startChar: 135, endChar: 160, sourceText: `हिमोग्लोबिन ${hemoglobin} ग्रॅम`, confidence: 0.97, status: hemoglobin < 11.0 ? 'concerning' : 'extracted' }
      ],
      validationWarnings: isHighRisk ? [
        { field: 'blood_pressure', severity: 'critical', code: 'PRE_ECLAMPSIA_ALERT', messageEn: 'Elevated BP (>= 140/90) with headache flags risk of pre-eclampsia.', messageMr: 'रक्तदाब १४०/९० पेक्षा जास्त असून डोकेदुखी आहे. प्री-एक्लॅम्पसियाचा धोका असू शकतो. त्वरित रेफर करा.', messageHi: 'रक्तचाप १४०/९० से अधिक है और सिरदर्द है। तुरंत रेफर करें।' }
      ] : []
    };

    mockDataService.addRecord(newRecord);
    setRecords(mockDataService.getRecords());
    if (onRecordCreated) onRecordCreated(newRecord);
    alert(t.confirmSaveSuccess);
    setStep('dashboard');
  };

  const handleExportJSON = () => {
    const data = {
      record_id: `REC-2026-ANC-${Math.floor(1000 + Math.random() * 9000)}`,
      beneficiary_name: selectedBeneficiary.name,
      rch_id: selectedBeneficiary.rchId,
      pregnancy_week: pregnancyWeek,
      blood_pressure: `${bpSystolic}/${bpDiastolic} mmHg`,
      weight_kg: weightKg,
      hemoglobin_g_dl: hemoglobin,
      symptoms: { headache: hasHeadache, pedal_edema: hasEdema, fetal_movement: fetalMovementOk ? 'normal' : 'decreased' },
      interventions: { ifa_tablets: ifaGiven, referral: bpSystolic >= 140 ? 'PHC Medical Officer' : 'None' },
      transcript: transcriptText,
      confirmed_by_worker: workerConfirmed,
      export_timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anc_visit_record_${selectedBeneficiary.id}.json`;
    a.click();
  };

  const handleExportCSV = () => {
    const headers = "Beneficiary,RCH_ID,Age,Pregnancy_Week,BP,Weight_KG,Hb_GDL,Headache,Edema,Next_Visit,Confirmed\n";
    const row = `"${selectedBeneficiary.name}","${selectedBeneficiary.rchId}",${selectedBeneficiary.age},${pregnancyWeek},"${bpSystolic}/${bpDiastolic}",${weightKg},${hemoglobin},${hasHeadache},${hasEdema},"${nextVisitDate}",${workerConfirmed}\n`;
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit_record_${selectedBeneficiary.id}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const r = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
  };

  const STEPS = [
    { id: 'dashboard',    label: t.stepDashboard },
    { id: 'recording',   label: t.stepRecording },
    { id: 'transcript',  label: t.stepTranscript },
    { id: 'structured',  label: t.stepEvidence },
    { id: 'confirmation',label: t.stepConfirm },
  ];
  const stepOrder = STEPS.map(s => s.id);
  const currentStepIdx = stepOrder.indexOf(step);

  return (
    <div className="w-full space-y-6 pb-20 font-sans text-slate-900">
      {/* ── PROGRESS STEPPER ── */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-4 sm:p-6">
        {/* Mobile: pill row with clear text */}
        <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STEPS.map((s, idx) => {
            const isActive = step === s.id;
            const isDone = currentStepIdx > idx;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id as FlowStep)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive ? 'bg-cyan-700 text-white shadow-brand' :
                  isDone   ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400' :
                             'text-slate-800 bg-slate-100 border border-slate-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isActive ? 'bg-white text-cyan-800' :
                  isDone   ? 'bg-emerald-700 text-white' :
                             'bg-slate-300 text-slate-900'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop: full stepper with connectors and bold labels */}
        <div className="hidden sm:flex items-center justify-between">
          {STEPS.map((s, idx) => {
            const isActive = step === s.id;
            const isDone = currentStepIdx > idx;
            const isLast = idx === STEPS.length - 1;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setStep(s.id as FlowStep)}
                  className="flex flex-col items-center gap-2 cursor-pointer transition-all group shrink-0 px-2"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    isActive ? 'bg-cyan-700 text-white shadow-brand ring-4 ring-cyan-200 scale-110' :
                    isDone   ? 'bg-emerald-600 text-white shadow-sm' :
                               'bg-slate-200 text-slate-700 group-hover:bg-slate-300 border border-slate-300'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs sm:text-sm font-black leading-tight whitespace-nowrap ${
                      isActive ? 'text-cyan-900' : isDone ? 'text-emerald-900' : 'text-slate-700'
                    }`}>{s.label}</div>
                  </div>
                </button>
                {!isLast && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                    isDone ? 'bg-gradient-to-r from-emerald-500 to-cyan-600' : 'bg-slate-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── SCREEN 1 — DASHBOARD ── */}
      {step === 'dashboard' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C4A6E] via-[#0284C7] to-[#047857] p-6 sm:p-10 text-white shadow-brand-lg">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-xs sm:text-sm font-bold backdrop-blur-md mb-4 border border-white/30 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.appTitle} • {t.tagline}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-sm font-devanagari">
                    {t.heroTitle}
                  </h1>
                  <p className="mt-3 max-w-2xl text-xs sm:text-sm text-cyan-50 font-devanagari font-medium leading-relaxed drop-shadow-sm">
                    {t.heroSubtitle}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setStep('recording')}
                    className="px-6 py-4 rounded-2xl bg-white text-cyan-900 font-extrabold text-sm sm:text-base shadow-xl hover:bg-cyan-50 flex items-center gap-3 transition-all active:scale-95 cursor-pointer border border-white"
                  >
                    <Mic className="w-6 h-6 text-cyan-700 animate-pulse" />
                    <span>{t.recordNewVisit}</span>
                    <ArrowRight className="w-5 h-5 text-cyan-700" />
                  </button>
                  <div className="text-xs sm:text-sm text-white font-bold flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                    <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span>Human-in-the-Loop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-clinical-card card-hover">
              <p className="text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider">{t.totalRecordsCreated}</p>
              <div className="text-3xl sm:text-4xl font-black text-slate-950 mt-1">{records.length}</div>
              <p className="text-xs sm:text-sm text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                <span>{t.voiceVerified}</span>
              </p>
            </div>
            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 shadow-clinical-card card-hover">
              <p className="text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wider">{t.draftsAwaiting}</p>
              <div className="text-3xl sm:text-4xl font-black text-amber-950 mt-1">
                {records.filter(r => r.anmReviewStatus === 'pending').length}
              </div>
              <p className="text-xs sm:text-sm text-amber-800 font-bold mt-1.5">{t.pendingReview}</p>
            </div>
            <div className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-300 shadow-clinical-card card-hover">
              <p className="text-xs sm:text-sm font-extrabold text-rose-900 uppercase tracking-wider">{t.highRiskAlerts}</p>
              <div className="text-3xl sm:text-4xl font-black text-rose-800 mt-1">
                {records.filter(r => (r.measurements.bloodPressureSystolic.value || 0) >= 140).length}
              </div>
              <p className="text-xs sm:text-sm text-rose-800 font-bold mt-1.5">{t.highRisk}</p>
            </div>
            <div className="bg-cyan-50 p-5 rounded-2xl border-2 border-cyan-300 shadow-clinical-card card-hover">
              <p className="text-xs sm:text-sm font-extrabold text-cyan-900 uppercase tracking-wider">{t.registeredBeneficiaries}</p>
              <div className="text-3xl sm:text-4xl font-black text-cyan-900 mt-1">{beneficiaries.length}</div>
              <p className="text-xs sm:text-sm text-cyan-800 font-bold mt-1.5">ANC Registered Mothers</p>
            </div>
          </div>

          {/* Quick Beneficiary Selector */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-clinical-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-950 flex items-center gap-2">
                <Heart className="w-5 h-5 text-cyan-700" />
                <span>{t.selectBeneficiary}</span>
              </h3>
              <span className="text-xs sm:text-sm text-cyan-900 font-black bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300">
                {beneficiaries.length} Registered
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {beneficiaries.map((b) => {
                const isSelected = selectedBeneficiary.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBeneficiary(b)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer card-hover ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50 ring-3 ring-cyan-300 shadow-md'
                        : 'border-slate-300 hover:border-cyan-500 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-slate-950 leading-tight">{b.name}</span>
                      {b.highRisk && (
                        <span className="text-xs bg-rose-200 text-rose-950 px-2 py-0.5 rounded-full font-black shrink-0 border border-rose-300">
                          ⚠ {t.highRisk}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 font-devanagari font-bold mt-1">
                      {b.nameMr} • {b.age} {lang === 'en' ? 'years' : 'वर्षे'}
                    </div>
                    <div className="text-xs text-slate-700 mt-1 font-mono font-bold">RCH: {b.rchId}</div>
                    {isSelected && (
                      <div className="mt-2 text-xs text-cyan-800 font-black flex items-center gap-1.5 pt-1.5 border-t border-cyan-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-700" /> {lang === 'en' ? 'Selected for Visit' : 'घरभेटीसाठी निवडले'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Records Table */}
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-clinical-card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b-2 border-slate-200 bg-slate-50">
              <h3 className="font-black text-sm sm:text-base text-slate-950">{t.recentRecords}</h3>
              <span className="text-xs sm:text-sm text-emerald-800 font-black flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {t.liveSynced}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase border-b border-slate-300">
                  <tr>
                    <th className="px-5 py-3.5 whitespace-nowrap">Record ID</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">{t.beneficiaries}</th>
                    <th className="px-4 py-3.5 whitespace-nowrap hidden sm:table-cell">{t.gestationalAge}</th>
                    <th className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">{t.bloodPressure}</th>
                    <th className="px-4 py-3.5 whitespace-nowrap hidden lg:table-cell">{t.weight}</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">{t.statusHeader}</th>
                    <th className="px-5 py-3.5 text-right whitespace-nowrap">{t.actionHeader}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {records.map((r) => (
                    <tr key={r.recordId} className="hover:bg-slate-100/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-cyan-800">{r.recordId}</td>
                      <td className="px-4 py-4 font-extrabold text-slate-950">{r.beneficiaryName}</td>
                      <td className="px-4 py-4 hidden sm:table-cell font-bold text-slate-900">
                        {r.pregnancyDetails?.gestationalAgeWeeks?.value ? `${r.pregnancyDetails.gestationalAgeWeeks.value}w` : '28w'}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell font-bold">
                        <span className={((r.measurements.bloodPressureSystolic.value || 0) >= 140) ? 'text-rose-700 font-black' : 'text-slate-900'}>
                          {r.measurements.bloodPressureSystolic.value}/{r.measurements.bloodPressureDiastolic.value} mmHg
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell font-bold text-slate-900">{r.measurements.weightKg.value} kg</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                          r.anmReviewStatus === 'pending'
                            ? 'bg-amber-100 text-amber-950 border-amber-300'
                            : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        }`}>
                          {r.anmReviewStatus === 'pending' ? t.pending : t.approved}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            if (onOpenRecordDetail) onOpenRecordDetail(r);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-100 text-cyan-900 font-black hover:bg-cyan-700 hover:text-white transition-colors cursor-pointer border border-cyan-300"
                        >
                          {t.inspect}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SCREEN 2 — VOICE RECORDING ── */}
      {step === 'recording' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: Live Recorder Box */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('dashboard')}
                className="px-4 py-2 rounded-xl border-2 border-slate-300 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backToDashboardBtn}
              </button>

              {/* Language toggle: Directly triggers parent onChangeLang */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-200 rounded-xl border border-slate-300">
                <button
                  disabled={isRecording}
                  onClick={() => onChangeLang?.('mr')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    lang === 'mr' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-800 hover:text-slate-950'
                  }`}
                >
                  मराठी
                </button>
                <button
                  disabled={isRecording}
                  onClick={() => onChangeLang?.('hi')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    lang === 'hi' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-800 hover:text-slate-950'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  disabled={isRecording}
                  onClick={() => onChangeLang?.('en')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-cyan-700 text-white shadow-sm' : 'text-slate-800 hover:text-slate-950'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Mother context pill */}
            <div className="p-3 rounded-xl bg-cyan-100 border-2 border-cyan-300 text-xs sm:text-sm text-cyan-950 font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 text-cyan-700 shrink-0" />
              <span>{t.maternalBeneficiaryLabel}: {selectedBeneficiary.name} ({selectedBeneficiary.nameMr}) • RCH ID: {selectedBeneficiary.rchId}</span>
            </div>

            {/* Timer */}
            <div className="text-center space-y-2">
              <div className="text-6xl sm:text-7xl font-mono font-black text-slate-950 tracking-widest tabular-nums drop-shadow-xs">
                {formatTimer(recordingSeconds)}
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-800">
                {isRecording ? (
                  <span className="text-red-700 flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                    {t.listeningNotice}
                  </span>
                ) : (
                  t.tapToRecord
                )}
              </p>
            </div>

            {/* Waveform visualizer */}
            <div className="h-20 flex items-center justify-center gap-1.5 px-4 bg-slate-100 rounded-xl border border-slate-300">
              {[14, 38, 62, 24, 80, 50, 70, 32, 68, 28, 86, 44, 72, 24, 56, 18, 42, 60, 30, 76].map((baseH, i) => {
                const h = isRecording
                  ? Math.min(64, Math.max(8, (baseH * 0.3) + (liveVolume * 0.9) + (Math.sin(recordingSeconds * 4 + i) * 10)))
                  : 8;
                return (
                  <div
                    key={i}
                    className={`w-2 rounded-full transition-all duration-100 ${
                      isRecording ? 'bg-gradient-to-t from-cyan-700 to-cyan-500' : 'bg-slate-300'
                    }`}
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>

            {/* Big Mic Button */}
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative">
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-500/30 mic-ring" />
                    <div className="absolute inset-0 rounded-full bg-red-500/20 mic-ring" style={{ animationDelay: '0.4s' }} />
                  </>
                )}
                <button
                  type="button"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all transform active:scale-95 cursor-pointer relative z-10 ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700 text-white ring-8 ring-red-200'
                      : 'bg-cyan-700 hover:bg-cyan-800 text-white ring-8 ring-cyan-200 hover:scale-105'
                  }`}
                >
                  {isRecording ? <Square className="w-12 h-12 fill-current" /> : <Mic className="w-14 h-14" />}
                </button>
              </div>
              <span className="text-sm font-black text-slate-900">
                {isRecording ? t.tapToStop : t.startRecording}
              </span>
            </div>

            {/* Upload + Demo */}
            <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-slate-300 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-cyan-700" />
                <span>{t.uploadAudio}</span>
              </button>
              <button
                onClick={() => {
                  const demo = DEFAULT_DEMO_TRANSCRIPTS[lang];
                  setTranscriptText(demo);
                  runExtractionOnTranscript(demo);
                  setStep('transcript');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs sm:text-sm font-black hover:bg-cyan-200 cursor-pointer transition-colors"
              >
                {t.useDemoSample}
              </button>
            </div>
          </div>

          {/* RIGHT: Guide panel with high readability */}
          <div className="space-y-4">
            <div className="bg-cyan-50 p-6 rounded-2xl border-2 border-cyan-300 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-base text-slate-950">{t.whatToSayTitle}</div>
                  <div className="text-xs text-slate-700 font-bold">{t.whatToSaySubtitle}</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm font-devanagari">
                {[
                  { label: t.gestationalAge, example: lang === 'hi' ? '"28 सप्ताह की गर्भवती हैं"' : lang === 'en' ? '"28 weeks of pregnancy"' : '"२८ आठवड्यांची गरोदर आहे"' },
                  { label: t.bloodPressure, example: lang === 'hi' ? '"बीपी 140 बटा 95 है"' : lang === 'en' ? '"BP 140 over 95 mmHg"' : '"बीपी १४०/९५ एवढा जास्त भरला आहे"' },
                  { label: t.weight, example: lang === 'hi' ? '"वजन 54 किलो है"' : lang === 'en' ? '"Weight is 54 kg"' : '"वजन ५४ किलो आहे"' },
                  { label: t.hemoglobin, example: lang === 'hi' ? '"हीमोग्लोबिन 10.2 ग्राम है"' : lang === 'en' ? '"Hemoglobin is 10.2 g/dL"' : '"हिमोग्लोबिन १०.२ ग्रॅम भरले"' },
                  { label: t.dangerSigns, example: lang === 'hi' ? '"सिरदर्द है और पैरों में हल्की सूजन है"' : lang === 'en' ? '"Headache and mild pedal edema"' : '"डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे"' },
                  { label: t.referral, example: lang === 'hi' ? '"प्राथमिक स्वास्थ्य केंद्र जाने को कहा"' : lang === 'en' ? '"Advised urgent visit to PHC"' : '"प्राथमिक आरोग्य केंद्रात जाण्यास सांगितले"' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-cyan-200">
                    <span className="font-black text-cyan-900 block">{item.label}:</span>
                    <div className="text-slate-950 font-bold text-xs sm:text-sm mt-0.5">
                      {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips card */}
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-clinical-card space-y-3">
              <div className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wider">{t.recordingTipsTitle}</div>
              {[t.tip1, t.tip2, t.tip3, t.tip4].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 font-devanagari">
                  <div className="w-5 h-5 rounded-full bg-cyan-700 text-white font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {i + 1}
                  </div>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCREEN 3 — TRANSCRIPT REVIEW ── */}
      {step === 'transcript' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-slate-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center border border-cyan-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 font-devanagari">
                  {t.verbatimTranscriptTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">{t.verbatimSubtitle}</p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 font-black border border-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>Sarvam Saaras v3 ASR ({lang === 'hi' ? 'हिन्दी' : lang === 'mr' ? 'मराठी' : 'English'})</span>
            </span>
          </div>

          {isTranscribing ? (
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-3 bg-cyan-50 rounded-2xl border-2 border-cyan-200">
              <Loader2 className="w-12 h-12 text-cyan-700 animate-spin" />
              <div className="font-black text-base sm:text-lg text-slate-950 font-devanagari">
                {t.transcribingNotice}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-devanagari font-bold max-w-md">
                {lang === 'hi'
                  ? 'हिंदी उच्चारण और चिकित्सा शब्दों (BP, वजन, दवाएं) का सटीक टेक्स्ट में रूपांतरण जारी है।'
                  : 'मराठी उच्चारांचे आणि वैद्यकीय शब्दांचे (BP, वजन, गोळ्या) अचूक शब्दांत रूपांतर होत आहे.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Audio player + editable transcript */}
              <div className="lg:col-span-8 space-y-4">
                {/* Audio Playback Bar */}
                <div className="p-4 bg-slate-100 rounded-2xl border-2 border-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlayAudio}
                      className="w-12 h-12 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      {isPlayingRecorded ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div>
                      <span className="font-extrabold text-sm sm:text-base text-slate-950">
                        {isPlayingRecorded ? t.playingAudio : t.playRecording}
                      </span>
                      <p className="text-slate-700 font-mono text-xs font-bold">{recordingSeconds || 42}s • 16 kHz Mono PCM</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full font-black">
                    ✓ {recordedAudioUrl ? 'Audio Captured' : 'Voice Synthesized'}
                  </span>
                </div>

                {/* Transcript Display / Edit Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-black text-slate-900">{t.editableTranscript}</span>
                    <button
                      onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                      className="text-cyan-800 hover:text-cyan-950 font-black flex items-center gap-1.5 cursor-pointer bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200"
                    >
                      <Edit3 className="w-4 h-4 text-cyan-700" />
                      <span>{isEditingTranscript ? t.doneEditBtn : t.editTranscriptBtn}</span>
                    </button>
                  </div>

                  {isEditingTranscript ? (
                    <textarea
                      value={transcriptText}
                      onChange={(e) => setTranscriptText(e.target.value)}
                      rows={6}
                      className="w-full p-4 rounded-2xl border-2 border-cyan-600 font-devanagari text-base leading-relaxed text-slate-950 focus:outline-none shadow-md font-medium"
                    />
                  ) : (
                    <div className="p-5 rounded-2xl bg-white border-2 border-slate-300 text-slate-950 font-devanagari text-base sm:text-lg leading-relaxed select-text shadow-sm font-medium">
                      "{transcriptText}"
                    </div>
                  )}
                </div>

                {transcriptionError && (
                  <div className="p-3.5 bg-amber-100 rounded-xl border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-center gap-2 font-devanagari font-bold">
                    <AlertCircle className="w-5 h-5 text-amber-800 shrink-0" />
                    <span>{transcriptionError}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-700 font-devanagari font-bold">
                  * {lang === 'hi' 
                      ? 'सुझाव: उच्चारण में कोई त्रुटि होने पर ऊपर दिए गए संपादन बटन से सुधार करें। अगले चरण में एआई इससे संरचित डेटा निकालेगा।'
                      : 'टीप: उच्चारातील कोणतीही त्रुटी असल्यास वरील एडिट बटण वापरून शब्द दुरुस्त करा. पुढील पायरीवर AI यातून माहिती काढेल.'}
                </p>
              </div>

              {/* Right Column: Beneficiary summary card */}
              <div className="lg:col-span-4 bg-slate-100 p-5 rounded-2xl border-2 border-slate-300 space-y-4">
                <div className="flex items-center gap-2 text-cyan-900 font-black text-sm">
                  <Heart className="w-5 h-5 text-cyan-700" />
                  <span>{t.maternalBeneficiaryLabel}</span>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-300">
                    <span className="text-slate-700 font-bold">Name:</span>
                    <span className="font-black text-slate-950">{selectedBeneficiary.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-300">
                    <span className="text-slate-700 font-bold">Age:</span>
                    <span className="font-black text-slate-950">{selectedBeneficiary.age} {lang === 'en' ? 'years' : 'वर्षे'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-300">
                    <span className="text-slate-700 font-bold">RCH ID:</span>
                    <span className="font-mono font-black text-slate-950">{selectedBeneficiary.rchId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-300">
                    <span className="text-slate-700 font-bold">Village:</span>
                    <span className="font-black text-slate-950">{selectedBeneficiary.village}</span>
                  </div>
                </div>
                <div className="p-3.5 bg-cyan-50 rounded-xl border border-cyan-200 text-xs sm:text-sm text-cyan-950 leading-relaxed font-devanagari font-bold">
                  {lang === 'hi'
                    ? 'एआई इस बातचीत से रक्तचाप, वजन, गर्भ के सप्ताह व लक्षण निकालकर सीधा प्रमाण जोड़ेगा।'
                    : 'AI या संभाषणातून रक्तदाब, वजन, गर्भधारणा आठवडा व लक्षणे शोधून थेट पुरावा जोडेल.'}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setStep('recording')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-slate-300 text-xs sm:text-sm font-extrabold text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              {t.reRecordBtn}
            </button>

            <button
              disabled={isTranscribing}
              onClick={() => {
                runExtractionOnTranscript(transcriptText);
                setStep('structured');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-black text-sm sm:text-base shadow-brand flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.extractRecordBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── SCREEN 4 — STRUCTURED RECORD & EVIDENCE MAPPING (MAIN USP) ── */}
      {step === 'structured' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-xs sm:text-sm font-black text-cyan-900 mb-1 border border-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-700" />
                <span>{t.evidencePill}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                {t.evidenceTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-devanagari font-bold mt-1">
                {t.evidenceSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setStep('transcript')}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                {t.backToTranscriptBtn}
              </button>
              <button
                onClick={() => setStep('confirmation')}
                className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-xs sm:text-sm shadow-brand flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span>{t.proceedToConfirmBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clinical Danger Sign Alert Banner */}
          {(bpSystolic >= 140 || bpDiastolic >= 90 || hemoglobin < 11.0) && (
            <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-rose-950 font-black text-sm sm:text-base">
                <AlertTriangle className="w-5 h-5 text-rose-700 animate-bounce" />
                <span>{t.dangerSigns}:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                {bpSystolic >= 140 && (
                  <div className="p-3.5 rounded-xl bg-white border border-rose-300 text-rose-950 font-bold font-devanagari">
                    • <strong>{t.bloodPressure} ({bpSystolic}/{bpDiastolic} mmHg):</strong> {lang === 'hi' ? 'उच्च रक्तचाप! प्री-एक्लेम्पसिया का खतरा। तुरंत पीएचसी रेफर करें।' : 'प्री-एक्लॅम्पसियाचा धोका असू शकतो. त्वरित PHC संदर्भ द्या.'}
                  </div>
                )}
                {hemoglobin < 11.0 && (
                  <div className="p-3.5 rounded-xl bg-white border border-rose-300 text-rose-950 font-bold font-devanagari">
                    • <strong>{t.hemoglobin} ({hemoglobin} g/dL):</strong> {lang === 'hi' ? 'एनीमिया का जोखिम। आईएफए गोलियों का नियमित सेवन कराएं।' : 'अॅनिमियाचा धोका. IFA गोळ्यांचे नियमित सेवन व आहार सल्ला आवश्यक.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Side-by-side Evidence Mapping Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Highlighted Spoken Transcript */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
                <span className="font-black text-xs sm:text-sm text-slate-950 uppercase tracking-wider">
                  {t.verbatimTranscriptTitle}
                </span>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                  Sarvam Saaras
                </span>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 font-devanagari text-sm sm:text-base leading-relaxed text-slate-950 font-medium select-text">
                "{transcriptText}"
              </div>

              <div className="p-3.5 bg-cyan-50 rounded-xl border border-cyan-200 text-xs sm:text-sm text-cyan-950 leading-relaxed font-bold">
                <strong>💡 {t.evidencePrinciple}</strong>
              </div>
            </div>

            {/* Right: The Structured Fields & Evidence Table */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200">
                <h3 className="font-black text-sm sm:text-base text-slate-950">{t.aiStructuredRecord}</h3>
                <span className="text-xs sm:text-sm text-slate-700 font-bold">ASHA Review & Edit</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-300">
                    <tr>
                      <th className="p-3">{t.fieldHeader}</th>
                      <th className="p-3">{t.valueHeader}</th>
                      <th className="p-3">{t.evidenceHeader}</th>
                      <th className="p-3">{t.statusHeader}</th>
                      <th className="p-3 text-right">{t.actionHeader}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-semibold">
                    {/* Field 1: Pregnancy Week */}
                    <tr className="hover:bg-slate-50 border-l-4 border-emerald-600">
                      <td className="p-3 font-extrabold text-slate-950">{t.gestationalAge}</td>
                      <td className="p-3 font-black text-cyan-800 text-sm">
                        {activeEditingField === 'week' ? (
                          <input 
                            type="number" 
                            value={pregnancyWeek} 
                            onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                            className="w-16 p-1 border-2 border-cyan-600 rounded font-bold"
                          />
                        ) : (
                          `${pregnancyWeek} ${lang === 'en' ? 'weeks' : 'आठवडे'}`
                        )}
                      </td>
                      <td className="p-3 font-devanagari text-cyan-950 bg-cyan-50 font-bold rounded">
                        "{pregnancyWeek} आठवड्यांची गरोदर आहे"
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
                          {t.verifiedStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => setActiveEditingField(activeEditingField === 'week' ? null : 'week')}
                          className="text-cyan-800 hover:text-cyan-950 hover:underline font-black cursor-pointer"
                        >
                          {activeEditingField === 'week' ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>

                    {/* Field 2: Blood Pressure */}
                    <tr className="hover:bg-slate-50 border-l-4 border-rose-600">
                      <td className="p-3 font-extrabold text-slate-950">{t.bloodPressure}</td>
                      <td className="p-3 font-black text-rose-800 text-sm">
                        {activeEditingField === 'bp' ? (
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              value={bpSystolic} 
                              onChange={(e) => setBpSystolic(Number(e.target.value))}
                              className="w-14 p-1 border-2 border-rose-500 rounded font-bold"
                            />
                            <span>/</span>
                            <input 
                              type="number" 
                              value={bpDiastolic} 
                              onChange={(e) => setBpDiastolic(Number(e.target.value))}
                              className="w-14 p-1 border-2 border-rose-500 rounded font-bold"
                            />
                          </div>
                        ) : (
                          `${bpSystolic}/${bpDiastolic} mmHg`
                        )}
                      </td>
                      <td className="p-3 font-devanagari text-rose-950 bg-rose-100 font-bold rounded">
                        "बीपी {bpSystolic}/{bpDiastolic} एवढा जास्त भरला आहे"
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-rose-200 text-rose-950 font-black text-xs border border-rose-300">
                          ⚠️ {t.highRisk}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => setActiveEditingField(activeEditingField === 'bp' ? null : 'bp')}
                          className="text-cyan-800 hover:text-cyan-950 hover:underline font-black cursor-pointer"
                        >
                          {activeEditingField === 'bp' ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>

                    {/* Field 3: Maternal Weight */}
                    <tr className="hover:bg-slate-50 border-l-4 border-emerald-600">
                      <td className="p-3 font-extrabold text-slate-950">{t.weight}</td>
                      <td className="p-3 font-black text-slate-950 text-sm">
                        {activeEditingField === 'wt' ? (
                          <input 
                            type="number" 
                            value={weightKg} 
                            onChange={(e) => setWeightKg(Number(e.target.value))}
                            className="w-16 p-1 border-2 border-slate-400 rounded font-bold"
                          />
                        ) : (
                          `${weightKg} kg`
                        )}
                      </td>
                      <td className="p-3 font-devanagari text-cyan-950 bg-cyan-50 font-bold rounded">
                        "वजन {weightKg} किलो आहे"
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
                          {t.verifiedStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => setActiveEditingField(activeEditingField === 'wt' ? null : 'wt')}
                          className="text-cyan-800 hover:text-cyan-950 hover:underline font-black cursor-pointer"
                        >
                          {activeEditingField === 'wt' ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>

                    {/* Field 4: Hemoglobin */}
                    <tr className="hover:bg-slate-50 border-l-4 border-amber-500">
                      <td className="p-3 font-extrabold text-slate-950">{t.hemoglobin}</td>
                      <td className="p-3 font-black text-amber-900 text-sm">
                        {activeEditingField === 'hb' ? (
                          <input 
                            type="number" 
                            step="0.1"
                            value={hemoglobin} 
                            onChange={(e) => setHemoglobin(Number(e.target.value))}
                            className="w-16 p-1 border-2 border-amber-500 rounded font-bold"
                          />
                        ) : (
                          `${hemoglobin} g/dL`
                        )}
                      </td>
                      <td className="p-3 font-devanagari text-cyan-950 bg-cyan-50 font-bold rounded">
                        "हिमोग्लोबिन {hemoglobin} ग्रॅम भरले"
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-300">
                          ⚠️ Mild Anemia
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => setActiveEditingField(activeEditingField === 'hb' ? null : 'hb')}
                          className="text-cyan-800 hover:text-cyan-950 hover:underline font-black cursor-pointer"
                        >
                          {activeEditingField === 'hb' ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>

                    {/* Field 5: Reported Symptoms */}
                    <tr className="hover:bg-slate-50 border-l-4 border-rose-600">
                      <td className="p-3 font-extrabold text-slate-950">{t.headache} & {t.pedalEdema}</td>
                      <td className="p-3 font-black text-rose-800">
                        {lang === 'hi' ? 'सिरदर्द, पैरों में सूजन' : lang === 'en' ? 'Headache, Pedal Edema' : 'डोकेदुखी, पायावर सूज'}
                      </td>
                      <td className="p-3 font-devanagari text-rose-950 bg-rose-50 font-bold rounded">
                        "डोकेदुखीचा त्रास होत आहे आणि पायावर हलकी सूज आहे"
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-rose-200 text-rose-950 font-black text-xs border border-rose-300">
                          ⚠️ {t.highRisk}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-slate-400">—</span>
                      </td>
                    </tr>

                    {/* Field 6: Follow-up & Next Visit */}
                    <tr className="hover:bg-slate-50 border-l-4 border-cyan-600">
                      <td className="p-3 font-extrabold text-slate-950">{t.referral}</td>
                      <td className="p-3 font-black text-slate-950">
                        {nextVisitDate}
                      </td>
                      <td className="p-3 font-devanagari text-cyan-950 bg-cyan-50 font-bold rounded">
                        "प्राथमिक आरोग्य केंद्रात जाण्यास सांगितले"
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-950 font-black text-xs border border-cyan-300">
                          {t.pending}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => {
                            const val = prompt(lang === 'hi' ? "अगली विज़िट या संदर्भ योजना दर्ज करें:" : "Enter next visit plan / date:", nextVisitDate);
                            if (val) setNextVisitDate(val);
                          }}
                          className="text-cyan-800 hover:text-cyan-950 hover:underline font-black cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCREEN 5 — CONFIRMATION & 1-CLICK EXPORT ── */}
      {step === 'confirmation' && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-slate-300 shadow-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 border-b-2 border-slate-200 pb-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs border border-emerald-300">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-devanagari">
              {t.confirmTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-bold max-w-lg mx-auto">
              {t.confirmSubtitle}
            </p>
          </div>

          {/* Maternal Encounter Summary Card */}
          <div className="p-6 rounded-2xl bg-slate-100 border-2 border-slate-300 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-300 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">{t.maternalBeneficiaryLabel}</span>
                <h4 className="font-black text-lg text-slate-950 mt-0.5">{selectedBeneficiary.name} ({selectedBeneficiary.nameMr})</h4>
                <p className="text-xs sm:text-sm text-slate-800 font-bold">RCH: {selectedBeneficiary.rchId} • {selectedBeneficiary.age} {lang === 'en' ? 'years' : 'वर्षे'}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">{t.jurisdictionLabel}</span>
                <div className="text-sm font-black text-slate-950">{selectedBeneficiary.village}</div>
                <p className="text-xs sm:text-sm text-slate-800 font-bold">{selectedBeneficiary.subCenter}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-xl bg-white border-2 border-slate-300 shadow-xs">
                <span className="text-slate-700 text-xs font-bold font-devanagari">{t.gestationalAge}</span>
                <div className="font-black text-base text-slate-950 mt-1">{pregnancyWeek} {lang === 'en' ? 'weeks' : 'आठवडे'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border-2 border-slate-300 shadow-xs">
                <span className="text-slate-700 text-xs font-bold font-devanagari">{t.bloodPressure}</span>
                <div className={`font-black text-base mt-1 ${bpSystolic >= 140 ? 'text-rose-700' : 'text-slate-950'}`}>
                  {bpSystolic}/{bpDiastolic} mmHg
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border-2 border-slate-300 shadow-xs">
                <span className="text-slate-700 text-xs font-bold font-devanagari">{t.weight}</span>
                <div className="font-black text-base text-slate-950 mt-1">{weightKg} kg</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border-2 border-slate-300 shadow-xs">
                <span className="text-slate-700 text-xs font-bold font-devanagari">{t.hemoglobin}</span>
                <div className="font-black text-base text-amber-900 mt-1">{hemoglobin} g/dL</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border-2 border-slate-300 text-xs sm:text-sm space-y-1.5 font-devanagari">
              <div className="font-black text-slate-950 text-sm">{t.complaintsTriageLabel}</div>
              <p className="text-slate-900 font-bold">
                • {t.headache}: {hasHeadache ? (lang === 'hi' ? "हाँ (गंभीर)" : "आहे (Severe)") : (lang === 'hi' ? "नहीं" : "नाही")} • {t.pedalEdema}: {hasEdema ? (lang === 'hi' ? "हाँ (पैरों में सूजन)" : "आहे (Bilateral)") : (lang === 'hi' ? "नहीं" : "नाही")}
              </p>
              <p className="text-rose-900 font-black">
                • {t.referral}: {lang === 'hi' ? "प्राथमिक स्वास्थ्य केंद्र खेड शिवापुर (चिकित्सा अधिकारी परामर्श आवश्यक)।" : "प्राथमिक आरोग्य केंद्र खेड शिवापूर (Medical Officer follow-up required)."}
              </p>
            </div>
          </div>

          {/* Mandatory Human Sign-off Checkbox */}
          <div className="p-5 rounded-2xl bg-cyan-50 border-2 border-cyan-400 flex items-start gap-3.5 shadow-sm">
            <input
              type="checkbox"
              id="workerSignOff"
              checked={workerConfirmed}
              onChange={(e) => setWorkerConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 text-cyan-700 rounded border-2 border-cyan-500 focus:ring-cyan-500 cursor-pointer"
            />
            <label htmlFor="workerSignOff" className="text-xs sm:text-sm text-slate-950 font-black font-devanagari leading-relaxed cursor-pointer">
              {t.humanSignoffNotice}
            </label>
          </div>

          {/* 1-Click Export Bar (Roadmap Phase 9) */}
          <div className="space-y-3 pt-3 border-t-2 border-slate-200">
            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider block text-center">
              {t.exportPhaseTitle}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                onClick={handleExportPDF}
                className="p-3.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-xs sm:text-sm font-black text-slate-900 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Download className="w-5 h-5 text-cyan-700" />
                <span>{t.downloadPdf}</span>
              </button>
              
              <button
                onClick={handleExportJSON}
                className="p-3.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-xs sm:text-sm font-black text-slate-900 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <FileDown className="w-5 h-5 text-emerald-700" />
                <span>{t.downloadJson}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-3.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-xs sm:text-sm font-black text-slate-900 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <FileSpreadsheet className="w-5 h-5 text-sky-700" />
                <span>{t.downloadCsv}</span>
              </button>
            </div>
          </div>

          {/* Final Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 pt-4 border-t-2 border-slate-200">
            <button
              onClick={() => setStep('structured')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border-2 border-slate-300 text-xs sm:text-sm font-black text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              {t.backToEvidenceBtn}
            </button>

            <button
              disabled={!workerConfirmed}
              onClick={handleConfirmAndSave}
              className={`w-full sm:w-auto px-9 py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                workerConfirmed 
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white ring-4 ring-emerald-200 active:scale-95' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-6 h-6" />
              <span>{t.saveToDbBtn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
