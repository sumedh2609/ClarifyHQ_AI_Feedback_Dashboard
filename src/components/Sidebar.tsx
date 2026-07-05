// import { Inbox, BarChart3, Settings, Sparkles } from 'lucide-react';

// type ViewType = 'inbox' | 'analytics' | 'settings';

// interface SidebarProps {
//   activeView: ViewType;
//   onViewChange: (view: ViewType) => void;
// }

// const navItems = [
//   { id: 'inbox' as const, label: 'Feedback Inbox', icon: Inbox },
//   { id: 'analytics' as const, label: 'Analytics Dashboard', icon: BarChart3 },
//   { id: 'settings' as const, label: 'AI Prompt Settings', icon: Settings },
// ];

// export function Sidebar({ activeView, onViewChange }: SidebarProps) {
//   return (
//     <aside className="w-64 h-screen bg-alabaster border-r border-border flex flex-col">
//       <div className="p-6 border-b border-border">
//         <div className="flex items-center gap-2">
//           <div className="w-9 h-9 bg-terracotta rounded-lg flex items-center justify-center">
//             <Sparkles className="w-5 h-5 text-white" />
//           </div>
//           <div>
//             <h1 className="font-semibold text-charcoal">FeedbackIQ</h1>
//             <p className="text-xs text-umber">AI Triage Engine</p>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 p-4">
//         <ul className="space-y-1">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <li key={item.id}>
//                 <button
//                   onClick={() => onViewChange(item.id)}
//                   className={`sidebar-item w-full ${activeView === item.id ? 'active' : ''}`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.label}</span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       <div className="p-4 border-t border-border">
//         <div className="card text-xs text-umber">
//           <p className="font-medium text-charcoal mb-1">AI Status</p>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-sage rounded-full animate-pulse" />
//             <span>System Online</span>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }





import { Inbox, BarChart3, Settings, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

type ViewType = 'inbox' | 'analytics' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems = [
  { id: 'inbox' as const, label: 'Feedback Inbox', icon: Inbox },
  { id: 'analytics' as const, label: 'Analytics Dashboard', icon: BarChart3 },
  { id: 'settings' as const, label: 'AI Prompt Settings', icon: Settings },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    // 'group' allows the sidebar to expand smoothly on hover, pushing the content gently
    <aside className="group w-20 hover:w-56 h-screen bg-[#F7F1DE] flex flex-col z-50 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out relative">
      
      {/* Logo Area */}
      <div className="p-4 flex flex-col items-center justify-center mt-4 mb-4 whitespace-nowrap overflow-hidden">
        <img 
          src={logo} 
          alt="ClarifyHQ Logo" 
          className="w-16 h-16 rounded-full mb-2 shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 object-cover border border-gray-200"
        />
        {/* Text hides when collapsed, shows when hovered */}
        <h1 className="font-bold text-charcoal text-lg tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">ClarifyHQ</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 overflow-hidden">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-white text-charcoal shadow-sm' 
                      : 'text-umber hover:bg-white/50 hover:text-charcoal'
                  }`}
                  title={item.label} // Shows tooltip when collapsed
                >
                  <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-charcoal' : ''}`} />
                  <span className="whitespace-nowrap font-medium ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 overflow-hidden border-t border-[#E8DFD1]/50">
        <button className="w-full flex items-center p-3 rounded-xl text-umber hover:bg-white/50 hover:text-charcoal transition-colors font-medium text-sm" title="Log out">
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="whitespace-nowrap ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Log out</span>
        </button>
      </div>
    </aside>
  );
}