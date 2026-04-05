import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { ApplicationTable } from '../../components/applications/ApplicationTable';
import { ViewResponsesModal } from '../../components/applications/ViewResponsesModal';
import { useApplications } from '../../api/hooks/useApplications';
import type { ApplicationResponse } from '../../types/application';
import rweLogo from '../../assets/rwe-logo.svg';

export default function ApplicationManagementPage() {
  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);
  const { data: applications = [], isLoading, isError } = useApplications();

  return (
    <div className="dark p-6 space-y-4 min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and manage incoming member applications
          </p>
        </div>
        <img src={rweLogo} alt="RWE Logo" className="h-10 w-auto" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-destructive">
          Failed to load applications. Please refresh and try again.
        </div>
      ) : (
        <ApplicationTable
          data={applications}
          onViewResponses={(app: ApplicationResponse) => setSelectedApp(app)}
        />
      )}

      {selectedApp && (
        <ViewResponsesModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
