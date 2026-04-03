import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import About from '@/pages/MainSections/TeamAbout';
import Sponsors from '@/pages/MainSections/Sponsors';
import Applications from '@/pages/Applications';
import Main from '@/pages/Main';
import ProtectedRoute from '@/components/ProtectedRoute';
import Unauthorized from '@/pages/Unauthorized';
import Admin from '@/pages/admin/Admin';
import Login from '@/pages/Login';
import NotFound from '@/pages/404';
import TeamManagement from '@/pages/MainSections/TeamManagement';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth — outside Layout (no navbar/footer) */}
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/about" element={<About />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/teams" element={<TeamManagement />} />
                <Route path="/access-denied" element={<Unauthorized />} />
                {/* Placeholder until Dashboard page is built */}
                { <Route path="/dashboard" element={<Navigate to="/" replace />} />}
                <Route path="/admin" element={
                     <ProtectedRoute allowedRoles={['Admin']}>
                        <Admin />
                     </ProtectedRoute> 
                } />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;