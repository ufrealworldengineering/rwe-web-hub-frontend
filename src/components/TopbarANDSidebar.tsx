import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { create } from 'zustand'; 
import { 
  Users, FileText, LayoutGrid, Sun, Moon, 
  LogOut, ChevronLeft, Search, MoreVertical
} from "lucide-react";

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

interface AuthState {
  logout: () => void;
}


const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

const useAuthStore = create<AuthState>((_set) => ({
  logout: () => alert("User logged out"), // Placeholder for real logout
}));

// --- 3. LAYOUT COMPONENTS ---
const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, theme } = useUIStore();
  const navItems = [
    { name: "Member management", path: "/", icon: <Users size={20} /> },
    { name: "Applications", path: "/applications", icon: <FileText size={20} /> },
    { name: "Teams", path: "/teams", icon: <LayoutGrid size={20} /> },
  ];

  return (
    <aside className={`
      ${sidebarOpen ? "w-64" : "w-20"} 
      transition-all duration-300 h-screen border-r flex flex-col shrink-0
      ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}
    `}>
      <div className={`p-4 border-b mb-4 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className={`flex items-center gap-3 p-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0" />
          {sidebarOpen && <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Admin User</span>}
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={({ isActive }) => `
            flex items-center p-3 rounded-xl transition-all border 
            ${isActive ? "bg-green-500/10 text-green-500 border-green-500/30 font-bold" : 
            theme === 'dark' ? "text-gray-400 border-transparent hover:bg-gray-800 hover:text-white" : 
            "text-gray-500 border-transparent hover:bg-gray-100 hover:text-black"}
          `}>
            {item.icon}
            {sidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      
      <button onClick={toggleSidebar} className={`p-4 border-t flex justify-center transition-colors ${theme === 'dark' ? 'border-gray-800 text-gray-500 hover:text-white' : 'border-gray-100 text-gray-400 hover:text-black'}`}>
        <ChevronLeft className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
      </button>
    </aside>
  );
};

const Topbar = () => {
  const { theme, setTheme } = useUIStore();
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-6">
        
        <button 
          onClick={() => alert("Settings Menu Opened")} 
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <MoreVertical size={20} />
        </button>

        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`relative flex items-center h-7 w-12 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-600'}`}
          >
            <div className={`flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}>
              {theme === 'dark' ? <Moon size={12} className="text-gray-800" /> : <Sun size={12} className="text-orange-500" />}
            </div>
          </button>
          <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{theme} Mode</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LogOut onClick={logout} size={18} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`} />
      </div>
    </header>
  );
};


const PageWrapper = ({ title }: { title: string }) => {
  const { theme } = useUIStore();
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h1 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{title}</h1>
      <div className={`min-h-[400px] border rounded-3xl p-8 shadow-sm transition-all duration-300 ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800 shadow-black/40 text-gray-500' : 'bg-white border-gray-200 shadow-gray-200/50 text-gray-400'}`}>
        <div className="flex items-center gap-4 mb-8">
           <div className={`relative flex-1 max-w-sm rounded-xl border p-2.5 px-4 flex items-center gap-3 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
             <Search size={18} className="text-gray-500" />
             <span className="text-sm text-gray-500">Search {title.toLowerCase()}...</span>
           </div>
        </div>
        <div className={`h-64 rounded-2xl border-2 border-dashed flex items-center justify-center ${theme === 'dark' ? 'border-gray-800 text-gray-700' : 'border-gray-100 text-gray-300'}`}>
          <p className="font-medium tracking-tight">Viewing {title} Interface</p>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const { theme } = useUIStore();
  return (
    <BrowserRouter>
      <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#f4f7f6]'}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Topbar />
          <main className="flex-1 overflow-auto p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <Routes>
                <Route path="/" element={<PageWrapper title="Member Management" />} />
                <Route path="/applications" element={<PageWrapper title="Applications" />} />
                <Route path="/teams" element={<PageWrapper title="Teams" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}