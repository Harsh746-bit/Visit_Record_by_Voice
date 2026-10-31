import React from 'react';
import { EvidenceSpan } from '../../types';

interface EvidenceHighlighterProps {
  transcript: string;
  evidenceSpans: EvidenceSpan[];
  activeField?: string | null;
  onSelectSpan?: (span: EvidenceSpan) => void;
  className?: string;
}

export const EvidenceHighlighter: React.FC<EvidenceHighlighterProps> = ({
  transcript,
  evidenceSpans,
  activeField,
  onSelectSpan,
  className = ""
}) => {
  if (!transcript) return <div className="text-slate-400 italic">No transcript recorded.</div>;

  // Find if there's a span matching the activeField
  const activeSpan = activeField ? evidenceSpans.find(s => s.fieldName === activeField) : null;

  // If no specific field is active, render interactive clickable spans
  // Or highlight the specific active field span with high contrast teal/yellow
  if (activeSpan && activeSpan.sourceText && transcript.includes(activeSpan.sourceText)) {
    const parts = transcript.split(activeSpan.sourceText);
    return (
      <div className={`p-4 rounded-xl bg-white border border-[#E4ECEC] shadow-sm leading-relaxed text-base font-devanagari text-[#172B3A] ${className}`}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < parts.length - 1 && (
              <mark className="bg-teal-100 text-[#087F8C] font-semibold px-2 py-0.5 rounded border border-teal-300 shadow-sm animate-pulse">
                {activeSpan.sourceText}
                <span className="ml-1 text-[11px] font-mono uppercase bg-[#087F8C] text-white px-1.5 py-0.2 rounded-full inline-block">
                  {activeSpan.fieldName}
                </span>
              </mark>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Interactive mode: highlight all available evidence spans in soft colors
  return (
    <div className={`p-4 rounded-xl bg-white border border-[#E4ECEC] shadow-sm leading-relaxed text-base font-devanagari text-[#172B3A] ${className}`}>
      {transcript}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 font-sans font-medium self-center">Traceable Spans:</span>
        {evidenceSpans.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSpan && onSelectSpan(s)}
            className={`px-2.5 py-1 rounded-md transition-all font-sans text-xs border ${
              activeField === s.fieldName
                ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-teal-50 hover:text-[#087F8C] border-slate-200'
            }`}
          >
            {s.fieldName}: "{s.sourceText}" ({Math.round(s.confidence * 100)}%)
          </button>
        ))}
      </div>
    </div>
  );
};
