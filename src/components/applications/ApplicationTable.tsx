import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type FilterFn,
} from '@tanstack/react-table';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Bell, Loader2, X, Check } from 'lucide-react';
import type { ApplicationResponse, ApplicationStatus } from '@/types/application';
import { applicationTeamId } from '@/types/application';
import { useTeams } from '@/api/hooks/useTeams';
import toast from 'react-hot-toast';
import { ApplicationStatusBadge, STATUS_LABELS } from '@/components/ui/status-badge';
import { useUpdateApplicationStatus, useNotifyApplicant } from '@/api/hooks/useApplications';

const appSearchFilter: FilterFn<ApplicationResponse> = (row, _columnId, filterValue: string) => {
  const q = filterValue.toLowerCase();
  const { first_name, last_name, email, year, major } = row.original;
  return (
    `${first_name} ${last_name}`.toLowerCase().includes(q) ||
    email?.toLowerCase().includes(q) ||
    year?.toLowerCase().includes(q) ||
    major?.toLowerCase().includes(q)
  );
};

const columnHelper = createColumnHelper<ApplicationResponse>();

const TeamBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-md bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
    {label}
  </span>
);

const NA = () => <span className="text-muted-foreground">N/A</span>;

interface DropdownProps<T extends string> {
  value: T | '';
  onChange: (val: T | '') => void;
  options: [T, string][];
  placeholder: string;
}

