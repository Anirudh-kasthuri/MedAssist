import React from 'react';
import { ViewState } from '../../types';
import { Home, ScanEye, Mic, MessageSquare, BookOpen, Settings, HeartPulse, ChevronLeft, ChevronRight, X, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isAdmin: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isAdmin, 
  isCollapsed, 
  toggleCollapse,
  isMobileMenuOpen,
  closeMobileMenu
}) => {
  const navItems = [
    { id: ViewState.LAUNCHPAD, icon: Home, label: 'Home' },
    { id: ViewState.DASHBOARD, icon: LayoutDashboard, label: 'Overview' },
    { id: ViewState.IMAGE_ANALYSIS, icon: ScanEye, label: 'Scan' },
    { id: ViewState.VOICE_ANALYSIS, icon: Mic, label: 'Voice' },
    { id: ViewState.TEXT_ANALYSIS, icon: MessageSquare, label: 'Chat' },
    { id: ViewState.EDUCATION, icon: BookOpen, label: 'Learn' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <nav 
        className={`
          fixed top-0 left-0 h-full z-50 
          bg-white dark:bg-black
          border-r border-zinc-200 dark:border-white/5
          flex flex-col justify-between py-8
          transition-transform duration-300 ease-in-out
          md:shadow-none shadow-xl
          
          /* Mobile: fixed width, transform based on open state */
          w-72
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          
          /* Desktop: always visible, width adjustable */
          md:translate-x-0 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        <div className="flex flex-col w-full px-4 space-y-8">
          {/* Logo Area */}
          <div className="flex items-center justify-between">
             <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'px-2 space-x-3'} transition-all duration-300`}>
                <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-xl shadow-lg border border-transparent">
                  <HeartPulse className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className={`text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 text-black dark:text-white ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                  MedAssist
                </span>
             </div>
             {/* Mobile Close Button */}
             <button onClick={closeMobileMenu} className="md:hidden p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500">
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Navigation Items */}
          <div className="w-full space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                  currentView === item.id
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' // Active: Black (Light) / White (Dark)
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white' // Inactive
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${currentView === item.id ? 'stroke-2' : 'stroke-[1.5px]'}`} />
                
                <span className={`ml-4 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                  {item.label}
                </span>

                {/* Tooltip for collapsed desktop state */}
                {isCollapsed && (
                  <div className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl border border-zinc-800 dark:border-zinc-200">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center w-full px-4 space-y-4">
          <button 
            onClick={toggleCollapse}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hidden md:block transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;