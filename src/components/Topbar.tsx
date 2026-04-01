import { Sun, Moon, LogOut, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/api/store/authStore';
import { useUIStore } from "../store/uiStore";

export default function Topbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s: any) => s.logout);
  const { theme, setTheme, sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Arrow Sidebar Toggle */}
      <button 
        onClick={toggleSidebar} 
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-transform"
      >
        <ChevronLeft
          className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      {/* Right-side buttons */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button 
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Logout */}
        <button 
          onClick={() => { logout(); navigate("/login"); }} 
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}