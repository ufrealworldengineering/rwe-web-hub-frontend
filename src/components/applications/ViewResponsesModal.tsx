import { X, FileText, ExternalLink } from 'lucide-react';
import type { ApplicationResponse } from '@/types/application';
import { applicationTeamId } from '@/types/application';
import { useTeams } from '@/api/hooks/useTeams';

const META_KEYS = new Set([
  'answers',
]);

function formatLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

interface ViewResponsesModalProps {
  application: ApplicationResponse;
  onClose: () => void;
}

export const ViewResponsesModal = ({ application, onClose }: ViewResponsesModalProps) => {
  const { data: teams = [] } = useTeams({ active_only: false });
  const teamId = applicationTeamId(application);
  const teamName = teams.find((t) => t.id === teamId)?.name ?? teamId;

  const meta = application.metadata_json ?? {};
  const rawAnswers = meta.answers;
  const answerEntries: [string, unknown][] =
    rawAnswers && typeof rawAnswers === 'object' && !Array.isArray(rawAnswers)
      ? Object.entries(rawAnswers as Record<string, unknown>)
      : [];

  const otherMeta = Object.entries(meta).filter(([k]) => !META_KEYS.has(k));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-2xl flex flex-col max-h-[90vh]">

        <div className="flex items-start justify-between border-b border-border px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-semibold">{application.first_name} {application.last_name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{application.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-4 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 py-3 border-b border-border bg-muted/20 text-xs text-muted-foreground shrink-0">
          {teamId && (
            <span>
              <span className="font-medium text-foreground">Team: </span>
              {teamName}
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
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

          {application.resume && (
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors group"
            >
              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span>View Resume</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto group-hover:text-foreground transition-colors" />
            </a>
          )}

          {otherMeta.length > 0 && (
            <div className="space-y-3">
              {otherMeta.map(([key, value]) => (
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

          {answerEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No additional responses recorded.
            </p>
          ) : (
            <div className="space-y-4">
              {answerEntries.map(([key, value]) => (
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

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4 shrink-0">
          <button
            type="button"
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
