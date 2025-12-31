import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  variant?: 'header' | 'settings' | 'segmented';
}

const languages = [
  { code: 'EN', value: Language.ENGLISH, label: 'English', native: 'English' },
  { code: 'HI', value: Language.HINDI, label: 'Hindi', native: 'हिंदी' },
  { code: 'TE', value: Language.TELUGU, label: 'Telugu', native: 'తెలుగు' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange,
  variant = 'header'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = languages.find(l => l.value === currentLanguage) || languages[0];

  // Variant 1: Segmented Control (High visibility for Results View)
  if (variant === 'segmented') {
    return (
       <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-inner">
         {languages.map((lang) => {
           const isActive = currentLanguage === lang.value;
           return (
             <button
               key={lang.code}
               onClick={() => onLanguageChange(lang.value)}
               className={`
                 px-3 py-1.5 text-[10px] font-bold rounded-md transition-all duration-200 uppercase tracking-wide
                 ${isActive 
                   ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                   : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                 }
               `}
             >
               {lang.code}
             </button>
           );
         })}
       </div>
    );
  }

  // Variant 2: Settings List Item
  if (variant === 'settings') {
    return (
       <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-48 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-transparent focus:border-black dark:focus:border-white outline-none"
        >
          <span className="flex items-center space-x-2">
            <span>{selected.label}</span>
            <span className="text-zinc-400 text-xs font-mono">({selected.code})</span>
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-full bg-white dark:bg-black rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1 z-50 animate-enter overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-black dark:text-white">{lang.label}</span>
                  <span className="text-xs text-zinc-400">{lang.native}</span>
                </div>
                {currentLanguage === lang.value && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        )}
       </div>
    );
  }

  // Variant 3: Header Compact Dropdown (Default)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
        title="Change Language"
      >
        <Globe className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        <span className="text-xs font-bold text-black dark:text-white">{selected.code}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 py-1 z-50 animate-enter origin-top-right">
          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Language</span>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                 <span className="text-xs font-mono text-zinc-400 w-6">{lang.code}</span>
                 <span className={`text-sm font-medium ${currentLanguage === lang.value ? 'text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                   {lang.native}
                 </span>
              </div>
              {currentLanguage === lang.value && (
                <Check className="w-3 h-3 text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;