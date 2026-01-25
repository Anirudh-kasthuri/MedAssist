import React from 'react';
import { Mic, MessageSquare, ScanEye, Activity, ArrowRight, Clipboard, ChevronRight } from 'lucide-react';
import { ViewState } from '../../types';

interface LaunchpadViewProps {
  onNavigate: (view: ViewState) => void;
  userName: string;
}

const LaunchpadView: React.FC<LaunchpadViewProps> = ({ onNavigate, userName }) => {
  return (
    <div className="flex flex-col h-full pb-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 mt-4 px-2 flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors duration-300">
        <div>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2 block transition-colors duration-300">Patient Portal</span>
          <h1 className="text-4xl font-bold text-black dark:text-white tracking-tight transition-colors duration-300">
            Welcome, {userName}.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium transition-colors duration-300">
            Select a service to begin your session.
          </p>
        </div>
        <div className="hidden md:block text-right">
           <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wide transition-colors duration-300">Current Status</p>
           <p className="text-sm font-bold text-black dark:text-white flex items-center justify-end gap-2 mt-1 transition-colors duration-300">
             <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
             Ambulatory
           </p>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Voice Card (Primary) */}
        <div 
          onClick={() => onNavigate(ViewState.VOICE_ANALYSIS)}
          className="
            relative group cursor-pointer rounded-2xl overflow-hidden md:col-span-2 
            bg-white dark:bg-black
            text-black dark:text-white
            hover:bg-black dark:hover:bg-white
            hover:text-white dark:hover:text-black
            p-8 flex flex-col justify-between 
            shadow-xl hover:shadow-2xl
            transition-all duration-300 ease-out transform hover:scale-[1.01] hover:-translate-y-1
            border border-zinc-200 dark:border-zinc-800
            hover:border-black dark:hover:border-white
          "
        >
          {/* Subtle Gradient Overlay - Hidden on Hover to keep pure solid color */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 opacity-50 z-0 pointer-events-none group-hover:opacity-0 transition-opacity"></div>
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="p-4 rounded-2xl border shadow-sm transition-all duration-300
              bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800
              group-hover:bg-transparent group-hover:border-transparent
              text-inherit
            ">
              <Mic className="w-8 h-8 text-inherit" />
            </div>
            {/* AI Active Badge - Inverts relative to card background */}
            <span className="
              px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-transparent animate-pulse-slow shadow-md transition-colors duration-300
              bg-black text-white dark:bg-white dark:text-black
              group-hover:bg-white group-hover:text-black dark:group-hover:bg-black dark:group-hover:text-white
            ">
              AI Active
            </span>
          </div>

          <div className="relative z-10 mt-8">
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-inherit">Start Consultation</h2>
            <p className="text-sm leading-relaxed max-w-md font-medium transition-colors duration-300
              text-zinc-500 dark:text-zinc-400
              group-hover:text-zinc-300 dark:group-hover:text-zinc-600
            ">
              Begin a secure voice session for symptom analysis and triage. All data is encrypted and logged to your medical record.
            </p>
          </div>

          <div className="relative z-10 flex items-center space-x-2 mt-8 font-bold text-sm tracking-wide transition-colors">
            <span>Open Channel</span>
            <div className="p-1 rounded-full transition-colors duration-300
              bg-zinc-100 dark:bg-zinc-900
              group-hover:bg-transparent
            ">
               <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Vertical Stack */}
        <div className="flex flex-col gap-6">
          
          {/* Chat */}
          <div 
            onClick={() => onNavigate(ViewState.TEXT_ANALYSIS)}
            className="
              flex-1 group cursor-pointer rounded-2xl 
              bg-white dark:bg-black
              text-black dark:text-white
              hover:bg-black dark:hover:bg-white
              hover:text-white dark:hover:text-black
              border border-zinc-200 dark:border-zinc-800
              hover:border-black dark:hover:border-white
              p-6 flex flex-col justify-center shadow-lg hover:shadow-xl
              transition-all duration-300 transform hover:scale-[1.02]
              relative overflow-hidden
            "
          >
             <div className="relative z-10 flex items-center justify-between mb-4">
               <div className="p-3 rounded-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800 
                 bg-zinc-100 dark:bg-zinc-900
                 group-hover:bg-transparent group-hover:border-transparent
               ">
                  <MessageSquare className="w-6 h-6 text-inherit transition-colors" />
               </div>
               <ChevronRight className="w-5 h-5 transition-all
                 text-zinc-400 
                 group-hover:text-white dark:group-hover:text-black 
                 group-hover:translate-x-1" 
               />
             </div>
             <div className="relative z-10">
               <h3 className="text-lg font-bold text-inherit transition-colors">Symptom Chat</h3>
               <p className="text-xs mt-1 font-medium transition-colors
                 text-zinc-500 dark:text-zinc-400
                 group-hover:text-zinc-300 dark:group-hover:text-zinc-600
               ">Text-based triage assistance.</p>
             </div>
          </div>

          {/* Scan */}
          <div 
            onClick={() => onNavigate(ViewState.IMAGE_ANALYSIS)}
            className="
              flex-1 group cursor-pointer rounded-2xl 
              bg-white dark:bg-black
              text-black dark:text-white
              hover:bg-black dark:hover:bg-white
              hover:text-white dark:hover:text-black
              border border-zinc-200 dark:border-zinc-800
              hover:border-black dark:hover:border-white
              p-6 flex flex-col justify-center shadow-lg hover:shadow-xl
              transition-all duration-300 transform hover:scale-[1.02]
              relative overflow-hidden
            "
          >
             <div className="relative z-10 flex items-center justify-between mb-4">
               <div className="p-3 rounded-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800
                 bg-zinc-100 dark:bg-zinc-900
                 group-hover:bg-transparent group-hover:border-transparent
               ">
                 <ScanEye className="w-6 h-6 text-inherit transition-colors" />
               </div>
               <ChevronRight className="w-5 h-5 transition-all
                 text-zinc-400 
                 group-hover:text-white dark:group-hover:text-black 
                 group-hover:translate-x-1" 
               />
             </div>
             <div className="relative z-10">
               <h3 className="text-lg font-bold text-inherit transition-colors">Upload Imaging</h3>
               <p className="text-xs mt-1 font-medium transition-colors
                 text-zinc-500 dark:text-zinc-400
                 group-hover:text-zinc-300 dark:group-hover:text-zinc-600
               ">Dermatology or Radiology.</p>
             </div>
          </div>

        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
         <div 
           onClick={() => onNavigate(ViewState.DASHBOARD)} 
           className="
             p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md
             flex items-center space-x-3 group relative overflow-hidden cursor-pointer
             bg-white dark:bg-black
             border-zinc-200 dark:border-zinc-800
             hover:bg-black dark:hover:bg-white
             hover:border-black dark:hover:border-white
           "
         >
            <div className="relative z-10 p-2 rounded-lg shadow-sm transition-colors border
              bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800
              group-hover:bg-transparent group-hover:border-transparent
            ">
               <Activity className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-black" />
            </div>
            <span className="relative z-10 font-bold text-sm transition-colors
              text-black dark:text-white
              group-hover:text-white dark:group-hover:text-black
            ">View Vitals</span>
         </div>
         
         <div 
           className="
             p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md
             flex items-center space-x-3 group relative overflow-hidden cursor-pointer
             bg-white dark:bg-black
             border-zinc-200 dark:border-zinc-800
             hover:bg-black dark:hover:bg-white
             hover:border-black dark:hover:border-white
           "
         >
            <div className="relative z-10 p-2 rounded-lg shadow-sm transition-colors border
               bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800
               group-hover:bg-transparent group-hover:border-transparent
            ">
               <Clipboard className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-black" />
            </div>
            <span className="relative z-10 font-bold text-sm transition-colors
              text-black dark:text-white
              group-hover:text-white dark:group-hover:text-black
            ">Lab Results</span>
         </div>
      </div>
    </div>
  );
};

export default LaunchpadView;