import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import DashboardView from './components/Dashboard/DashboardView';
import AnalysisView from './components/Analysis/AnalysisView';
import LoginView from './components/Auth/LoginView';
import { ViewState, Language, User } from './types';
import { getHiddenHealthTip } from './services/geminiService';
import { getSession, logout } from './services/backendService';
import { X, Sparkles, Globe, LogOut, Moon, Sun, Menu, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  
  // Layout & Theme State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState(false);
  
  // Hidden Feature States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggContent, setEasterEggContent] = useState("");

  // Check for session on mount
  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    
    // Auto-collapse sidebar on small desktop screens
    if (window.innerWidth < 1024) {
      setIsSidebarCollapsed(true);
    }

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Logic for Logo Long Press (Easter Egg) ---
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleLogoMouseDown = () => {
    const timer = setTimeout(async () => {
      const tip = await getHiddenHealthTip();
      setEasterEggContent(tip);
      setShowEasterEgg(true);
    }, 2000); // 2 seconds long press
    setPressTimer(timer);
  };

  const handleLogoMouseUp = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  // --- Logic for Footer Triple Tap (Secret Admin Menu) ---
  const [tapCount, setTapCount] = useState(0);
  
  useEffect(() => {
    if (tapCount === 3) {
      setIsAdmin(prev => !prev);
      setTapCount(0); // Reset
    }
    const timer = setTimeout(() => setTapCount(0), 1000); 
    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleFooterTap = () => {
    setTapCount(prev => prev + 1);
  };

  // If not logged in, show Login View
  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  // Common Back Button Component
  const BackButton = () => (
    <div className="flex items-center mb-4">
      <button 
        onClick={() => setCurrentView(ViewState.DASHBOARD)}
        className="group flex items-center space-x-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-medium text-sm">Back to Dashboard</span>
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans selection:bg-teal-100 overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${highContrast ? 'grayscale contrast-125' : ''}`}>
      
      {/* Background Ambience */}
      {!highContrast && (
        <>
          <div className={`fixed -top-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob pointer-events-none transition-colors duration-500 ${theme === 'dark' ? 'bg-teal-900/20 opacity-20' : 'bg-teal-200 opacity-30'}`}></div>
          <div className={`fixed -bottom-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 pointer-events-none transition-colors duration-500 ${theme === 'dark' ? 'bg-blue-900/20 opacity-20' : 'bg-blue-200 opacity-30'}`}></div>
        </>
      )}

      {/* Navigation */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false); // Close mobile menu on navigate
        }}
        isAdmin={isAdmin}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main 
        className={`pt-6 px-4 md:pr-6 pb-24 md:pb-6 min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-64'}`}
      >
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 h-12 sticky top-4 z-40 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl md:bg-transparent md:backdrop-filter-none md:dark:bg-transparent px-3 md:px-0 shadow-sm md:shadow-none border border-slate-200/50 md:border-none dark:border-slate-800/50">
           <div className="flex items-center space-x-2">
             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
             >
               <Menu className="w-6 h-6" />
             </button>

             <div 
               className="flex items-center space-x-2 cursor-pointer select-none"
               onMouseDown={handleLogoMouseDown}
               onMouseUp={handleLogoMouseUp}
               onTouchStart={handleLogoMouseDown}
               onTouchEnd={handleLogoMouseUp}
             >
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg active:scale-95 transition-transform hover:scale-105 ${highContrast ? 'bg-black shadow-none' : theme === 'dark' ? 'bg-slate-800 shadow-slate-900' : 'bg-slate-900 shadow-slate-200'}`}>
                 AI
               </div>
               <span className="text-sm font-semibold text-slate-400 dark:text-slate-200 hidden sm:block">MedAssist</span>
             </div>
           </div>

           <div className="flex items-center space-x-2 md:space-x-4">
              
              {/* Theme Toggle Icon */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative group">
                 <button className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors flex items-center space-x-2 border border-transparent">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">{language}</span>
                 </button>
                 <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right z-50">
                    {Object.values(Language).map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-teal-600 first:rounded-t-xl last:rounded-b-xl transition-colors"
                      >
                        {lang}
                      </button>
                    ))}
                 </div>
              </div>

              {/* User Profile / Logout */}
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</p>
                  <button onClick={handleLogout} className="text-[10px] text-rose-500 hover:underline flex items-center justify-end hover:text-rose-600 transition-colors">
                    Sign Out
                  </button>
                </div>
                {/* Mobile Logout Icon */}
                <button onClick={handleLogout} className="sm:hidden text-rose-500 p-2 hover:bg-rose-50/10 rounded-full transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
                <img 
                  src={user.avatar} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 shadow-md hover:scale-110 transition-transform cursor-pointer" 
                  title="Profile"
                />
              </div>
           </div>
        </header>

        {/* View Routing with Key-based Animation Reset */}
        <div key={currentView} className="fade-in-section animate-fade-in">
          {currentView === ViewState.DASHBOARD && <DashboardView onViewChange={setCurrentView} />}
          
          {(currentView === ViewState.IMAGE_ANALYSIS) && (
            <AnalysisView 
              language={language} 
              onBack={() => setCurrentView(ViewState.DASHBOARD)} 
              initialTab="image"
            />
          )}

          {(currentView === ViewState.VOICE_ANALYSIS) && (
            <AnalysisView 
              language={language} 
              onBack={() => setCurrentView(ViewState.DASHBOARD)} 
              initialTab="voice"
            />
          )}

          {(currentView === ViewState.TEXT_ANALYSIS) && (
            <AnalysisView 
              language={language} 
              onBack={() => setCurrentView(ViewState.DASHBOARD)} 
              initialTab="text"
            />
          )}
          
          {currentView === ViewState.EDUCATION && (
            <div className="flex flex-col h-full">
              <BackButton />
              <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 dark:text-slate-500 animate-pulse">
                <Sparkles className="w-12 h-12 mb-4 text-slate-200 dark:text-slate-700" />
                <p>Patient Education Modules Loading...</p>
              </div>
            </div>
          )}
          
          {currentView === ViewState.SETTINGS && (
            <div className={`glass-panel p-8 rounded-2xl max-w-2xl mx-auto ${highContrast ? 'border-2 border-black bg-white' : ''}`}>
              <BackButton />
              <h2 className="text-xl font-bold mb-4 dark:text-white">System Settings</h2>
              <div className="space-y-4">
                 
                 {/* High Contrast Toggle */}
                 <div 
                   onClick={() => setHighContrast(!highContrast)}
                   className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                 >
                    <span className="text-sm font-medium dark:text-slate-200">High Contrast Mode</span>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${highContrast ? 'bg-black' : 'bg-slate-200 dark:bg-slate-600'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-1 left-1 transition-transform duration-300 ${highContrast ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                 </div>

                 <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium dark:text-slate-200">Data Persistence</span>
                      <span className="text-xs text-slate-400 dark:text-slate-400">PostgreSQL Sync Active</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Secret Trigger */}
      <footer 
        className="hidden md:block fixed bottom-0 right-0 p-4 text-[10px] text-slate-300 dark:text-slate-500 select-none cursor-default z-0 opacity-50 hover:opacity-100 transition-opacity"
        onClick={handleFooterTap}
      >
        v2.1.0 {isAdmin && <span className="text-teal-400 ml-2">● DEV_MODE</span>}
      </footer>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden transform transition-all hover:scale-105 border dark:border-slate-700">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500 animate-spin-slow" />
              <h3 className="font-bold text-slate-800 dark:text-white">Daily Wisdom</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium leading-relaxed font-serif italic">
              "{easterEggContent}"
            </p>
          </div>
        </div>
      )}

      {/* Global Styles for Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default App;