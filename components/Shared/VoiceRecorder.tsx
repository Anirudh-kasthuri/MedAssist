import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle, Loader2, RotateCcw } from 'lucide-react';

// Polyfill types for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface VoiceRecorderProps {
  onTranscriptComplete: (text: string) => void;
  onLiveTranscript?: (text: string) => void;
  onStateChange?: (isRecording: boolean) => void;
  language?: string;
  isCompact?: boolean;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onTranscriptComplete, 
  onLiveTranscript,
  onStateChange,
  language = 'en-US',
  isCompact = false,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Propagate state changes to parent
  useEffect(() => {
    if (onStateChange) {
      onStateChange(isRecording);
    }
  }, [isRecording, onStateChange]);

  useEffect(() => {
    // Check browser support
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please check permissions.');
      } else if (event.error === 'no-speech') {
        // Ignore no-speech errors usually, just keep listening or let user restart
      } else {
        setError(`Error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        setTranscript(prev => {
          // Note: We only pass the *new* final chunk to the parent's complete handler 
          // to avoid duplicating the entire history if the parent appends it.
          // However, we maintain full local history in `transcript` state if needed for local display.
          const newTotal = prev + ' ' + final;
          onTranscriptComplete(final.trim()); 
          return newTotal;
        });
      }
      
      setInterimTranscript(interim);
      if (onLiveTranscript) {
        onLiveTranscript(interim); 
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscriptComplete, onLiveTranscript]);

  const toggleRecording = () => {
    if (disabled) return;
    
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      // We don't clear the full session transcript here to allow pausing/resuming
      setInterimTranscript('');
      setError(null);
      recognitionRef.current?.start();
    }
  };

  const handleReset = () => {
    if (disabled) return;
    setTranscript('');
    setInterimTranscript('');
    // Notice: We don't necessarily clear parent state here, parent handles that via its own logic
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center space-x-3 text-zinc-500">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">Voice recording is not supported in this browser.</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isCompact ? 'gap-2' : 'gap-4'} w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* Controls */}
      <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-full border border-zinc-200 dark:border-zinc-700/50">
        <div className="flex items-center space-x-2 pl-2">
           {isRecording && (
             <div className="flex space-x-1">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-0"></div>
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-150"></div>
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-300"></div>
             </div>
           )}
           <span className={`text-xs font-bold uppercase tracking-wider ${isRecording ? 'text-red-500' : 'text-zinc-400'}`}>
             {isRecording ? 'Recording...' : 'Ready to Dictate'}
           </span>
        </div>

        <div className="flex items-center space-x-2">
           {(transcript || isRecording) && (
              <button 
                onClick={handleReset}
                disabled={isRecording || disabled}
                className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-colors disabled:opacity-30"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
           )}
           
           <button
            onClick={toggleRecording}
            disabled={disabled}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-sm
              ${isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105' 
                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Real-time Display Area (Only shown if NOT compact) */}
      {!isCompact && (
        <div className={`
          relative min-h-[60px] max-h-[150px] overflow-y-auto p-4 rounded-2xl border transition-all duration-300
          ${isRecording 
            ? 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10' 
            : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30'
          }
        `}>
          {transcript || interimTranscript ? (
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {transcript}
              <span className="text-zinc-400 dark:text-zinc-500 italic ml-1">{interimTranscript}</span>
            </p>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-600 italic">
              Transcription will appear here...
            </p>
          )}
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="text-xs text-red-500 flex items-center space-x-1 animate-fade-in pl-2">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;