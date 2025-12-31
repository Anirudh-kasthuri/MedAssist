import React, { useState, useEffect, useRef } from 'react';
import { Mic, Phone, Activity } from 'lucide-react';
import { connectToLiveSession } from '../../services/liveService';
import { Language } from '../../types';

interface LiveConsultationProps {
  language: Language;
}

const BAR_COUNT = 24;

const LiveConsultation: React.FC<LiveConsultationProps> = ({ language }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const audioDataRef = useRef<Uint8Array>(new Uint8Array(BAR_COUNT).fill(0));
  const [visuals, setVisuals] = useState<number[]>(new Array(BAR_COUNT).fill(5));
  
  const cleanupRef = useRef<(() => void) | null>(null);

  const toggleSession = async () => {
    if (isActive) {
      if (cleanupRef.current) cleanupRef.current();
      cleanupRef.current = null;
      setIsActive(false);
      setStatus('disconnected');
    } else {
      setStatus('connecting');
      try {
        const cleanup = await connectToLiveSession(
          language,
          (data) => {
            audioDataRef.current = data.slice(0, BAR_COUNT);
          },
          () => {
             setIsActive(false);
             setStatus('disconnected');
          }
        );
        cleanupRef.current = cleanup;
        setIsActive(true);
        setStatus('connected');
      } catch (e) {
        console.error("Connection failed", e);
        setStatus('disconnected');
      }
    }
  };

  useEffect(() => {
    let animationFrame: number;
    const ATTACK = 0.6;
    const DECAY = 0.2;
    const MIN_HEIGHT = 10; // Increased min height for visibility

    const animate = () => {
      if (status === 'connected') {
        setVisuals(prev => {
          return prev.map((current, i) => {
            const rawValue = audioDataRef.current[i] || 0;
            const target = (rawValue / 255) * 100;
            let next = current;
            if (target > current) {
              next = current + (target - current) * ATTACK;
            } else {
              next = current - (current - target) * DECAY;
            }
            return Math.max(MIN_HEIGHT, next);
          });
        });
      } else if (status === 'connecting') {
        const time = Date.now() / 150;
        setVisuals(prev => prev.map((_, i) => {
           // Gentle wave for connecting state
           return 25 + Math.sin(time + i * 0.6) * 15;
        }));
      } else {
        // Flat line (or very subtle breathing) when idle
        setVisuals(new Array(BAR_COUNT).fill(MIN_HEIGHT));
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [status]);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-all duration-500">
      
      {/* Header / Status Badge */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
         <div className="flex items-center space-x-3 bg-white dark:bg-zinc-950 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
             status === 'connected' ? 'bg-emerald-500' : 
             status === 'connecting' ? 'bg-amber-400 animate-pulse' : 
             'bg-zinc-300 dark:bg-zinc-700'
           }`}></div>
           <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 tracking-widest uppercase font-bold">
             {status === 'connected' ? 'LIVE SESSION' : status === 'connecting' ? 'CONNECTING...' : 'STANDBY'}
           </span>
         </div>
      </div>

      {/* Visualizer - Minimalist Bar Chart */}
      <div className="flex-1 flex items-center justify-center w-full max-w-2xl z-10 h-64 relative">
        <div className="flex items-center justify-center space-x-2 md:space-x-3 h-48 w-full px-8">
          {visuals.map((h, i) => (
            <div 
              key={i} 
              className={`w-3 md:w-4 rounded-full transition-colors duration-300 ${
                 isActive 
                  ? 'bg-black dark:bg-white' 
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
              style={{ 
                height: `${Math.min(100, h)}%`,
                transition: 'height 0.1s ease-out'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Control Area */}
      <div className="mb-12 flex flex-col items-center space-y-8 z-20">
        <button 
          onClick={toggleSession}
          className={`
            relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg border-4
            ${isActive 
                ? 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600' 
                : 'bg-white dark:bg-black border-zinc-100 dark:border-zinc-800 text-black dark:text-white hover:scale-105 hover:border-black dark:hover:border-white'
            }
          `}
        >
          {isActive ? (
             <Phone className="w-10 h-10 rotate-[135deg]" />
          ) : (
             <Mic className="w-10 h-10" />
          )}
        </button>
        
        <p className={`text-xs font-mono uppercase tracking-widest font-bold transition-colors ${isActive ? 'text-red-500 animate-pulse' : 'text-zinc-400'}`}>
          {isActive ? '● Live Recording' : 'Tap to Start'}
        </p>
      </div>
    </div>
  );
};

export default LiveConsultation;