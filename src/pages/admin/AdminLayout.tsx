import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/api/store/authStore';
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div
        className={`grid min-h-screen w-full grid-cols-1 ${
          isSidebarCollapsed ? 'md:grid-cols-[72px_1fr]' : 'md:grid-cols-[240px_1fr]'
        }`}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex min-h-screen flex-col">
          <Topbar
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            onLogout={handleLogout}
          />
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
