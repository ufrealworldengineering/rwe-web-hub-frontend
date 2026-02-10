import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/MainSections/HeroSection';
import About from '../pages/MainSections/TeamAbout';
import Sponsors from '../pages/MainSections/Sponsors';
import Applications from '../pages/Applications';
import Main from '@/pages/Main';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/about" element={<About />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/applications" element={<Applications />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
