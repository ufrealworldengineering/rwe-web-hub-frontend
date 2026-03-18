import { NavLink } from "react-router-dom";
import { Home, Settings } from "lucide-react";
import { useUIStore } from "../store/uiStore";

const navItems = [
  { name: "Dashboard", path: "/", icon: <Home size={20} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const sidebarOpen = useUIStore((state: any) => state.sidebarOpen);

  return (
    <aside className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          {item.icon}
          {sidebarOpen && <span>{item.name}</span>}
        </NavLink>
      ))}
    </aside>
  );
}