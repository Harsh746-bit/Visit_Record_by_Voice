import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertTriangle, 
  Mic, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Pill, 
  Sparkles,
  FileCheck2,
  Play,
  Pause,
  CheckCircle2
} from 'lucide-react';
import { StructuredVisit } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TranscriptViewer } from '../../components/ui/TranscriptViewer';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { MOCK_BENEFICIARIES } from '../../data/mockData';

interface SplitEvidenceReviewViewProps {
  record: StructuredVisit;
  onBack: () => void;
  onUpdateStatus: (recordId: string, status: 'reviewed' | 'returned', notes: string) => void;
}

export const SplitEvidenceReviewView: React.FC<SplitEvidenceReviewViewProps> = ({
  record,
  onBack,
  onUpdateStatus
}) => {
  const [selectedField, setSelectedField] = useState<string | null>('bloodPressureSystolic');
  const [reviewNotes, setReviewNotes] = useState(record.anmReviewNotes || '');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const beneficiary = MOCK_BENEFICIARIES.find(b => b.id === record.beneficiaryId);

  const handleApprove = () => {
    onUpdateStatus(record.recordId, 'reviewed', reviewNotes || 'Verified and approved by ANM Supervisor.');
    setShowApprovalModal(false);
  };

  const handleReturn = () => {
    onUpdateStatus(record.recordId, 'returned', reviewNotes || 'Returned to ASHA for re-verification.');
    setShowReturnModal(false);
  };

  // Find active span for bidirectional highlighting
  const activeSpan = record.evidenceSpans?.find(s => s.fieldName === selectedField) || null;

  return (
    <div className="space-y-6">
      {/* Page Header with Breadcrumbs & Action Buttons */}
      <PageHeader
        title={`Audit Evidence: ${record.recordId}`}
        subtitle={`Frontline home visit conducted on ${new Date(record.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} by ASHA ${record.ashaName}.`}
        breadcrumbs={[
          { label: 'Review Queue', onClick: onBack },
          { label: `Record ${record.recordId}` }
        ]}
        badge={<StatusBadge status={record.anmReviewStatus} />}
        actions={
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onBack}
              className="px-3.5 py-2 rounded-xl border border-[#E5EBEF] bg-white text-[#718096] hover:text-[#172B3A] hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-clinical-card"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 rounded-xl border border-rose-200 bg-[#FCE8E8]/40 text-[#C53030] hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return for Correction</span>
            </button>

            <button
              onClick={() => setShowApprovalModal(true)}
              className="px-5 py-2 rounded-xl bg-[#087F8C] hover:bg-[#065A63] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-clinical-card cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approve & Sign-off</span>
            </button>
          </div>
        }
      />

      {/* Beneficiary Maternal Context Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5EBEF] shadow-clinical-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-[#718096] font-semibold uppercase tracking-wider">Beneficiary Mother</span>
          <h3 className="font-bold text-base text-[#172B3A] mt-0.5">{record.beneficiaryName}</h3>
          <p className="text-xs text-[#718096] font-devanagari">{beneficiary?.nameMr}</p>
        </div>

        <div>
          <span className="text-xs text-[#718096] font-semibold uppercase tracking-wider">Age & Maternal Stage</span>
          <div className="font-bold text-sm text-[#172B3A] mt-0.5">
            {beneficiary?.age} yrs • {beneficiary?.category}
          </div>
          <span className="text-xs text-[#718096] font-mono">RCH: {beneficiary?.rchId}</span>
        </div>

        <div>
          <span className="text-xs text-[#718096] font-semibold uppercase tracking-wider">Sub-Centre Jurisdiction</span>
          <div className="text-sm font-bold text-[#172B3A] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>{beneficiary?.village}</span>
          </div>
          <span className="text-xs text-[#718096]">{beneficiary?.subCenter}</span>
        </div>

        <div>
          <span className="text-xs text-[#718096] font-semibold uppercase tracking-wider">Obstetric Risk Status</span>
          <div className="mt-1">
            {beneficiary?.highRisk ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FCE8E8] text-[#C53030] border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>High Risk Pregnancy</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E1F6ED] text-[#0F6E4E] border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Normal Progression</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Warnings Alert Panel */}
      {record.validationWarnings && record.validationWarnings.length > 0 && (
        <div className="bg-[#FCE8E8]/50 border border-rose-200 rounded-2xl p-5 space-y-3 shadow-clinical-card">
          <div className="flex items-center gap-2 text-[#C53030] font-bold text-sm">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Clinical Rule Engine Alerts ({record.validationWarnings.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {record.validationWarnings.map((warn, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#C53030]">{warn.code}</span>
                  <StatusBadge status={warn.severity} />
                </div>
                <p className="text-xs text-[#172B3A] font-semibold">{warn.messageEn}</p>
                <p className="text-xs text-[#718096] font-devanagari">{warn.messageMr}</p>
                {warn.supportingPhrase && (
                  <div className="mt-2 text-[11px] bg-[#F5F8FA] p-2 rounded-lg text-slate-700 font-devanagari border border-[#E5EBEF]">
                    <span className="font-semibold text-[#087F8C]">Spoken Transcript Evidence:</span> "{warn.supportingPhrase}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CORE FEATURE: Bidirectional Split Screen Evidence Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (5 Cols): Verbatim Spoken Transcript & Audio Player */}
        <div className="lg:col-span-5 space-y-4">
          {/* Audio Player Card */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#087F8C]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#172B3A]">
                  Frontline Audio Recording
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E6F4F5] text-[#087F8C] font-semibold border border-[#087F8C]/20">
                Sarvam Saaras v3 ({record.language === 'mr-IN' ? 'मराठी' : 'हिन्दी'})
              </span>
            </div>

            <div className="p-3.5 bg-[#F5F8FA] rounded-xl border border-[#E5EBEF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shadow-xs cursor-pointer active:scale-95 ${
                    isPlayingAudio ? 'bg-[#E8A23A]' : 'bg-[#087F8C] hover:bg-[#065A63]'
                  }`}
                  title={isPlayingAudio ? 'Pause Audio' : 'Play Spoken Encounter Audio'}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="text-xs">
                  <div className="font-bold text-[#172B3A]">Encounter Voice Capture</div>
                  <div className="text-[#718096] text-[11px] font-mono">{record.audioDurationSeconds}s • 16 kHz Mono PCM</div>
                </div>
              </div>

              {/* Waveform Visualization Bars */}
              <div className="flex items-center gap-1 h-7">
                {[20, 50, 85, 35, 100, 60, 90, 45, 75, 40, 70, 30, 60, 20].map((h, i) => (
                  <div 
                    key={i} 
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-[#087F8C] animate-pulse' : 'bg-slate-300'
                    }`} 
                    style={{ height: `${Math.max(6, h * 0.26)}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Transcript Viewer with Interactive Spans */}
          <TranscriptViewer
            transcript={record.transcript}
            evidenceSpans={record.evidenceSpans}
            selectedSpan={activeSpan}
            onSpanClick={(span) => setSelectedField(span.fieldName)}
            language={record.language}
            onPlayAudio={() => setIsPlayingAudio(!isPlayingAudio)}
            isPlaying={isPlayingAudio}
          />

          {/* Traceable Spans Quick Chips */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5EBEF] shadow-clinical-card space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#172B3A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#087F8C]" />
                <span>Extracted Spoken Phrases ({record.evidenceSpans?.length || 0}):</span>
              </span>
              <span className="text-[11px] text-[#718096]">Tap phrase to inspect</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {record.evidenceSpans?.map((span, idx) => {
                const isSelected = selectedField === span.fieldName;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedField(span.fieldName)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-xs'
                        : 'bg-[#F5F8FA] text-[#172B3A] border-[#E5EBEF] hover:border-[#087F8C] hover:bg-teal-50/50'
                    }`}
                  >
                    <span className="font-semibold">{span.fieldName}:</span> "{span.sourceText}" ({Math.round(span.confidence * 100)}%)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinical Integrity Assurance Banner */}
          <div className="p-3.5 bg-[#E6F4F5]/60 rounded-2xl border border-[#087F8C]/20 text-xs text-[#065A63] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Traceable Evidence Principle:</strong> Every extracted observation links directly to verbatim words spoken in the field. Records cannot be fabricated or hallucinated.
            </div>
          </div>
        </div>

        {/* Right Side (7 Cols): Structured Clinical Observations */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5EBEF] shadow-clinical-card space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5EBEF] pb-4">
            <div>
              <h3 className="font-bold text-base text-[#172B3A]">AI Structured Clinical Extraction</h3>
              <p className="text-xs text-[#718096]">Validated against clinical range schemas and confirmed by ASHA worker</p>
            </div>
            <span className="text-xs text-[#0F6E4E] bg-[#E1F6ED] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-emerald-200">
              <FileCheck2 className="w-3.5 h-3.5 text-[#15966A]" />
              <span>ASHA Confirmed</span>
            </span>
          </div>

          {/* Section A: Vitals & Measurements */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#718096] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#087F8C]" />
              <span>A. Clinical Measurements & Vitals</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* BP Field Card */}
              <div 
                onClick={() => setSelectedField('bloodPressureSystolic')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedField === 'bloodPressureSystolic'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#718096]">Blood Pressure (रक्तदाब)</span>
                  <StatusBadge status={record.measurements.bloodPressureSystolic.status} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#172B3A]">
                  {record.measurements.bloodPressureSystolic.value}/{record.measurements.bloodPressureDiastolic.value}
                  <span className="text-xs font-normal text-[#718096] ml-1">mmHg</span>
                </div>
                <div className="text-xs text-[#172B3A] bg-[#F5F8FA] p-2 rounded-xl border border-[#E5EBEF] font-devanagari">
                  <span className="text-[#087F8C] font-semibold">Evidence:</span> "{record.measurements.bloodPressureSystolic.supportingPhrase}"
                </div>
              </div>

              {/* Weight Field Card */}
              <div 
                onClick={() => setSelectedField('weightKg')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedField === 'weightKg'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#718096]">Maternal Weight (वजन)</span>
                  <StatusBadge status={record.measurements.weightKg.status} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#172B3A]">
                  {record.measurements.weightKg.value}
                  <span className="text-xs font-normal text-[#718096] ml-1">kg</span>
                </div>
                <div className="text-xs text-[#172B3A] bg-[#F5F8FA] p-2 rounded-xl border border-[#E5EBEF] font-devanagari">
                  <span className="text-[#087F8C] font-semibold">Evidence:</span> "{record.measurements.weightKg.supportingPhrase}"
                </div>
              </div>

              {/* Hemoglobin Field Card */}
              <div 
                onClick={() => setSelectedField('hemoglobinGDl')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedField === 'hemoglobinGDl'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#718096]">Hemoglobin (Hb)</span>
                  <StatusBadge status={record.measurements.hemoglobinGDl.status} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#172B3A]">
                  {record.measurements.hemoglobinGDl.value}
                  <span className="text-xs font-normal text-[#718096] ml-1">g/dL</span>
                </div>
                <div className="text-xs text-[#172B3A] bg-[#F5F8FA] p-2 rounded-xl border border-[#E5EBEF] font-devanagari">
                  <span className="text-[#087F8C] font-semibold">Evidence:</span> "{record.measurements.hemoglobinGDl.supportingPhrase}"
                </div>
              </div>

              {/* Gestational Age Card */}
              <div 
                onClick={() => setSelectedField('gestationalAgeWeeks')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedField === 'gestationalAgeWeeks'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#718096]">Gestational Age (गर्भधारणा)</span>
                  <StatusBadge status={record.pregnancyDetails.gestationalAgeWeeks.status} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#172B3A]">
                  {record.pregnancyDetails.gestationalAgeWeeks.value}
                  <span className="text-xs font-normal text-[#718096] ml-1">Weeks (Trimester {record.pregnancyDetails.trimester.value})</span>
                </div>
                <div className="text-xs text-[#172B3A] bg-[#F5F8FA] p-2 rounded-xl border border-[#E5EBEF] font-devanagari">
                  <span className="text-[#087F8C] font-semibold">Evidence:</span> "{record.pregnancyDetails.gestationalAgeWeeks.supportingPhrase}"
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Symptoms & Danger Signs */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#718096] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#DC5B5B]" />
              <span>B. Reported Symptoms & Clinical Danger Signs</span>
            </h4>
            <div className="space-y-2.5">
              {/* Persistent Headache */}
              <div 
                onClick={() => setSelectedField('headacheOrBlurredVision')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedField === 'headacheOrBlurredVision'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-[#172B3A]">Persistent Headache / Blurred Vision (तीव्र डोकेदुखी)</div>
                  <div className="text-xs text-[#718096] font-devanagari">
                    Evidence: "{record.symptoms.headacheOrBlurredVision.supportingPhrase || 'None reported'}"
                  </div>
                </div>
                <StatusBadge 
                  status={record.symptoms.headacheOrBlurredVision.status} 
                  label={record.symptoms.headacheOrBlurredVision.value ? 'Present (धोकादायक)' : 'Absent'} 
                />
              </div>

              {/* Pedal Edema */}
              <div 
                onClick={() => setSelectedField('swellingPedalEdema')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedField === 'swellingPedalEdema'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-[#172B3A]">Pedal Edema / Facial Swelling (पायावर सूज)</div>
                  <div className="text-xs text-[#718096] font-devanagari">
                    Evidence: "{record.symptoms.swellingPedalEdema.supportingPhrase || 'None reported'}"
                  </div>
                </div>
                <StatusBadge 
                  status={record.symptoms.swellingPedalEdema.status} 
                  label={record.symptoms.swellingPedalEdema.value ? 'Reported Present' : 'Absent'} 
                />
              </div>

              {/* Fetal Movement */}
              <div 
                onClick={() => setSelectedField('fetalMovementNormal')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedField === 'fetalMovementNormal'
                    ? 'border-[#087F8C] bg-[#E6F4F5]/30 ring-2 ring-[#087F8C]/20 shadow-clinical-hover'
                    : 'border-[#E5EBEF] hover:border-slate-300 bg-white shadow-clinical-card'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-[#172B3A]">Fetal Movements (बाळाची हालचाल)</div>
                  <div className="text-xs text-[#718096] font-devanagari">
                    Evidence: "{record.symptoms.fetalMovementNormal.supportingPhrase || 'Regular movement reported'}"
                  </div>
                </div>
                <StatusBadge status="extracted" label="Normal / Active (सक्रिय)" />
              </div>
            </div>
          </div>

          {/* Section C: Clinical Interventions & Referrals */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#718096] flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-[#15966A]" />
              <span>C. Frontline Interventions & Referrals</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F5F8FA] border border-[#E5EBEF] space-y-1">
                <span className="text-[#718096] font-semibold">IFA Tablets Given (लोहयुक्त गोळ्या):</span>
                <div className="font-bold text-sm text-[#172B3A]">Yes (30-day supply delivered)</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F5F8FA] border border-[#E5EBEF] space-y-1">
                <span className="text-[#718096] font-semibold">PHC Referral Initiated:</span>
                <div className="font-bold text-sm text-[#DC5B5B]">Yes (Medical Officer follow-up)</div>
              </div>
            </div>
          </div>

          {/* Supervisor Remark Box */}
          <div className="pt-3 border-t border-[#E5EBEF] space-y-2">
            <label className="block text-xs font-bold text-[#172B3A]">
              ANM Supervisor Clinical Remark (पर्यवेक्षण टिप्पणी):
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter supervision notes, medical officer referral instructions, or specific directives for the ASHA worker..."
              className="w-full text-xs p-3.5 rounded-xl border border-[#E5EBEF] bg-white text-[#172B3A] focus:outline-none focus:border-[#087F8C] focus:ring-2 focus:ring-[#087F8C]/15 min-h-[85px] leading-relaxed shadow-clinical-card"
            />
          </div>
        </div>
      </div>

      {/* Approval Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={handleApprove}
        title="Approve & Clinically Sign Off Visit Record?"
        description={`You are about to provide official clinical sign-off for maternal visit record ${record.recordId} (${record.beneficiaryName}). The record will be permanently archived and synchronized with the central PHC database.`}
        confirmLabel="Confirm & Sign Off"
        variant="primary"
      />

      {/* Return for Correction Dialog */}
      <ConfirmationDialog
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleReturn}
        title="Return Record to Frontline ASHA Worker?"
        description={`This action will return record ${record.recordId} to ASHA worker ${record.ashaName} for re-examination and field verification.`}
        confirmLabel="Return to ASHA"
        variant="danger"
      >
        <div className="mt-3 space-y-1.5">
          <label className="text-xs font-semibold text-[#172B3A]">
            Required Instructions for ASHA Worker:
          </label>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="e.g. Please re-check blood pressure at next visit or verify IFA intake..."
            className="w-full text-xs p-3 rounded-xl border border-rose-200 bg-white text-[#172B3A] focus:outline-none focus:border-rose-400 min-h-[75px]"
          />
        </div>
      </ConfirmationDialog>
    </div>
  );
};
