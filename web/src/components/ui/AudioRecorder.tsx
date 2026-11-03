import React, { useState } from 'react';
import { Mic, Square, Pause, Play, RotateCcw } from 'lucide-react';

interface AudioRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording?: () => void;
  onResumeRecording?: () => void;
  recordingSeconds: number;
  language?: string;
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  recordingSeconds,
  language = 'mr-IN',
  className = ''
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      if (onResumeRecording) onResumeRecording();
    } else {
      setIsPaused(true);
      if (onPauseRecording) onPauseRecording();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-3xl border border-[#E5EBEF] shadow-clinical-card space-y-6 ${className}`}>
      {/* Language / Model Badge */}
      <div className="flex items-center gap-2 px-3 py-1 bg-[#E6F4F5] rounded-full text-xs font-semibold text-[#087F8C]">
        <span className="w-2 h-2 rounded-full bg-[#087F8C] animate-pulse" />
        <span>{language === 'hi-IN' ? 'हिन्दी (Sarvam Saaras v3)' : 'मराठी (Sarvam Saaras v3)'}</span>
      </div>

      {/* Timer Display */}
      <div className="text-center space-y-1">
        <h2 className="text-4xl sm:text-5xl font-mono font-bold text-[#172B3A] tracking-wider">
          {formatTime(recordingSeconds)}
        </h2>
        <p className="text-xs text-[#718096]">
          {isRecording ? (isPaused ? 'रेकॉर्डिंग थांबवले आहे • Paused' : 'रेकॉर्डिंग सुरू आहे • Listening...') : 'रेकॉर्डिंग सुरू करण्यासाठी बटण दाबा'}
        </p>
      </div>

      {/* Dynamic Animated Waveform */}
      <div className="h-16 flex items-center justify-center gap-1.5 px-4 w-full max-w-sm">
        {[24, 38, 52, 30, 48, 60, 44, 32, 56, 40, 20, 46, 34, 50].map((h, idx) => (
          <div
            key={idx}
            className={`w-1.5 rounded-full transition-all duration-200 ${
              isRecording && !isPaused 
                ? 'bg-[#15966A] wave-bar' 
                : 'bg-slate-200 h-3'
            }`}
            style={{
              height: isRecording && !isPaused ? `${Math.min(h, 56)}px` : '10px',
              animationDelay: `${idx * 0.08}s`
            }}
          />
        ))}
      </div>

      {/* Central Control Actions */}
      <div className="flex items-center justify-center gap-5 pt-2">
        {isRecording && (
          <button
            type="button"
            onClick={handleTogglePause}
            className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-[#172B3A] flex items-center justify-center transition-colors cursor-pointer"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="w-5 h-5 ml-0.5" /> : <Pause className="w-5 h-5" />}
          </button>
        )}

        {/* Big Mic / Stop Button */}
        <button
          type="button"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-clinical-modal transition-all transform active:scale-95 cursor-pointer ${
            isRecording
              ? 'bg-[#DC5B5B] hover:bg-rose-700 text-white ring-4 ring-[#DC5B5B]/20 animate-pulse'
              : 'bg-[#087F8C] hover:bg-[#065A63] text-white ring-4 ring-[#087F8C]/20 hover:scale-105'
          }`}
          title={isRecording ? "Stop Recording" : "Start Voice Recording"}
        >
          {isRecording ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>

        {isRecording && (
          <button
            type="button"
            onClick={onStopRecording}
            className="w-12 h-12 rounded-full bg-[#E1F6ED] hover:bg-[#D3F2E7] text-[#15966A] flex items-center justify-center transition-colors cursor-pointer"
            title="Complete & Review"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Voice Hint */}
      <p className="text-xs text-[#718096] text-center max-w-xs font-devanagari">
        घरभेटीबद्दल नैसर्गिकरीत्या बोला. बीपी, वजन, हिमोग्लोबिन, गोळ्या, बाळाची हालचाल स्पष्टपणे नमूद करा.
      </p>
    </div>
  );
};
