import { LogOut, Moon, Sun, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

type TopbarProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
};

export const Topbar = ({
  isSidebarCollapsed,
  onToggleSidebar,
  onLogout,
}: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {isSidebarCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
          title="Toggle light/dark mode"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          title="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
      <div className="text-sm text-muted-foreground">Admin</div>
    </header>
  );
};
