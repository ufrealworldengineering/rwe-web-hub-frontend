import { X, FileText, ExternalLink } from 'lucide-react';
import type { ApplicationResponse } from '../../types/application';

// Fields that are "core" metadata shown in the header summary — not repeated in the answers body
const CORE_FIELDS = new Set([
  'id',
  'status',
  'submitted_at',
  'full_name',
  'email',
  'major',
  'year',
  'team',
  'resume_url',
  'consent',
]);

// Human-readable labels for known answer keys
const FIELD_LABELS: Record<string, string> = {
  experience: 'Experience',
  how_heard: 'How Did You Hear About Us',
  drone_experience1: 'Drone Experience (Q1)',
  drone_experience2: 'Drone Experience (Q2)',
  drone_experience3: 'Drone Experience (Q3)',
  drone_experience4: 'Drone Experience (Q4)',
  drone_availability: 'Availability (Drone)',
  drone_availability_other: 'Availability Detail',
  onboarding: 'Onboarding Preference',
  first_choice_team: 'First Choice Team',
  second_choice_team: 'Second Choice Team',
  team_choice_explanation: 'Team Choice Explanation',
  arm_role: 'Robot Arm Role',
  arm_availability: 'Availability (Robot Arm)',
  swe_team: 'Software Sub-team',
  why_join: 'Why Join',
  background: 'Background',
};

function formatLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

interface ViewResponsesModalProps {
  application: ApplicationResponse;
  onClose: () => void;
}

export const ViewResponsesModal = ({ application, onClose }: ViewResponsesModalProps) => {
  // Extract answer fields: everything not in CORE_FIELDS and not null/undefined/empty
  const answers = Object.entries(application).filter(
    ([key, value]) =>
      !CORE_FIELDS.has(key) &&
      value !== null &&
      value !== undefined &&
      value !== ''
  );

  const submittedDate = application.submitted_at
    ? new Date(application.submitted_at).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-semibold">{application.first_name} {application.last_name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{application.email}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-4 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Meta summary strip */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-3 border-b border-border bg-muted/20 text-xs text-muted-foreground shrink-0">
          {application.team_id && (
            <span>
              <span className="font-medium text-foreground">Team: </span>
              {application.team_id}
            </span>
          )}
          {application.year && (
            <span>
              <span className="font-medium text-foreground">Year: </span>
              {application.year}
            </span>
          )}
          {application.major && (
            <span>
              <span className="font-medium text-foreground">Major: </span>
              {application.major}
            </span>
          )}
          {submittedDate && (
            <span>
              <span className="font-medium text-foreground">Submitted: </span>
              {submittedDate}
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

          {/* Resume link */}
          {application.resume_url && (
            <a
              href={application.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors group"
            >
              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span>View Resume</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </a>
          )}

          {/* Answer fields */}
          {answers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No additional responses recorded.
            </p>
          ) : (
            <div className="space-y-4">
              {answers.map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    {formatLabel(key)}
                  </dt>
                  <dd className="text-sm text-foreground bg-muted/30 rounded-lg border border-border px-3 py-2.5 leading-relaxed whitespace-pre-wrap">
                    {formatValue(value)}
                  </dd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
