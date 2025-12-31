import React, { useState } from 'react';
import { 
  FileText, 
  Eye, 
  EyeOff, 
  Download, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft
} from 'lucide-react';
import { User, Language } from '../../types';
import { generateHealthReport } from '../../services/pdfService';
import LanguageSelector from '../Shared/LanguageSelector';

interface SettingsViewProps {
  user: User;
  onBack: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  user, 
  onBack, 
  highContrast, 
  setHighContrast,
  language,
  setLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'reports'>('general');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    // Simulate generation delay
    setTimeout(() => {
      generateHealthReport(user);
      setIsExporting(false);
    }, 1500);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Back</span>
          </button>
          <h1 className="text-3xl font-light text-black dark:text-white">Settings</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-1">
        <TabButton id="general" label="General Preference" icon={Smartphone} />
        <TabButton id="reports" label="Records & Export" icon={FileText} />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-12 animate-fade-in">
        
        {/* --- GENERAL TAB --- */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800">
               <h3 className="text-lg font-medium text-black dark:text-white mb-4">Accessibility</h3>
               
               <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 rounded-xl mb-3 hover:bg-white dark:hover:bg-zinc-900 transition-colors cursor-pointer" onClick={() => setHighContrast(!highContrast)}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${highContrast ? 'bg-black text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
                       {highContrast ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div>
                       <p className="font-medium text-black dark:text-white">High Contrast Mode</p>
                       <p className="text-xs text-zinc-500">Increases visual distinction for better readability.</p>
                    </div>
                  </div>
                  {/* Strict Black/White Toggle */}
                  <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${highContrast ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                    <div className={`w-4 h-4 rounded-full shadow-sm absolute top-1 left-1 transition-transform duration-300 ${highContrast ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-0 bg-white dark:bg-black'}`}></div>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800">
               <h3 className="text-lg font-medium text-black dark:text-white mb-4">Localization</h3>
               <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                       <Globe className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-medium text-black dark:text-white">System Language</p>
                       <p className="text-xs text-zinc-500">Affects UI and AI response language.</p>
                    </div>
                  </div>
                  <LanguageSelector 
                    currentLanguage={language} 
                    onLanguageChange={setLanguage} 
                    variant="settings" 
                  />
               </div>
            </div>
          </div>
        )}

        {/* --- REPORTS TAB --- */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-medium text-black dark:text-white">Export Health Record</h3>
                  <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                    Generate a PDF report of your symptoms, diagnoses, and AI consultations.
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                     <CheckCircle className="w-3 h-3 text-teal-500" />
                     <span className="text-xs text-zinc-400">Includes encrypted timestamp</span>
                  </div>
               </div>
               
               <button 
                 onClick={handleExportPDF}
                 disabled={isExporting}
                 className="flex flex-col items-center justify-center w-32 h-32 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group disabled:opacity-70 disabled:cursor-wait"
               >
                 <div className={`p-3 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors mb-2 ${isExporting ? 'animate-bounce' : ''}`}>
                    <Download className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white">
                    {isExporting ? 'Generating...' : 'Download PDF'}
                 </span>
               </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800">
              <h3 className="text-lg font-medium text-black dark:text-white mb-4">Data Management</h3>
              
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 flex items-start space-x-4">
                 <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                 <div>
                    <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm">Danger Zone</h4>
                    <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-1 mb-3 leading-relaxed">
                      Permanently delete all local and cloud data associated with this account. This action cannot be undone.
                    </p>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-600 dark:text-rose-500 text-xs font-bold hover:bg-rose-50 transition-colors">
                      Delete Account
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;