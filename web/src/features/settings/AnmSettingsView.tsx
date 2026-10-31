import React from 'react';
import { Shield, Mic, HardDrive } from 'lucide-react';

export const AnmSettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs">
        <h1 className="text-xl font-bold text-[#172B3A]">System Settings & Circle Configuration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage healthcare circle parameters, speech recognition models, role permissions, and audio privacy rules.
        </p>
      </div>

      {/* Role & Permissions */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#172B3A]">
          <Shield className="w-4 h-4 text-[#087F8C]" />
          <span>Role-Based Access Control (RBAC)</span>
        </div>
        <p className="text-xs text-slate-500">
          Supervisory roles have review authority over designated sub-centers. Clinical diagnoses remain restricted to Medical Officers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 text-xs space-y-1">
            <span className="font-bold text-[#087F8C]">ANM Supervisor (Active)</span>
            <p className="text-slate-600">Review structured visits, approve, return for correction, MO referral.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F7FAFA] text-xs space-y-1">
            <span className="font-bold text-slate-700">ASHA Worker</span>
            <p className="text-slate-500">Voice recording, Marathi/Hindi transcription review, explicit confirmation.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F7FAFA] text-xs space-y-1">
            <span className="font-bold text-slate-700">Medical Officer (PHC)</span>
            <p className="text-slate-500">Clinical diagnosis, prescription management, emergency escalation.</p>
          </div>
        </div>
      </div>

      {/* Speech Recognition & AI Extraction Pipeline */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#172B3A]">
          <Mic className="w-4 h-4 text-[#087F8C]" />
          <span>Speech Recognition (ASR) & Model Benchmarking</span>
        </div>
        <p className="text-xs text-slate-500">
          Configured for Sarvam Saaras v3 multilingual speech-to-text with vernacular Marathi & Hindi acoustic models.
        </p>

        <div className="space-y-3 pt-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[#F7FAFA]">
            <div>
              <div className="font-semibold text-slate-800">Primary ASR Engine</div>
              <span className="text-slate-500">Sarvam Saaras v3 (Indic Multilingual)</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
              Active & Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[#F7FAFA]">
            <div>
              <div className="font-semibold text-slate-800">Evidence Attribution Engine</div>
              <span className="text-slate-500">Exact Character Offset Traceability (Pydantic Schema)</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-[#087F8C] font-semibold text-[11px]">
              Enforced (No Hallucinations)
            </span>
          </div>
        </div>
      </div>

      {/* Privacy & Audio Retention */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#172B3A]">
          <HardDrive className="w-4 h-4 text-[#087F8C]" />
          <span>Frontline Data & Audio Retention Policy</span>
        </div>
        <div className="text-xs text-slate-600 space-y-2">
          <p>
            • Voice recordings are securely retained for 30 days after ANM approval for clinical audit trails, following which raw audio is automatically scrubbed while the structured visit record remains permanent.
          </p>
          <p>
            • Beneficiary demographic data is isolated using synthetic token IDs (RCH standard format).
          </p>
        </div>
      </div>
    </div>
  );
};
