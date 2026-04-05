import { PageHeader } from '@/components/admin/PageHeader';

const AdminHome = () => {
  return (
    <div className="space-y-3">
      <PageHeader
        title="Admin Dashboard"
        subtitle="This is the root admin page. Add dashboard widgets and section links here."
      />
    </div>
  );
};

export default AdminHome;
