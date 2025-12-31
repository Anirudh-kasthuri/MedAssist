import React from 'react';
import { ListChecks, ArrowRight, CheckSquare } from 'lucide-react';

interface RecommendationCardProps {
  recommendations: string[];
  title?: string;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendations, 
  title = "Care Plan Protocol",
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col ${className}`}>
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
             <ListChecks className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <span className="text-[10px] font-mono font-medium text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded">
          {recommendations.length} STEPS
        </span>
      </div>
      
      {/* Steps List */}
      <div className="p-2">
        <div className="space-y-1">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="group p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 flex items-start space-x-4 cursor-default border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700/50"
            >
              {/* Checkbox Visual */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-transparent group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors">
                  {idx + 1}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed group-hover:text-black dark:group-hover:text-white transition-colors">
                  {rec}
                </p>
                
                {/* Contextual Action */}
                <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                   <button className="flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                      <span>ADD TO PATIENT NOTES</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;