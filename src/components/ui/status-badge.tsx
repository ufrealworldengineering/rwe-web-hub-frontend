import type { ApplicationStatus } from '@/types/application';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  in_review: 'In review',
  accepted: 'Accepted',
  denied: 'Denied',
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: 'bg-muted text-muted-foreground border-border',
  in_review: 'bg-primary/15 text-primary border-primary/30',
  accepted: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  denied: 'bg-destructive/15 text-destructive border-destructive/30',
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export { STATUS_LABELS };
