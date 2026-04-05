import { NavLink } from "react-router-dom";
import { Users, FileText, LayoutGrid } from "lucide-react";
import { useUIStore } from "../store/uiStore";

export default function Sidepart() {
  const { sidebarOpen } = useUIStore();

  const navItems = [
    { name: "Member management", path: "/", icon: <Users size={20} /> },
    { name: "Applications", path: "/applications", icon: <FileText size={20} /> },
    { name: "Teams", path: "/teams", icon: <LayoutGrid size={20} /> },
  ];

  return (
    <aside
      className={`
        ${sidebarOpen ? "w-64" : "w-20"}
        transition-all duration-300 h-screen border-r flex flex-col shrink-0
        bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800
      `}
    >
      {/* Top Section */}
      <div className="p-4 border-b mb-4 border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center justify-center ${
            sidebarOpen ? "justify-start" : "justify-center"
          } gap-3 p-2 rounded-lg border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700`}
        >
          {/* Blue circle */}
          <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0" />
          {/* Text */}
          {sidebarOpen && (
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Admin User
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center ${sidebarOpen ? "justify-start" : "justify-center"}
              p-3 rounded-xl transition-all border
              ${
                isActive
                  ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 font-bold"
                  : "text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }
            `}
          >
            <div className={`flex items-center ${sidebarOpen ? "gap-3" : ""}`}>
              <div className="flex items-center justify-center w-6 h-6">{item.icon}</div>
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}