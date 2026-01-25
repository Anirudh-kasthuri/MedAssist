import React, { useEffect, useRef } from 'react';
import { AlignLeft, Mic, Activity, FileText } from 'lucide-react';

interface LiveTranscriptPanelProps {
  transcript: string;
  isRecording: boolean;
  className?: string;
  placeholder?: string;
}

const LiveTranscriptPanel: React.FC<LiveTranscriptPanelProps> = ({ 
  transcript, 
  isRecording, 
  className = '',
  placeholder = "Waiting for speech input..."
}) => {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when text updates
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, isRecording]);

  return (
    <div className={`flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Live Transcript</span>
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border transition-all duration-300 ${
          isRecording 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' 
            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
        }`}>
          {isRecording ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Recording</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Paused</span>
            </>
          )}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 min-h-[160px] max-h-[300px] custom-scrollbar bg-white dark:bg-zinc-900 relative">
        {transcript ? (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap">
              {transcript}
              {isRecording && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-zinc-400 dark:bg-zinc-500 align-middle animate-pulse rounded-sm"></span>
              )}
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 select-none">
            <Mic className="w-8 h-8 mb-3 opacity-40" />
            <p className="text-xs uppercase tracking-widest font-bold opacity-60">{placeholder}</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Footer / Meta */}
      <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950/30 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 flex justify-between items-center">
        <span>Auto-generated via WebSpeech API</span>
        {transcript.length > 0 && <span>{transcript.split(' ').length} words</span>}
      </div>
    </div>
  );
};

export default LiveTranscriptPanel;