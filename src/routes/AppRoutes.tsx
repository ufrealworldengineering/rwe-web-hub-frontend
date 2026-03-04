import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import About from '@/pages/MainSections/TeamAbout';
import Sponsors from '@/pages/MainSections/Sponsors';
import Applications from '@/pages/Applications';
import Main from '@/pages/Main';
import ProtectedRoute from '@/components/ProtectedRoute';
import Unauthorized from '@/pages/Unauthorized';
import Admin from '@/pages/admin/Admin';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/about" element={<About />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/access-denied" element={<Unauthorized />} />
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                        <Admin />
                    </ProtectedRoute>
                } />
                
            </Route>
        </Routes>
    );
}

export default AppRoutes;
