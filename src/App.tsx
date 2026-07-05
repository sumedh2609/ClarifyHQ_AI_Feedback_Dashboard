import { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { FeedbackInbox } from './components/FeedbackInbox';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AIPromptSettings } from './components/AIPromptSettings';
import { Bell, User, Settings, ChevronDown } from 'lucide-react';

type ViewType = 'inbox' | 'analytics' | 'settings';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('inbox');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Menu States
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  
  // Timer Refs for Hover Delay
  const notifTimeout = useRef<any>(null);
  const profileTimeout = useRef<any>(null);

  const handleProcessComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // --- HOVER DELAY HANDLERS ---
  const handleNotifEnter = () => {
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    setShowNotifMenu(true);
  };
  const handleNotifLeave = () => {
    notifTimeout.current = setTimeout(() => setShowNotifMenu(false), 300);
  };

  const handleProfileEnter = () => {
    if (profileTimeout.current) clearTimeout(profileTimeout.current);
    setShowProfileMenu(true);
  };
  const handleProfileLeave = () => {
    profileTimeout.current = setTimeout(() => setShowProfileMenu(false), 300);
  };

  // Helper to close all menus instantly on click
  const closeAllMenus = () => {
    setShowNotifMenu(false);
    setShowProfileMenu(false);
  };

  return (
    <div className="flex h-screen bg-[#F9F8F6] overflow-hidden relative">
      
      {/* Invisible Overlay for click-outside dismissal */}
      {(showNotifMenu || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={closeAllMenus}
        />
      )}

      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Top Navigation Bar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-50">
          
          {/* Left Side: Page Title */}
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-charcoal capitalize">
              {activeView === 'inbox' ? 'Feedback Inbox' : activeView === 'analytics' ? 'Analytics' : 'Settings'}
            </h1>
          </div>

          {/* Right Side: Notifications & Profile */}
          <div className="flex items-center gap-5">
            
            {/* Notification Bell */}
            <div 
              className="relative"
              onMouseEnter={handleNotifEnter}
              onMouseLeave={handleNotifLeave}
            >
              <button 
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center relative transition-colors cursor-pointer"
                onClick={handleNotifEnter}
              >
                <Bell className="w-5 h-5 text-charcoal" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#B55B49] rounded-full border-2 border-white"></span>
              </button>
              
              {showNotifMenu && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-md border border-gray-200 shadow-elevated rounded-xl overflow-hidden animate-fade-in">
                  <div className="p-3 border-b border-gray-100 font-semibold text-sm text-charcoal">Recent Alerts</div>
                  <div className="p-3 text-sm text-umber hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                    <span className="text-[#B55B49] font-medium block">Critical Bug Detected</span>
                    Login screen crash reported by 3 users.
                  </div>
                  <div className="p-3 text-sm text-umber hover:bg-gray-50 cursor-pointer">
                    <span className="text-[#6B7552] font-medium block">Triage Complete</span>
                    AI successfully categorized 42 pending items.
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
            >
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleProfileEnter}
              >
                <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white shadow-sm overflow-hidden border-2 border-white">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=4E220F" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <ChevronDown className="w-4 h-4 text-charcoal" />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md border border-gray-200 shadow-elevated rounded-xl overflow-hidden animate-fade-in py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-terracotta/10 hover:text-terracotta flex items-center gap-2 transition-colors">
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-terracotta/10 hover:text-terracotta flex items-center gap-2 transition-colors">
                    <Settings className="w-4 h-4" /> Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {activeView === 'inbox' && (
            <FeedbackInbox refreshTrigger={refreshTrigger} onProcessComplete={handleProcessComplete} />
          )}
          {activeView === 'analytics' && (
            <AnalyticsDashboard refreshTrigger={refreshTrigger} />
          )}
          {activeView === 'settings' && <AIPromptSettings />}
        </main>
      </div>
    </div>
  );
}

export default App;