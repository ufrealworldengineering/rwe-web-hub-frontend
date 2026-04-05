import { Outlet } from 'react-router-dom';

/**
 * Minimal shell for public routes other than `/` (apply, teams, about, etc.).
 * No top bar or sidebar — only page background tokens. The home/landing route
 * is not wrapped here so it stays full-bleed with hero-only chrome.
 */
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
