import React, { useState } from 'react';
import { Volume2, Copy, Check, FileText } from 'lucide-react';
import { EvidenceSpan } from '../../types';

interface TranscriptViewerProps {
  transcript: string;
  evidenceSpans?: EvidenceSpan[];
  selectedSpan?: EvidenceSpan | null;
  onSpanClick?: (span: EvidenceSpan) => void;
  language?: string;
  onPlayAudio?: () => void;
  isPlaying?: boolean;
  className?: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  evidenceSpans = [],
  selectedSpan,
  onSpanClick,
  _language = 'mr-IN',
  onPlayAudio,
  isPlaying = false,
  className = ''
}: TranscriptViewerProps & { _language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  // Render highlighted transcript by slicing evidence spans
  const renderHighlightedContent = () => {
    if (!evidenceSpans || evidenceSpans.length === 0) {
      return (
        <p className="text-sm sm:text-base text-[#172B3A] font-devanagari leading-relaxed select-text">
          {transcript}
        </p>
      );
    }

    // Sort spans by start_char
    const sorted = [...evidenceSpans].sort((a, b) => a.startChar - b.startChar);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((span, idx) => {
      // Unhighlighted text before this span
      if (span.startChar > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>
            {transcript.substring(lastIndex, span.startChar)}
          </span>
        );
      }

      const isSelected = selectedSpan?.fieldName === span.fieldName;
      const isConcerning = span.status === 'concerning';

      elements.push(
        <mark
          key={`span-${idx}`}
          onClick={() => onSpanClick && onSpanClick(span)}
          className={`cursor-pointer px-1 py-0.5 rounded transition-all font-medium ${
            isSelected
              ? 'bg-[#087F8C] text-white ring-2 ring-[#087F8C]/30 shadow-xs'
              : isConcerning
              ? 'bg-[#FCE8E8] text-[#C53030] border-b-2 border-[#DC5B5B]'
              : 'bg-[#E6F4F5] text-[#087F8C] hover:bg-teal-200 border-b-2 border-[#087F8C]'
          }`}
          title={`Extracted: ${span.fieldName} (${span.status})`}
        >
          {transcript.substring(span.startChar, span.endChar)}
        </mark>
      );

      lastIndex = span.endChar;
    });

    if (lastIndex < transcript.length) {
      elements.push(
        <span key="text-end">
          {transcript.substring(lastIndex)}
        </span>
      );
    }

    return (
      <p className="text-sm sm:text-base text-[#172B3A] font-devanagari leading-relaxed select-text">
        {elements}
      </p>
    );
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#E5EBEF] shadow-clinical-card overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[#E5EBEF] bg-[#F5F8FA]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#087F8C]" />
          <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
            मुळ आवाज मजकूर • Verbatim Transcript
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#E5EBEF] text-[#718096] font-mono">
            {wordCount} words
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onPlayAudio && (
            <button
              type="button"
              onClick={onPlayAudio}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlaying 
                  ? 'bg-[#15966A] text-white' 
                  : 'bg-white border border-[#E5EBEF] text-[#172B3A] hover:bg-slate-50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-white border border-[#E5EBEF] text-[#718096] hover:text-[#172B3A] transition-colors cursor-pointer"
            title="Copy Transcript"
          >
            {copied ? <Check className="w-4 h-4 text-[#15966A]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Transcript Body */}
      <div className="p-5 max-h-96 overflow-y-auto">
        {renderHighlightedContent()}
      </div>

      {/* Footer indicator */}
      <div className="p-3 border-t border-[#E5EBEF] bg-[#F5F8FA] flex items-center justify-between text-xs text-[#718096]">
        <span>Highlighted phrases represent AI-extracted clinical evidence.</span>
        <span className="text-[#087F8C] font-semibold">{evidenceSpans.length} entities mapped</span>
      </div>
    </div>
  );
};
