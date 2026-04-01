import { Outlet } from 'react-router-dom';
import Sidepart from './Sidepart';
import Topbar from './Topbar';


// import Navbar from './navbar';

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidepart />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar />
        
        <main className="flex-1 overflow-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
