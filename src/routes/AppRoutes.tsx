import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Sponsors from '../pages/Sponsors';
import Applications from '../pages/Applications';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/applications" element={<Applications />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
