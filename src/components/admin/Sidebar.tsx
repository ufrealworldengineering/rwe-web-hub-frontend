import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

type SidebarProps = {
  isSidebarCollapsed: boolean;
};

export const Sidebar = ({ isSidebarCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navItemBase = 'flex items-center rounded-md px-3 py-2 text-sm transition-colors';

  return (
    <aside className="border-b border-border bg-card p-5 md:border-b-0 md:border-r">
      {/* {!isSidebarCollapsed ? (
        <>
          <h1 className="text-lg font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sidebar placeholder for future navigation.
          </p>
        </>
      ) : null} */}
      <nav className="mt-6 space-y-2">
        <Link
          className={`${navItemBase} ${
            location.pathname === '/admin'
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground-secondary hover:bg-muted'
          }`}
          to="/admin"
          title="Overview"
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed ? <span className="ml-2">Overview</span> : null}
        </Link>
        <Link
          className={`${navItemBase} ${
            location.pathname.startsWith('/admin/membership')
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground-secondary hover:bg-muted'
          }`}
          to="/admin/membership"
          title="Membership"
        >
          <Users className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed ? <span className="ml-2">Membership</span> : null}
        </Link>
      </nav>
    </aside>
  );
};
