import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Applications from '@/pages/Applications';
import Main from '@/pages/Main';
import ProtectedRoute from '@/components/ProtectedRoute';
import Unauthorized from '@/pages/Unauthorized';
import Login from '@/pages/Login';
import AdminLayout from '../pages/admin/AdminLayout';
import MembershipPage from '@/pages/admin/Membership';
import AdminHome from '../pages/admin/AdminHome';
import ApplicationManagementPage from '@/pages/admin/ApplicationManagement';
import TeamManagement from '@/pages/MainSections/TeamManagement';
import NotFound from '@/pages/404';

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
            {/* Auth — outside Layout (no navbar/footer) */}
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/teams" element={<TeamManagement />} />
                <Route path="/access-denied" element={<Unauthorized />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
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
                </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;
