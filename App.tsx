import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Layout/Sidebar';
import DashboardView from './components/Dashboard/DashboardView';
import AnalysisView from './components/Analysis/AnalysisView';
import LoginView from './components/Auth/LoginView';
import SettingsView from './components/Settings/SettingsView';
import LaunchpadView from './components/Launchpad/LaunchpadView';
import LanguageSelector from './components/Shared/LanguageSelector';
import { ViewState, Language, User } from './types';
import { getHiddenHealthTip } from './services/geminiService';
import { getSession, logout, getStoredUsers, switchUser } from './services/backendService';
import { X, Sparkles, LogOut, Moon, Sun, Menu, ArrowLeft, UserPlus, ChevronDown, BookOpen, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Default to LAUNCHPAD for fast access
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LAUNCHPAD);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  
  // Layout & Theme State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState(false);
  
  // Profile Menu State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

    // Close profile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  const handleAddAccount = async () => {
    // Determine if we just want to clear session or keep state.
    // For "Add Account", we clear the current user state so LoginView renders,
    // but we don't clear the localStorage (so other users persist).
    await logout(); 
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  const handleSwitchUser = async (targetUserId: string) => {
    const newUser = await switchUser(targetUserId);
    if (newUser) {
      setUser(newUser);
      setIsProfileMenuOpen(false);
      setCurrentView(ViewState.LAUNCHPAD); // Reset view on switch
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Logic for Logo Long Press (Easter Egg) ---
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

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

  // Common Back Button Component
  const BackButton = () => (
    <div className="flex items-center mb-6">
      <button 
        onClick={() => setCurrentView(ViewState.LAUNCHPAD)}
        className="group flex items-center space-x-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors px-2 py-1 -ml-2 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="font-medium text-sm">Return Home</span>
      </button>
    </div>
  );

  const mainClasses = `min-h-screen font-sans antialiased selection:bg-zinc-200 selection:text-black dark:selection:bg-zinc-800 dark:selection:text-white transition-colors duration-300 ${theme === 'dark' ? 'dark bg-black text-white' : 'bg-white text-black'} ${highContrast ? 'grayscale contrast-125' : ''}`;

  // If not logged in, show Login View
  if (!user) {
    return (
      <div className={mainClasses}>
         <LoginView onLogin={setUser} />
      </div>
    );
  }

  // Get all users for the switcher
  const storedUsers = getStoredUsers();

  return (
    <div className={mainClasses}>
      
      {/* Background Ambience - Removed for Strict Monochrome */}
      {/* No colored blur or blobs. Pure White/Black */}

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
        className={`pt-6 px-4 md:pr-12 pb-24 md:pb-6 min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-28' : 'md:pl-72'}`}
      >
        
        {/* Header */}
        {currentView !== ViewState.SETTINGS && (
        <header className="flex justify-between items-center mb-8 h-12 sticky top-4 z-40 md:static md:h-auto px-2">
           <div className="flex items-center space-x-2">
             {/* Mobile Menu Toggle */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 -ml-2 rounded-lg text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
             >
               <Menu className="w-6 h-6" />
             </button>

             <div 
               className="flex items-center space-x-2 cursor-pointer select-none md:hidden"
             >
               <span className="text-sm font-bold text-black dark:text-white">MedAssist</span>
             </div>
           </div>

           <div className="flex items-center space-x-2 md:space-x-6">
              
              {/* Theme Toggle Icon */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Selector */}
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={setLanguage} 
                variant="header"
              />

              {/* User Profile / Multi-User Switcher */}
              <div className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800" ref={profileMenuRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 group outline-none"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-black dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">ID: {user.id.slice(-4)}</p>
                  </div>
                  <div className="relative">
                     <img 
                      src={user.avatar} 
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black dark:group-hover:border-white shadow-sm cursor-pointer grayscale group-hover:grayscale-0 transition-all duration-300" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5 border border-zinc-200 dark:border-zinc-800">
                      <ChevronDown className="w-3 h-3 text-zinc-500" />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-black rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-enter origin-top-right z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Active Account</p>
                      <div className="flex items-center space-x-3">
                         <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                         <div className="overflow-hidden">
                            <p className="text-sm font-bold text-black dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                              {user.role}
                            </span>
                         </div>
                      </div>
                    </div>

                    {/* User List */}
                    <div className="py-2 max-h-48 overflow-y-auto custom-scrollbar">
                      <p className="px-5 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Switch Profile</p>
                      {storedUsers.filter(u => u.id !== user.id).map((u) => (
                        <button 
                          key={u.id}
                          onClick={() => handleSwitchUser(u.id)}
                          className="w-full px-5 py-2.5 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                             <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all" />
                             <div className="text-left">
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white">{u.name}</p>
                             </div>
                          </div>
                        </button>
                      ))}
                      {storedUsers.length <= 1 && (
                         <div className="px-5 py-2 text-xs text-zinc-400 italic">No other profiles found.</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col gap-1">
                      <button 
                        onClick={handleAddAccount}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-all text-sm font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                      >
                         <div className="p-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                           <UserPlus className="w-4 h-4" />
                         </div>
                         <span>Add Another Account</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-black hover:text-red-600 dark:hover:text-red-400 transition-all text-sm font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                      >
                         <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                           <LogOut className="w-4 h-4" />
                         </div>
                         <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </header>
        )}

        {/* Dynamic View Rendering */}
        {currentView === ViewState.LAUNCHPAD && (
          <LaunchpadView 
            onNavigate={setCurrentView} 
            userName={user.name} 
          />
        )}

        {currentView === ViewState.DASHBOARD && (
          <DashboardView onViewChange={setCurrentView} />
        )}

        {currentView === ViewState.IMAGE_ANALYSIS && (
          <AnalysisView 
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setCurrentView(ViewState.LAUNCHPAD)}
            initialTab="image"
            user={user}
          />
        )}
        
        {currentView === ViewState.VOICE_ANALYSIS && (
          <AnalysisView 
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setCurrentView(ViewState.LAUNCHPAD)}
            initialTab="voice"
            user={user}
          />
        )}

        {currentView === ViewState.TEXT_ANALYSIS && (
          <AnalysisView 
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setCurrentView(ViewState.LAUNCHPAD)}
            initialTab="text"
            user={user}
          />
        )}

        {currentView === ViewState.EDUCATION && (
           <div className="flex flex-col items-center justify-center h-full text-zinc-500">
             <BookOpen className="w-12 h-12 mb-4 opacity-50" />
             <h2 className="text-xl font-bold text-black dark:text-white">Medical Library</h2>
             <p className="max-w-md text-center mt-2">Access to medical protocols and drug interaction databases coming soon.</p>
             <button onClick={() => setCurrentView(ViewState.LAUNCHPAD)} className="mt-6 text-sm underline">Return Home</button>
           </div>
        )}

        {currentView === ViewState.SETTINGS && (
          <SettingsView 
             user={user} 
             onBack={() => setCurrentView(ViewState.LAUNCHPAD)}
             highContrast={highContrast}
             setHighContrast={setHighContrast}
             language={language}
             setLanguage={setLanguage}
          />
        )}

        {/* Easter Egg Overlay */}
        {showEasterEgg && (
          <div 
             className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 animate-fade-in"
             onClick={() => setShowEasterEgg(false)}
          >
             <div className="text-center max-w-lg">
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-6 animate-spin" />
                <h3 className="text-2xl font-bold text-white mb-4">Daily Health Fact</h3>
                <p className="text-xl text-zinc-300 font-serif italic leading-relaxed">"{easterEggContent}"</p>
                <p className="text-sm text-zinc-500 mt-8">Tap anywhere to close</p>
             </div>
          </div>
        )}

        {/* Admin Secret Menu */}
        {isAdmin && (
           <div className="fixed bottom-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse z-50">
             ADMIN MODE ACTIVE
           </div>
        )}
        
        {/* Secret Footer Trigger */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-4 z-50"
          onClick={handleFooterTap}
        />

      </main>
    </div>
  );
};

export default App;