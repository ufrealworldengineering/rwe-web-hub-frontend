import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { ApplicationTable } from '../../components/applications/ApplicationTable';
import { ViewResponsesModal } from '../../components/applications/ViewResponsesModal';
import { useApplications } from '../../api/hooks/useApplications';
import type { ApplicationResponse } from '../../types/application';
import rweLogo from '../../assets/rwe-logo.svg';

// --- MOCK DATA FOR TESTING ---
const MOCK_APPLICATIONS: ApplicationResponse[] = [
  {
    id: "1",
    full_name: "Albert Gator",
    email: "albert@ufl.edu",
    status: "pending",
    year: "Junior",
    major: "Computer Science",
    team: "Software",
    submitted_at: "2026-03-28T14:30:00Z",
    resume_url: "https://example.com/resume1.pdf",
    why_join: "I want to apply my coding skills to help people in need.",
    background: "I have experience with React and C++ from my classes.",
    experience: "Previously interned at a local tech startup.",
    how_heard: "UF Engineering Fair"
  },
  {
    id: "2",
    full_name: "Alberta Gator",
    email: "alberta@ufl.edu",
    status: "accepted",
    year: "Freshman",
    major: "Digital Arts",
    team: "Design",
    submitted_at: "2026-03-29T09:15:00Z",
    resume_url: "https://example.com/resume2.pdf",
    why_join: "I love the humanitarian mission of RWE.",
    background: "I'm a designer with experience in Figma and UI/UX.",
    experience: "High school robotics design lead.",
    how_heard: "Instagram"
  },
  {
    id: "3",
    full_name: "Marco Caswell",
    email: "m.caswell@ufl.edu",
    status: "pending",
    year: "Sophomore",
    major: "Mechanical Engineering",
    team: "Drones",
    submitted_at: "2026-03-30T11:45:00Z",
    why_join: "Interested in hardware prototyping.",
    background: "Proficient in SolidWorks and 3D printing.",
    drone_experience1: "Built a racing drone last summer.",
    drone_availability: "Weekends and Tuesday nights.",
    how_heard: "Friend"
  },
  {
    id: "4",
    full_name: "Sarah Jenkins",
    email: "s.jenkins@ufl.edu",
    status: "accepted",
    year: "Senior",
    major: "Public Health",
    team: "Outreach",
    submitted_at: "2026-03-31T16:20:00Z",
    resume_url: "https://example.com/resume4.pdf",
    why_join: "I want to ensure our technical solutions meet real community health needs.",
    background: "Interned at a local clinic; experience with community outreach.",
    onboarding: "In-person preferred",
    how_heard: "Flyer on campus"
  },
  {
    id: "5",
    full_name: "Kevin Nguyen",
    email: "k.nguyen@ufl.edu",
    status: "rejected",
    year: "Junior",
    major: "Electrical Engineering",
    team: "Robot Arm",
    submitted_at: "2026-03-31T08:05:00Z",
    why_join: "Looking for hands-on experience with circuits.",
    background: "Built a custom drone and worked on solar arrays.",
    arm_role: "Control Systems",
    arm_availability: "Mondays 4-6pm",
    how_heard: "LinkedIn"
  },
  {
    id: "6",
    full_name: "Elena Rodriguez",
    email: "e.rodriguez@ufl.edu",
    status: "pending",
    year: "Graduate",
    major: "Civil Engineering",
    team: "Water Systems",
    submitted_at: "2026-04-01T10:00:00Z",
    why_join: "Matches my thesis on sustainable urban drainage.",
    background: "Research assistant in the water reclamation lab.",
    experience: "3 years of environmental modeling.",
    how_heard: "Professor recommendation"
  },
  {
    id: "7",
    full_name: "Jackson Miller",
    email: "j.miller@ufl.edu",
    status: "pending",
    year: "Sophomore",
    major: "Aerospace Engineering",
    team: "Drones",
    submitted_at: "2026-04-01T12:30:00Z",
    resume_url: "https://example.com/resume7.pdf",
    why_join: "I want to work on flight stability for humanitarian delivery drones.",
    background: "Private pilot license student; hobbyist drone builder.",
    drone_experience2: "Advanced knowledge of Betaflight and ESC tuning.",
    how_heard: "Tabling at Reitz Union"
  }
] as any;

export default function ApplicationManagementPage() {
  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);
  
  // Temporarily hardcoding these to bypass the failing API hook
  const applications = MOCK_APPLICATIONS;
  const isLoading = false;
  const isError = false;

  return (
    <div className="dark p-6 space-y-4 min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review and manage incoming member applications
          </p>
        </div>
        <img src={rweLogo} alt="RWE Logo" className="h-10 w-auto" />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : isError ? (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
          Failed to load applications. Please refresh and try again.
        </div>
      ) : (
        <div className="border rounded-lg bg-card">
          <ApplicationTable
            data={applications}
            onViewResponses={(app: ApplicationResponse) => setSelectedApp(app)}
          />
        </div>
      )}

      {/* Response Modal */}
      {selectedApp && (
        <ViewResponsesModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}

