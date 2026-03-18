import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

export default function Topbar() {
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="topbar">
      {/* Sidebar Toggle */}
      <button onClick={toggleSidebar}>
        <Menu />
      </button>

      <div className="actions">
        {/* Theme Toggle */}
        <button onClick={handleThemeToggle}>
          {theme === "light" ? <Moon /> : <Sun />}
        </button>

        {/* Logout */}
        <button onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
    </header>
  );
}