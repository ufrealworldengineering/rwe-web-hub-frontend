import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  return (
    <>
      <main>
        <Outlet />
      </main>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border-1 rounded-full px-8 py-4 min-h-16 flex gap-8">
        <button
          className="text-lg font-semibold text-text-primary hover:text-accent"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className="text-lg font-semibold text-text-primary hover:text-accent"
          onClick={() => navigate("/about")}
        >
          About
        </button>
        <button
          className="text-lg font-semibold text-text-primary hover:text-accent"
          onClick={() => navigate("/sponsors")}
        >
          Apply
        </button>
        <button
          className="text-lg font-semibold text-text-primary hover:text-accent"
          onClick={() => navigate("/applications")}
        >
          Sponsors
        </button>
      </div>
    </>
  );
};

export default Layout;
