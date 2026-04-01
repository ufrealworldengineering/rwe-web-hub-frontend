// // DUMMY PAGE

// const Admin = () => {
//     return (
//         <>
//             Admin
//         </>
//     );
// };

// export default Admin;
import { useState } from 'react';
import MembershipPage from './Membership';
import ApplicationManagementPage from './ApplicationManagement';

type AdminTab = 'membership' | 'applications';

const TAB_LABELS: Record<AdminTab, string> = {
  membership: 'Membership',
  applications: 'Applications',
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('membership');

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Tab bar */}
      <div className="border-b border-border bg-card px-6">
        <nav className="flex gap-1">
          {(Object.entries(TAB_LABELS) as [AdminTab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'border-secondary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Page content */}
      {activeTab === 'membership' && <MembershipPage />}
      {activeTab === 'applications' && <ApplicationManagementPage />}
    </div>
  );
};

export default Admin;
