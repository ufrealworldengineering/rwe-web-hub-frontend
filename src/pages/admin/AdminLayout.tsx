import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/api/store/authStore';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <section className="h-screen min-h-0 overflow-hidden bg-background text-foreground">
      <div
        className={cn(
          'grid h-full min-h-0 w-full',
          // Mobile: sidebar natural height, main fills rest; Desktop: one row, fixed viewport height
          'grid-cols-1 grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1',
          isSidebarCollapsed ? 'md:grid-cols-[72px_minmax(0,1fr)]' : 'md:grid-cols-[240px_minmax(0,1fr)]'
        )}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} onLogout={handleLogout} />
        <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
          <Topbar
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
