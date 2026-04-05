import { PageHeader } from '@/components/admin/PageHeader';
import { AdminTeamsTable } from '@/components/admin/AdminTeamsTable';

/**
 * Admin team CRUD — full implementation uses shared table + hooks in AdminTeamsTable.
 */
export default function TeamManagementPage() {
  return (
    <div className="space-y-4 bg-background text-foreground">
      <PageHeader
        title="Team management"
        subtitle="Create, edit, and deactivate design teams"
      />
      <AdminTeamsTable />
    </div>
  );
}