function Dropdown<T extends string>({ value, onChange, options, placeholder }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedLabel = value ? options.find(([v]) => v === value)?.[1] : placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>{selectedLabel}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 min-w-36 rounded-lg border border-border bg-card shadow-lg py-1">
          <button
            type="button"
            onClick={() => { onChange('' as T | ''); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted ${
              value === '' ? 'text-primary font-medium' : 'text-foreground'
            }`}
          >
            {placeholder}
          </button>
          {options.map(([val, label]) => (
            <button
              type="button"
              key={val}
              onClick={() => { onChange(val); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted ${
                value === val ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ApplicationTableProps {
  data: ApplicationResponse[];
  onViewResponses: (app: ApplicationResponse) => void;
}

export const ApplicationTable = ({ data, onViewResponses }: ApplicationTableProps) => {
  /** Include inactive teams so team names resolve (not raw UUIDs). */
  const { data: teams = [] } = useTeams({ active_only: false });
  const updateStatus = useUpdateApplicationStatus();
  const notifyApplicant = useNotifyApplicant();

  const teamFilterOptions = useMemo((): [string, string][] => {
    const map = new Map<string, string>(teams.map((t) => [t.id, t.name]));
    for (const app of data) {
      const id = applicationTeamId(app);
      if (id && !map.has(id)) {
        map.set(id, id);
      }
    }
    return Array.from(map.entries());
  }, [teams, data]);

  const teamLabel = useMemo(() => {
    const map = new Map<string, string>(teams.map((t) => [t.id, t.name]));
    return (teamId: string) => map.get(teamId) ?? teamId;
  }, [teams]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notifyConfirmApp, setNotifyConfirmApp] = useState<ApplicationResponse | null>(null);

  const runNotify = useCallback(
    async (app: ApplicationResponse) => {
      setNotifyingId(app.id);
      try {
        await notifyApplicant.mutateAsync(app.id);
        toast.success(`Notification sent to ${app.first_name} ${app.last_name}`);
        setNotifyConfirmApp(null);
      } catch {
        toast.error(
          'Failed to send notification. Applicant must be accepted or denied, or SMTP may be misconfigured.'
        );
      } finally {
        setNotifyingId(null);
      }
    },
    [notifyApplicant]
  );

  const handleStatusChange = useCallback(async (app: ApplicationResponse, status: ApplicationStatus) => {
    setUpdatingId(app.id);
    try {
      await updateStatus.mutateAsync({ id: app.id, status, send_email: false });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }, [updateStatus]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'applicant',
        header: 'Applicant',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-foreground">{row.original.first_name} {row.original.last_name}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'team',
        header: 'Team',
        cell: ({ row }) => {
          const teamId = applicationTeamId(row.original);
          return teamId ? <TeamBadge label={teamLabel(teamId)} /> : <NA />;
        },
      }),
      columnHelper.accessor('year', {
        header: 'Year',
        cell: (info) => info.getValue() ?? <NA />,
      }),
      columnHelper.accessor('major', {
        header: 'Major',
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue() ?? '—'}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const app = row.original;
          const busy = updatingId === app.id;
          return (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <ApplicationStatusBadge status={app.status} />
              <select
                value={app.status}
                disabled={busy}
                onChange={(e) => void handleStatusChange(app, e.target.value as ApplicationStatus)}
                className="max-w-[10rem] rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
              >
                {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const app = row.original;
          const isNotifying = notifyingId === app.id;
          const terminal = app.status === 'accepted' || app.status === 'denied';
          const alreadyNotified = terminal && app.notified;
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewResponses(app)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                type="button"
                onClick={() => setNotifyConfirmApp(app)}
                disabled={isNotifying || !terminal || alreadyNotified}
                title={
                  !terminal
                    ? 'Set status to Accepted or Denied before notifying'
                    : alreadyNotified
                      ? 'This decision has been emailed. Change status to notify again.'
                      : 'Send decision email to the applicant'
                }
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  alreadyNotified
                    ? 'border-border bg-muted/40 text-muted-foreground'
                    : 'border-border text-foreground hover:bg-muted'
                }`}
              >
                {isNotifying ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : alreadyNotified ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )}
                {alreadyNotified ? 'Notified' : 'Notify'}
              </button>
            </div>
          );
        },
      }),
    ],
    [notifyingId, updatingId, onViewResponses, teamLabel, handleStatusChange]
  );

  const filteredData = useMemo(() => {
    return data
      .filter((a) => !statusFilter || a.status === statusFilter)
      .filter((a) => !teamFilter || applicationTeamId(a) === teamFilter);
  }, [data, statusFilter, teamFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: appSearchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const confirmApp = notifyConfirmApp;
  const confirmBusy = confirmApp && notifyingId === confirmApp.id;

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden">

      {confirmApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !confirmBusy) setNotifyConfirmApp(null);
          }}
        >
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-semibold pr-6">Send decision email?</h2>
              <button
                type="button"
                disabled={Boolean(confirmBusy)}
                onClick={() => setNotifyConfirmApp(null)}
                className="flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Notify{' '}
              <span className="font-medium text-foreground">
                {confirmApp.first_name} {confirmApp.last_name}
              </span>{' '}
              ({confirmApp.email}) that their application was{' '}
              <span className="font-medium text-foreground">
                {STATUS_LABELS[confirmApp.status]}
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={Boolean(confirmBusy)}
                onClick={() => setNotifyConfirmApp(null)}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(confirmBusy)}
                onClick={() => void runNotify(confirmApp)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {confirmBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                Notify
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-4 border-b border-border flex-wrap">

        <label className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground flex-1 min-w-48 max-w-xs">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search applicants..."
            className="bg-transparent outline-none w-full placeholder:text-muted-foreground text-foreground"
          />
        </label>

        <Dropdown<string>
          value={teamFilter}
          onChange={(val) => { setTeamFilter(val); table.setPageIndex(0); }}
          options={teamFilterOptions}
          placeholder="All Teams"
        />

        <Dropdown<ApplicationStatus>
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); table.setPageIndex(0); }}
          options={Object.entries(STATUS_LABELS) as [ApplicationStatus, string][]}
          placeholder="All Statuses"
        />

        <span className="ml-auto text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} result
          {table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                No applications found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-end gap-1 p-4 border-t border-border">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors cursor-pointer disabled:cursor-default"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => table.setPageIndex(i)}
            className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm transition-colors ${
              table.getState().pagination.pageIndex === i
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-border text-foreground hover:bg-muted cursor-pointer'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors cursor-pointer disabled:cursor-default"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
