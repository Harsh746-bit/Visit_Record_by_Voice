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
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { StructuredVisit } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { EvidenceHighlighter } from '../../components/common/EvidenceHighlighter';
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
    onUpdateStatus(record.recordId, 'reviewed', reviewNotes || 'Verified and approved by ANM.');
    setShowApprovalModal(false);
  };

  const handleReturn = () => {
    onUpdateStatus(record.recordId, 'returned', reviewNotes || 'Returned to ASHA for re-verification.');
    setShowReturnModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#172B3A]">Record: {record.recordId}</h1>
              <StatusBadge status={record.anmReviewStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Encounter recorded on {new Date(record.recordedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} by ASHA {record.ashaName}
            </p>
          </div>
        </div>

        {/* ANM Approval / Return Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowReturnModal(true)}
            className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Return for Correction
          </button>
          <button
            onClick={() => setShowApprovalModal(true)}
            className="px-5 py-2 rounded-xl bg-[#087F8C] hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Approve & Verify Record
          </button>
        </div>
      </div>

      {/* Beneficiary Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Beneficiary Name</span>
          <h3 className="font-bold text-base text-[#172B3A]">{record.beneficiaryName}</h3>
          <p className="text-xs text-slate-500 font-devanagari">{beneficiary?.nameMr}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium">Age & Category</span>
          <div className="font-semibold text-sm text-[#172B3A]">{beneficiary?.age} yrs • {beneficiary?.category}</div>
          <span className="text-xs text-slate-500 font-mono">RCH: {beneficiary?.rchId}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium">Location</span>
          <div className="text-sm font-semibold text-[#172B3A] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            {beneficiary?.village}
          </div>
          <span className="text-xs text-slate-500">{beneficiary?.subCenter}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 font-medium">Obstetric Risk Status</span>
          <div className="mt-0.5">
            {beneficiary?.highRisk ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5" /> High Risk Pregnancy
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle className="w-3.5 h-3.5" /> Normal Pregnancy
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Warnings Alert (if any) */}
      {record.validationWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            Clinical Rule Engine Warnings ({record.validationWarnings.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {record.validationWarnings.map((warn, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border border-red-100 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-red-700">{warn.code}</span>
                  <StatusBadge status={warn.severity} />
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium">{warn.messageEn}</p>
                <p className="text-xs text-slate-500 font-devanagari mt-0.5">{warn.messageMr}</p>
                {warn.supportingPhrase && (
                  <div className="mt-2 text-[11px] bg-slate-50 p-1.5 rounded text-slate-600 font-devanagari">
                    <strong>Spoken Evidence:</strong> "{warn.supportingPhrase}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIGNATURE CORE FEATURE: Split Screen Evidence Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side (5 Cols): Verbatim Spoken Transcript & Audio Player */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#087F8C]" />
              <h3 className="font-bold text-sm text-[#172B3A]">Verbatim Audio Transcript</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-[#087F8C] font-semibold">
              Sarvam Saaras v3 ({record.language === 'mr-IN' ? 'मराठी' : 'हिन्दी'})
            </span>
          </div>

          {/* Audio Player Component */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-xs cursor-pointer ${
                  isPlayingAudio ? 'bg-amber-600' : 'bg-[#087F8C] hover:bg-teal-700'
                }`}
              >
                {isPlayingAudio ? '❚❚' : '▶'}
              </button>
              <div className="text-xs">
                <div className="font-semibold text-slate-800">Visit Audio Recording</div>
                <div className="text-slate-500">{record.audioDurationSeconds}s • 16 kHz Mono WAV</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[20, 45, 75, 30, 90, 50, 80, 40, 65, 35, 60, 25].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full transition-all ${isPlayingAudio ? 'bg-teal-600 animate-pulse' : 'bg-slate-300'}`} 
                  style={{ height: `${h * 0.28}px` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Interactive Evidence Highlighter */}
          <div>
            <p className="text-xs text-slate-500 mb-2">
              Tap on any clinical field on the right to highlight its exact supporting spoken phrase below:
            </p>
            <EvidenceHighlighter 
              transcript={record.transcript}
              evidenceSpans={record.evidenceSpans}
              activeField={selectedField}
              onSelectSpan={(span) => setSelectedField(span.fieldName)}
            />
          </div>

          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-teal-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
            <div>
              <strong>Traceable Evidence Principle:</strong> Every extracted observation is backed by exact words in the audio. Frontline health records are never generated out of thin air.
            </div>
          </div>
        </div>

        {/* Right Side (7 Cols): Structured Clinical Fields */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#172B3A]">AI Structured Clinical Extraction</h3>
              <p className="text-xs text-slate-500">Validated against Pydantic schema and verified by ASHA worker</p>
            </div>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 border border-emerald-200">
              <FileCheck className="w-3.5 h-3.5" /> ASHA Verified
            </span>
          </div>

          {/* Section A: Vitals & Measurements */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#087F8C]" />
              A. Clinical Measurements & Vitals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* BP Field */}
              <div 
                onClick={() => setSelectedField('bloodPressureSystolic')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedField === 'bloodPressureSystolic'
                    ? 'border-[#087F8C] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Blood Pressure</span>
                  <StatusBadge status={record.measurements.bloodPressureSystolic.status} />
                </div>
                <div className="text-xl font-bold text-[#172B3A] mt-1">
                  {record.measurements.bloodPressureSystolic.value}/{record.measurements.bloodPressureDiastolic.value} mmHg
                </div>
                <div className="mt-2 text-xs text-slate-600 bg-white/80 p-1.5 rounded border border-slate-100 font-devanagari">
                  Evidence: "{record.measurements.bloodPressureSystolic.supportingPhrase}"
                </div>
              </div>

              {/* Weight Field */}
              <div 
                onClick={() => setSelectedField('weightKg')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedField === 'weightKg'
                    ? 'border-[#087F8C] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Maternal Weight</span>
                  <StatusBadge status={record.measurements.weightKg.status} />
                </div>
                <div className="text-xl font-bold text-[#172B3A] mt-1">
                  {record.measurements.weightKg.value} kg
                </div>
                <div className="mt-2 text-xs text-slate-600 bg-white/80 p-1.5 rounded border border-slate-100 font-devanagari">
                  Evidence: "{record.measurements.weightKg.supportingPhrase}"
                </div>
              </div>

              {/* Hemoglobin */}
              <div 
                onClick={() => setSelectedField('hemoglobinGDl')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedField === 'hemoglobinGDl'
                    ? 'border-[#087F8C] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Hemoglobin (Hb)</span>
                  <StatusBadge status={record.measurements.hemoglobinGDl.status} />
                </div>
                <div className="text-xl font-bold text-[#172B3A] mt-1">
                  {record.measurements.hemoglobinGDl.value} g/dL
                </div>
                <div className="mt-2 text-xs text-slate-600 bg-white/80 p-1.5 rounded border border-slate-100 font-devanagari">
                  Evidence: "{record.measurements.hemoglobinGDl.supportingPhrase}"
                </div>
              </div>

              {/* Gestational Age */}
              <div 
                onClick={() => setSelectedField('gestationalAgeWeeks')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedField === 'gestationalAgeWeeks'
                    ? 'border-[#087F8C] bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Gestational Age</span>
                  <StatusBadge status={record.pregnancyDetails.gestationalAgeWeeks.status} />
                </div>
                <div className="text-xl font-bold text-[#172B3A] mt-1">
                  {record.pregnancyDetails.gestationalAgeWeeks.value} Weeks (Trimester {record.pregnancyDetails.trimester.value})
                </div>
                <div className="mt-2 text-xs text-slate-600 bg-white/80 p-1.5 rounded border border-slate-100 font-devanagari">
                  Evidence: "{record.pregnancyDetails.gestationalAgeWeeks.supportingPhrase}"
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Symptoms & Danger Signs */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              B. Symptoms & Observations
            </h4>
            <div className="space-y-2">
              <div 
                onClick={() => setSelectedField('headacheOrBlurredVision')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedField === 'headacheOrBlurredVision' ? 'border-[#087F8C] bg-teal-50/30' : 'border-slate-100 bg-[#F7FAFA]'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800">Persistent Headache</span>
                  <div className="text-xs text-slate-500 font-devanagari">
                    Evidence: "{record.symptoms.headacheOrBlurredVision.supportingPhrase || 'None'}"
                  </div>
                </div>
                <StatusBadge 
                  status={record.symptoms.headacheOrBlurredVision.status} 
                  label={record.symptoms.headacheOrBlurredVision.value ? 'Reported Present' : 'Absent'} 
                />
              </div>

              <div 
                onClick={() => setSelectedField('swellingPedalEdema')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedField === 'swellingPedalEdema' ? 'border-[#087F8C] bg-teal-50/30' : 'border-slate-100 bg-[#F7FAFA]'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800">Pedal Edema / Swelling</span>
                  <div className="text-xs text-slate-500 font-devanagari">
                    Evidence: "{record.symptoms.swellingPedalEdema.supportingPhrase || 'None'}"
                  </div>
                </div>
                <StatusBadge 
                  status={record.symptoms.swellingPedalEdema.status} 
                  label={record.symptoms.swellingPedalEdema.value ? 'Reported Present' : 'Absent'} 
                />
              </div>

              <div 
                onClick={() => setSelectedField('fetalMovementNormal')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedField === 'fetalMovementNormal' ? 'border-[#087F8C] bg-teal-50/30' : 'border-slate-100 bg-[#F7FAFA]'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800">Fetal Movements</span>
                  <div className="text-xs text-slate-500 font-devanagari">
                    Evidence: "{record.symptoms.fetalMovementNormal.supportingPhrase || 'None'}"
                  </div>
                </div>
                <StatusBadge status="extracted" label="Normal / Active" />
              </div>
            </div>
          </div>

          {/* Section C: Interventions Given */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              C. Interventions Given & Referrals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F7FAFA] border border-slate-100">
                <span className="text-slate-500">IFA Tablets Given:</span>
                <span className="font-semibold text-slate-800 ml-2">Yes (30-day supply)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7FAFA] border border-slate-100">
                <span className="text-slate-500">PHC Referral Advised:</span>
                <span className="font-semibold text-red-600 ml-2">Yes (Pre-eclampsia evaluation)</span>
              </div>
            </div>
          </div>

          {/* Review Remarks Box */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ANM Supervisor Clinical Remark:
            </label>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add supervision notes, MO referral tracking or instructions for ASHA worker..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#087F8C] min-h-[75px]"
            />
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172B3A]">Approve & Sign Off Record?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are clinically signing off on the structured visit record for <strong>{record.beneficiaryName}</strong>. This record will sync to the central register.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleApprove}
                className="px-5 py-2 text-xs font-semibold bg-[#087F8C] hover:bg-teal-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return for Correction Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#172B3A]">Return Record to ASHA Worker?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Specify why this record requires re-checking by ASHA <strong>{record.ashaName}</strong>.
              </p>
            </div>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="e.g. Please re-check blood pressure at next visit or verify IFA intake..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-400 min-h-[80px]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleReturn}
                className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Return to ASHA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
