import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Activity, 
  Stethoscope, 
  TrendingUp, 
  Clipboard, 
  ShieldCheck,
  AlertOctagon,
  Brain
} from 'lucide-react';

interface DiagnosisCardProps {
  title: string;
  summary: string;
  technicalAnalysis?: string;
  findings?: string[];
  confidence?: number;
  severity?: 'low' | 'medium' | 'high';
  role?: 'doctor' | 'patient';
  className?: string;
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ 
  title, 
  summary, 
  technicalAnalysis,
  findings,
  confidence,
  severity = 'low', 
  role = 'patient',
  className = '' 
}) => {
  // Configuration for Severity Styles
  const severityConfig = {
    low: { 
      accent: 'bg-emerald-500', 
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle, 
      label: 'Low Acuity' 
    },
    medium: { 
      accent: 'bg-amber-500', 
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: AlertTriangle, 
      label: 'Moderate Concern' 
    },
    high: { 
      accent: 'bg-red-600', 
      text: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: AlertOctagon, 
      label: 'High Priority' 
    }
  };

  const config = severityConfig[severity];
  const SeverityIcon = config.icon;

  // Smart parsing: specific findings array OR sentence splitting from summary
  const displaySource = role === 'doctor' && technicalAnalysis ? technicalAnalysis : summary;
  const displayFindings = findings && findings.length > 0 
    ? findings 
    : displaySource.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/)
        .filter(s => s.trim().length > 15)
        .slice(0, 5);

  return (
    <div className={`relative bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden ${className}`}>
      
      {/* Severity Spine */}
      <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${config.accent}`}></div>

      {/* Header */}
      <div className="pl-6 pr-6 pt-5 pb-4 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex-1">
          {/* Severity Badge */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
              <SeverityIcon className="w-3 h-3" />
              <span>{config.label}</span>
            </span>
            {role === 'doctor' && (
              <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-400 uppercase tracking-widest border border-zinc-100 dark:border-zinc-800 px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800">
                ICD-10 Compatible
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tight">
            {title}
          </h2>
        </div>

        {/* Confidence Meter */}
        {confidence && (
          <div className="flex flex-col items-end pl-4">
             <div className="flex items-center space-x-1 mb-1">
               <Brain className="w-3 h-3 text-zinc-400" />
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                 Confidence
               </span>
             </div>
             <div className="flex items-center space-x-2">
               <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full ${config.accent} transition-all duration-1000 ease-out`} 
                   style={{ width: `${confidence}%` }}
                 ></div>
               </div>
               <span className="text-sm font-mono font-bold text-zinc-700 dark:text-zinc-300">
                 {confidence}%
               </span>
             </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pl-6 pr-6 pt-5 pb-6">
        
        {/* Findings Section */}
        <div className="mb-6">
          <h3 className="flex items-center space-x-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
             <Clipboard className="w-3.5 h-3.5" />
             <span>Clinical Observations</span>
          </h3>
          <ul className="space-y-3">
            {displayFindings.map((point, idx) => (
              <li key={idx} className="flex items-start text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <span className={`mt-2 mr-3 w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.accent} opacity-60`}></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Doctor Technical View */}
        {role === 'doctor' && technicalAnalysis && (
          <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-200 dark:border-zinc-800 relative">
            <div className="absolute top-4 right-4">
               <Stethoscope className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
            </div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Technical Abstract
            </h4>
            <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed text-justify">
              {technicalAnalysis}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Disclaimer */}
      <div className="pl-6 pr-6 py-3 bg-zinc-50 dark:bg-zinc-950/30 border-t border-zinc-100 dark:border-zinc-800 flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-zinc-400 leading-tight">
          <span className="font-bold">Automated Triage:</span> This analysis is generated by AI (Gemini 2.5) for informational purposes. It does not constitute a definitive medical diagnosis. Please review patient history for context.
        </p>
      </div>
    </div>
  );
};

export default DiagnosisCard;