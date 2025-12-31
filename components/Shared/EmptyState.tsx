import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in min-h-[300px] select-none ${className}`}>
      {/* Icon Container with Soft Medical Styling */}
      <div className="w-20 h-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center mb-6 group transition-all duration-500 hover:scale-105 hover:shadow-sm hover:border-zinc-200 dark:hover:border-zinc-700">
        <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-500 stroke-[1.5px]" />
      </div>
      
      {/* Calm Typography */}
      <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed mb-8 mx-auto font-normal">
        {description}
      </p>

      {/* Optional Action Area */}
      {action && (
        <div className="mt-2 animate-fade-in delay-100">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;