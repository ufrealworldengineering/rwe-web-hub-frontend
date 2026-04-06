import { Moon, Sun, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

type TopbarProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export const Topbar = ({ isSidebarCollapsed, onToggleSidebar }: TopbarProps) => {
  const { theme, setTheme } = useUIStore();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <header className="sticky top-0 z-40 flex shrink-0 items-center border-b border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:px-6">
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
      </div>
    </header>
  );
};
