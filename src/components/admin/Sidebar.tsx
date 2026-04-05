import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LayoutGrid,
  CircleUser,
  LogOut,
} from 'lucide-react';
import { useAuthStore, type User, type UserRole } from '@/api/store/authStore';
import { cn } from '@/lib/utils';

type SidebarProps = {
  isSidebarCollapsed: boolean;
  onLogout: () => void;
};

function formatRole(role: UserRole | null): string {
  if (!role) return '';
  return role
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function displayName(user: User | null): string {
  if (!user) return 'Signed out';
  const parts = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (parts) return parts;
  if (user.name?.trim()) return user.name.trim();
  return user.email;
}

export const Sidebar = ({ isSidebarCollapsed, onLogout }: SidebarProps) => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);

  const navItemClass = (active: boolean) =>
    cn(
      'flex items-center rounded-md py-2.5 text-sm transition-colors',
      isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-3',
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    );

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-y-auto border-b border-border bg-card md:border-b-0 md:border-r">
      <nav className="flex flex-1 flex-col gap-1 px-3 pb-4 pt-6">
        <Link className={navItemClass(location.pathname === '/admin')} to="/admin" title="Overview">
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed ? <span>Overview</span> : null}
        </Link>
        <Link
          className={navItemClass(location.pathname.startsWith('/admin/membership'))}
          to="/admin/membership"
          title="Membership"
        >
          <Users className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed ? <span>Membership</span> : null}
        </Link>
        <Link
          className={navItemClass(location.pathname.startsWith('/admin/applications'))}
          to="/admin/applications"
          title="Applications"
        >
          <ClipboardList className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed ? <span>Applications</span> : null}
        </Link>
        <Link
          className={navItemClass(location.pathname.startsWith('/admin/teams'))}
          to="/admin/teams"
          title="Teams"
        >
          <LayoutGrid className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed ? <span>Teams</span> : null}
        </Link>
      </nav>

      <div className={cn('mt-auto border-t border-border px-3 py-4', isSidebarCollapsed && 'px-2')}>
        <div
          className={cn(
            'rounded-lg border border-border bg-muted/40',
            isSidebarCollapsed ? 'flex flex-col items-center gap-2 px-2 py-3' : 'px-3 py-3'
          )}
          title={
            user
              ? `${displayName(user)} · ${user.email}${role ? ` · ${formatRole(role)}` : ''}`
              : undefined
          }
        >
          <div
            className={cn(
              'flex min-w-0 items-center gap-3',
              isSidebarCollapsed && 'flex-col justify-center gap-2'
            )}
          >
            <div
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground',
                isSidebarCollapsed ? 'h-9 w-9' : 'h-10 w-10'
              )}
            >
              <CircleUser className={isSidebarCollapsed ? 'h-5 w-5' : 'h-5 w-5'} strokeWidth={1.75} />
            </div>
            {!isSidebarCollapsed && user ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{displayName(user)}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                {role ? (
                  <p className="mt-0.5 text-xs text-muted-foreground/90">{formatRole(role)}</p>
                ) : null}
              </div>
            ) : null}
          </div>
          {!isSidebarCollapsed ? (
            <button
              type="button"
              onClick={onLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
