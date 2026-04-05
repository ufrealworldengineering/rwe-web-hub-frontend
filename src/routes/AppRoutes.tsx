import { Route, Routes, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/PublicLayout';
import Applications from '@/pages/Applications';
import Main from '@/pages/Main';
import ProtectedRoute from '@/components/ProtectedRoute';
import Unauthorized from '@/pages/Unauthorized';
import Login from '@/pages/Login';
import AdminLayout from '../pages/admin/AdminLayout';
import MembershipPage from '@/pages/admin/Membership';
import AdminHome from '../pages/admin/AdminHome';
import ApplicationManagementPage from '@/pages/admin/ApplicationManagement';
import AdminTeamsPage from '@/pages/admin/TeamManagementPage';
import TeamManagement from '@/pages/MainSections/TeamManagement';
import NotFound from '@/pages/404';
import About from '@/pages/About';

const bypassEnabled = import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS_ENABLED === 'true';
const bypassRules = (import.meta.env.VITE_AUTH_BYPASS_ROUTES ?? '')
    .split(',')
    .map((item: string) => item.trim())
    .filter(Boolean);

const matchesBypassRule = (routePath: string): boolean =>
    bypassEnabled &&
    bypassRules.some((rule: string) =>
        rule === `${routePath}/*` ||
        rule.endsWith('/*')
            ? routePath.startsWith(rule.slice(0, -1))
            : routePath === rule
    );

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Landing only: full-bleed club page — no public header/sidebar (see HeroSection for nav + theme) */}
            <Route path="/" element={<Main />} />

            <Route element={<PublicLayout />}>
                <Route path="/applications" element={<Applications />} />
                <Route path="/teams" element={<TeamManagement />} />
                <Route path="/about" element={<About />} />
                <Route path="/access-denied" element={<Unauthorized />} />
                <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            </Route>

            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRoles={['president', 'treasurer']}
                        bypassAuth={matchesBypassRule('/admin')}
                    >
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminHome />} />
                <Route path="membership" element={<MembershipPage />} />
                <Route path="applications" element={<ApplicationManagementPage />} />
                <Route path="teams" element={<AdminTeamsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
