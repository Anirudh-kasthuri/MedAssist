import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Activity, 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Loader2, 
  BrainCircuit, 
  FileText, 
  Stethoscope, 
  Cpu,
  CheckCircle2,
  ScanEye,
  Mic,
  AlignLeft,
  Check,
  Circle,
  FileUp,
  AudioWaveform,
  Heart
} from 'lucide-react';
import { analyzeMedicalImage, analyzeMedicalText } from '../../services/geminiService';
import { DiagnosticResult, Language, User } from '../../types';
import { generateHealthReport } from '../../services/pdfService';
import LiveConsultation from './LiveConsultation';
import MedicalImageUpload from '../Shared/MedicalImageUpload';
import VoiceRecorder from '../Shared/VoiceRecorder';
import LiveTranscriptPanel from '../Shared/LiveTranscriptPanel';
import DiagnosisCard from '../Shared/DiagnosisCard';
import RecommendationCard from '../Shared/RecommendationCard';
import ErrorState from '../Shared/ErrorState';
import EmptyState from '../Shared/EmptyState';
import LanguageSelector from '../Shared/LanguageSelector';

interface AnalysisViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onBack: () => void;
  initialTab?: 'image' | 'voice' | 'text';
  user: User;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ language, onLanguageChange, onBack, initialTab = 'image', user }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'voice' | 'text'>(initialTab);
  
  // Data State
  const [fileData, setFileData] = useState<{ base64: string, mimeType: string } | null>(null);
  const [textInput, setTextInput] = useState("");
  
  // Voice State
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [interimVoiceText, setInterimVoiceText] = useState("");
  
  // Process State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  // Display Result handles the "translated" version for the UI
  const [displayResult, setDisplayResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset tab if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
    clearSession();
  }, [initialTab]);

  // Handle Mock Translation when Language Changes
  useEffect(() => {
    if (result) {
      // If we have a result, we simulate translation to show the UI effect immediately
      // In a real app, this might trigger a lightweight re-query or use a client-side translator
      const prefixes: Record<string, string> = {
        [Language.HINDI]: "[अनुवादित] ",
        [Language.TELUGU]: "[అనువదించబడింది] "
      };
      const prefix = prefixes[language] || "";
      const suffix = language !== Language.ENGLISH ? ` (${language})` : "";

      // Only apply changes if not English, or reset if English
      if (language === Language.ENGLISH) {
        setDisplayResult(result);
      } else {
        setDisplayResult({
          ...result,
          title: `${result.title}${suffix}`,
          summary: `${prefix}${result.summary}`,
          technicalAnalysis: result.technicalAnalysis ? `${prefix}${result.technicalAnalysis}` : undefined,
          recommendations: result.recommendations.map(r => `${prefix}${r}`),
          disclaimer: `${prefix}${result.disclaimer}`
        });
      }
    } else {
      setDisplayResult(null);
    }
  }, [result, language]);

  // --- Clinical Loading Simulation Steps ---
  const imageSteps = [
    "Encrypting & uploading DICOM data...",
    "Segmenting region of interest (ROI)...",
    "Cross-referencing clinical dataset...",
    "Generating diagnostic assessment..."
  ];

  const textSteps = [
    "Tokenizing symptom ontology...",
    "Checking pharmacological interactions...",
    "Accessing medical knowledge base...",
    "Formulating clinical assessment..."
  ];

  const simulateLoadingSteps = async (steps: string[]) => {
    setProcessingSteps(steps);
    
    // Iterate through steps 0, 1, 2, 3
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      // Random delay between steps for realism (800ms - 1500ms)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    }
  };

  // --- Handlers ---
  const handleFileUpload = (file: File | null) => {
    setResult(null);
    setDisplayResult(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        const mimeType = base64String.split(';')[0].split(':')[1];
        setFileData({ base64, mimeType });
      };
      reader.readAsDataURL(file);
    } else {
      setFileData(null);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!fileData) return;
    setIsAnalyzing(true);
    setResult(null);
    setDisplayResult(null);
    setError(null);
    
    try {
      const loadingPromise = simulateLoadingSteps(imageSteps);
      const analysisPromise = analyzeMedicalImage(fileData.base64, fileData.mimeType, language);
      const [_, data] = await Promise.all([loadingPromise, analysisPromise]);
      setResult(data);
    } catch (e) {
      console.error(e);
      setError("Analysis Failed: Unable to process image data. Please retry with a clearer image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setDisplayResult(null);
    setError(null);
    
    try {
      const loadingPromise = simulateLoadingSteps(textSteps);
      const analysisPromise = analyzeMedicalText(textInput, language);
      const [_, data] = await Promise.all([loadingPromise, analysisPromise]);
      setResult(data);
    } catch (e) {
      console.error(e);
      setError("Analysis Failed: Service temporarily unavailable. Please check connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSession = () => {
    setFileData(null);
    setResult(null);
    setDisplayResult(null);
    setError(null);
    setTextInput("");
    setInterimVoiceText("");
    setCurrentStep(0);
    setIsAnalyzing(false);
  };

  // --- UI Helpers ---
  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => { setActiveTab(id); clearSession(); }}
      className={`
        flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-all duration-200 border-b-2
        ${activeTab === id 
          ? 'border-black dark:border-white text-black dark:text-white' 
          : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  // --- Dynamic Empty State Props based on active tab ---
  const getEmptyStateProps = () => {
    switch(activeTab) {
      case 'image':
        return {
          icon: FileUp,
          title: "Waiting for Imagery",
          description: "Upload an X-Ray, MRI, or dermatology photo in the panel to the left to begin analysis."
        };
      case 'voice':
        return {
          icon: AudioWaveform,
          title: "Ready for Consultation",
          description: "Start the live session on the left to begin a real-time voice triage assessment."
        };
      case 'text':
        return {
          icon: MessageSquare,
          title: "Awaiting Symptoms",
          description: "Describe the patient's condition via text or dictation to generate a clinical assessment."
        };
      default:
        return {
          icon: Stethoscope,
          title: "Ready for Analysis",
          description: "Select a modality to begin the diagnostic protocol."
        };
    }
  };

  const emptyProps = getEmptyStateProps();

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] max-w-7xl mx-auto pb-12">
      
      {/* Navigation Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          disabled={isAnalyzing}
          className={`group flex items-center space-x-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors px-2 py-1 -ml-2 rounded-lg ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-mono text-xs uppercase tracking-widest">Back to Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* ========================================================
            SECTION 1: PATIENT INPUT (Left Column)
           ======================================================== */}
        <section className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full transition-colors duration-500">
            
            {/* S1 Header */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">01 / Data Acquisition</h2>
              <div className="flex space-x-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                 <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              </div>
            </div>

            {/* S1 Tabs */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-2">
              <TabButton id="image" label="Scan" icon={Camera} />
              <TabButton id="text" label="Symptom Chat" icon={MessageSquare} />
              <TabButton id="voice" label="Live Consult" icon={Activity} />
            </div>

            {/* S1 Content */}
            <div className="p-6 flex-1 flex flex-col relative">
              
              {/* --- IMAGE INPUT --- */}
              {activeTab === 'image' && (
                <div className="flex flex-col h-full animate-fade-in">
                  
                  {/* Clearly Labeled Image Section */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center mb-1">
                      <ScanEye className="w-5 h-5 mr-2.5 text-black dark:text-white" />
                      Upload Medical Image
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Upload <span className="font-medium text-zinc-700 dark:text-zinc-300">X-rays, MRIs, CT scans</span>, or dermatology photos.
                    </p>
                  </div>

                  <div className="flex-1">
                    <MedicalImageUpload 
                      onFileSelect={handleFileUpload} 
                      className="h-full min-h-[300px]"
                      disabled={isAnalyzing}
                      isScanning={isAnalyzing}
                    />
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={handleAnalyzeImage}
                      disabled={!fileData || isAnalyzing}
                      className="w-full bg-black dark:bg-white text-white dark:text-black h-12 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                      <span>{isAnalyzing ? "Processing Request..." : "Run Analysis"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* --- TEXT & VOICE INPUT --- */}
              {activeTab === 'text' && (
                <div className="flex flex-col h-full animate-fade-in">
                  
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center mb-1">
                      <AlignLeft className="w-5 h-5 mr-2.5 text-black dark:text-white" />
                      Symptom Description
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Document patient history and vitals via text or voice.
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col space-y-4">
                    
                    {/* Live Transcript Panel */}
                    <div className="mb-2">
                       <LiveTranscriptPanel 
                         transcript={textInput + (interimVoiceText ? ' ' + interimVoiceText : '')}
                         isRecording={isVoiceRecording}
                         className="h-48"
                       />
                    </div>

                    {/* Clearly Labeled Voice Section */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                       <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center uppercase tracking-wider">
                            <Mic className="w-3.5 h-3.5 mr-2" />
                            Dictate Notes
                          </label>
                          <span className="text-[10px] text-blue-600/60 dark:text-blue-400/60 font-medium">
                            Auto-transcribed
                          </span>
                       </div>
                       <VoiceRecorder 
                          onTranscriptComplete={(text) => setTextInput(prev => (prev + ' ' + text).trim())}
                          onLiveTranscript={setInterimVoiceText}
                          onStateChange={setIsVoiceRecording}
                          isCompact={true}
                          disabled={isAnalyzing}
                       />
                    </div>

                    {/* Manual Text Fallback (Hidden if recording mainly, but available) */}
                    <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800/50 focus-within:ring-2 ring-black dark:ring-white transition-all relative min-h-[100px]">
                      <textarea
                        className="w-full h-full bg-transparent resize-none focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 text-sm leading-relaxed font-light"
                        placeholder="Manual edits..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={handleAnalyzeText}
                      disabled={!textInput.trim() || isAnalyzing}
                      className="w-full bg-black dark:bg-white text-white dark:text-black h-12 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>{isAnalyzing ? "Processing..." : "Analyze Symptoms"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* --- LIVE CONSULT INPUT --- */}
              {activeTab === 'voice' && (
                <div className="h-full w-full animate-fade-in flex flex-col">
                   <div className="mb-4">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center mb-1">
                        <Activity className="w-5 h-5 mr-2.5 text-black dark:text-white" />
                        Real-time Consultation
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Interactive audio session for triage and Q&A.
                      </p>
                   </div>
                   <div className="flex-1">
                      <LiveConsultation language={language} />
                   </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            RIGHT COLUMN: HANDLES SECTION 2 (Processing) & SECTION 3 (Results)
           ======================================================== */}
        <section className="lg:col-span-7 flex flex-col h-full">
          <div className={`bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full overflow-hidden flex flex-col transition-colors duration-500 ${!result && !isAnalyzing && !error ? 'bg-zinc-50/50 dark:bg-zinc-900/50' : ''}`}>
             
             {/* Header */}
             <div className="bg-zinc-50 dark:bg-zinc-950/50 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center h-[57px]">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  {isAnalyzing ? "02 / Processing Protocol" : "03 / Clinical Assessment"}
                </h2>
                
                {/* Result Actions / Controls */}
                <div className="flex items-center space-x-3">
                  {/* Mini Vitals - Interview Candy */}
                  <div className="hidden md:flex items-center space-x-3 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 mr-2 opacity-60 hover:opacity-100 transition-opacity">
                     <div className="flex items-center space-x-1.5">
                       <Heart className="w-3 h-3 text-emerald-500 animate-pulse" fill="currentColor" />
                       <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">72 BPM</span>
                     </div>
                     <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-600"></div>
                     <div className="flex items-center space-x-1">
                       <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300">98% SPO2</span>
                     </div>
                  </div>

                  {displayResult && !isAnalyzing && (
                     <LanguageSelector 
                       currentLanguage={language} 
                       onLanguageChange={onLanguageChange} 
                       variant="segmented" 
                     />
                  )}

                  {displayResult && !isAnalyzing && (
                    <button 
                      onClick={() => generateHealthReport(user, displayResult)}
                      className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Export PDF</span>
                    </button>
                  )}
                </div>
             </div>

             <div className="p-6 flex-1 overflow-y-auto custom-scrollbar relative">
                
                {/* ------------------------------------------------
                    SECTION 2: AI PROCESSING (Structured Step Indicator)
                   ------------------------------------------------ */}
                {isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                      
                      {/* Central Icon */}
                      <div className="mb-8 flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-ping opacity-75"></div>
                          <div className="relative bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full border border-blue-100 dark:border-blue-900/50">
                            <BrainCircuit className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Step List */}
                      <div className="space-y-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10"></div>

                        {processingSteps.map((step, index) => {
                           const isCompleted = index < currentStep;
                           const isActive = index === currentStep;
                           const isPending = index > currentStep;

                           return (
                             <div key={index} className="flex items-start space-x-4 transition-all duration-500">
                               {/* Status Icon */}
                               <div className="flex-shrink-0 bg-white dark:bg-zinc-950 z-10">
                                 {isCompleted ? (
                                   <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                   </div>
                                 ) : isActive ? (
                                   <div className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center border-2 border-blue-500">
                                      <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                                   </div>
                                 ) : (
                                   <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                      <Circle className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
                                   </div>
                                 )}
                               </div>
                               
                               {/* Text Label */}
                               <div className={`pt-0.5 transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                                 <p className={`text-sm font-medium leading-none ${
                                   isActive ? 'text-blue-600 dark:text-blue-400' :
                                   isCompleted ? 'text-zinc-500 dark:text-zinc-500 line-through decoration-zinc-300' :
                                   'text-zinc-400 dark:text-zinc-600'
                                 }`}>
                                   {step}
                                 </p>
                                 {isActive && (
                                   <p className="text-[10px] text-zinc-400 mt-1.5 font-mono animate-pulse">
                                     Processing...
                                   </p>
                                 )}
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md mt-6 px-1">
                      <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-400">
                         <span>Step {currentStep + 1}/{processingSteps.length}</span>
                         <span>{Math.round(((currentStep + 1) / processingSteps.length) * 100)}% Complete</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------
                    SECTION 3: MEDICAL RESULTS
                   ------------------------------------------------ */}
                
                {/* Success State */}
                {!isAnalyzing && displayResult && (
                   <div className="space-y-6">
                      <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2 animate-fade-in">
                         <CheckCircle2 className="w-5 h-5" />
                         <span className="text-xs font-bold uppercase tracking-widest">Analysis Complete</span>
                      </div>

                      <div className="animate-enter delay-100">
                        <DiagnosisCard 
                          title={displayResult.title} 
                          summary={displayResult.summary} 
                          technicalAnalysis={displayResult.technicalAnalysis}
                          confidence={displayResult.confidence}
                          severity={displayResult.severity} 
                          role={user.role}
                        />
                      </div>
                      
                      <div className="animate-enter delay-200">
                        <RecommendationCard recommendations={displayResult.recommendations} />
                      </div>
                   </div>
                )}

                {/* Error State */}
                {!isAnalyzing && error && (
                   <div className="h-full flex items-center justify-center">
                     <ErrorState 
                       message={error} 
                       onRetry={() => activeTab === 'image' ? handleAnalyzeImage() : handleAnalyzeText()} 
                     />
                   </div>
                )}

                {/* Empty State */}
                {!isAnalyzing && !displayResult && !error && (
                   <div className="h-full flex items-center justify-center">
                      <EmptyState
                        icon={emptyProps.icon}
                        title={emptyProps.title}
                        description={emptyProps.description}
                      />
                   </div>
                )}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalysisView;