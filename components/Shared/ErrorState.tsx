import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Unable to Process", 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`rounded-2xl p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center animate-fade-in ${className}`}>
      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      
      <h3 className="text-sm font-bold text-red-900 dark:text-red-200 uppercase tracking-wide mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-red-700 dark:text-red-300 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-black border border-red-200 dark:border-red-800 rounded-full text-red-700 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Analysis</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;