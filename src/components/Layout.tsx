import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const Layout = () => {
  return (
    <>
      <main>
        <Outlet />
        {/* <Navbar /> */ }
      </main>
    </>
  );
};

export default Layout;
