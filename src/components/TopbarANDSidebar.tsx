import { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { create } from 'zustand'; 
import { 
  Users, FileText, LayoutGrid, Sun, Moon, 
  LogOut, ChevronLeft, Search, MoreVertical 
} from "lucide-react";

// --- 1. TYPES & INTERFACES (Fixes the "parameter s needs a type" error) ---
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

// --- 2. STATE MANAGEMENT (Zustand) ---
const useUIStore = create<UIState>((set) => ({
  theme: 'dark', // Defaulting to dark as per project style
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// --- 3. COMPONENTS ---

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  const navItems = [
    { name: "Member management", path: "/", icon: <Users size={20} /> },
    { name: "Applications", path: "/applications", icon: <FileText size={20} /> },
    { name: "Teams", path: "/teams", icon: <LayoutGrid size={20} /> },
  ];

  return (
    <aside className={`
      ${sidebarOpen ? "w-64" : "w-20"} 
      transition-all duration-300 h-screen border-r flex flex-col shrink-0
      bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
    `}>
      <div className="p-4 border-b mb-4 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0" />
          {sidebarOpen && <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">Admin User</span>}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center p-3 rounded-xl border transition-all 
              ${isActive 
                ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 font-bold" 
                : "text-slate-500 border-transparent hover:bg-slate-500/10 dark:hover:bg-slate-800"}
            `}
          >
            {item.icon}
            {sidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      
      <button onClick={toggleSidebar} className="p-4 border-t flex justify-center border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white">
        <ChevronLeft className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
      </button>
    </aside>
  );
};

const Topbar = () => {
  const { theme, setTheme } = useUIStore();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-6">
        {/* Changed to MoreVertical (3 dots) as requested */}
        <button onClick={() => alert("Settings Open")} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
          <MoreVertical size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`relative flex items-center h-7 w-12 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700' : 'bg-green-600'}`}
          >
            <div className={`flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}>
              {theme === 'dark' ? <Moon size={12} className="text-slate-800" /> : <Sun size={12} className="text-orange-500" />}
            </div>
          </button>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{theme} Mode</span>
        </div>
      </div>

      <LogOut size={18} className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors" />
    </header>
  );
};

// --- 4. MAIN APP ---

export default function App() {
  const { theme } = useUIStore();

  // EFFECT: Updates the theme across all pages immediately by toggling the 'dark' class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      {/* Root Container using Tailwind variables (slate family) */}
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Topbar />
          
          <main className="flex-1 overflow-auto p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <Routes>
                <Route path="/" element={
                  <div className="space-y-6">
                    <h1 className="text-2xl font-black tracking-tight">Member Management</h1>
                    {/* The "Center Box" - now uses semantic variables */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm min-h-[400px]">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="relative flex-1 max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 px-4 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
                           <Search size={18} className="text-slate-400" />
                           <span className="text-sm text-slate-500">Search members...</span>
                         </div>
                         {/* Filter Buttons as "Pills" */}
                         <div className="flex gap-2">
                            {['Web Dev Team', 'Second Year'].map(f => (
                              <button key={f} className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:border-slate-400 dark:hover:border-slate-500 transition-all">
                                {f}
                              </button>
                            ))}
                         </div>
                      </div>
                      <div className="h-64 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 font-medium">
                        Content Area Placeholder
                      </div>
                    </div>
                  </div>
                } />
                <Route path="/applications" element={<h1 className="text-2xl font-black">Applications</h1>} />
                <Route path="/teams" element={<h1 className="text-2xl font-black">Teams</h1>} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
