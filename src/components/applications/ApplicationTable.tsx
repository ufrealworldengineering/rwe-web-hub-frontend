import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type FilterFn,
} from '@tanstack/react-table';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Bell, Loader2 } from 'lucide-react';
import type { ApplicationResponse, ApplicationStatus, Team } from '../../types/application';
import toast from 'react-hot-toast';

// ─── helpers ────────────────────────────────────────────────────────────────

const TEAM_LABELS: Record<Team, string> = {
  general: 'General',
  drone: 'Drone',
  robotarm: 'Robot Arm',
  ebike: 'E-Bike',
  web: 'Web',
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  accepted: 'bg-green-500/15 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  waitlisted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

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

// ─── sub-components ──────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: ApplicationStatus }) => (
  <span
    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);

const TeamBadge = ({ team }: { team: Team }) => (
  <span className="inline-flex items-center rounded-md bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary">
    {TEAM_LABELS[team] ?? team}
  </span>
);

const NA = () => <span className="text-muted-foreground">N/A</span>;

// ─── custom dropdown ─────────────────────────────────────────────────────────

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
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>{selectedLabel}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 min-w-36 rounded-lg border border-border bg-card shadow-lg py-1">
          <button
            onClick={() => { onChange('' as T | ''); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted ${
              value === '' ? 'text-primary font-medium' : 'text-foreground'
            }`}
          >
            {placeholder}
          </button>
          {options.map(([val, label]) => (
            <button
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

// ─── notify helper ───────────────────────────────────────────────────────────

async function sendNotification(applicationId: string): Promise<{ success: boolean }> {
  const response = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ application_id: applicationId }),
  });
  if (!response.ok) throw new Error('Notify request failed');
  return response.json();
}

// ─── table component ─────────────────────────────────────────────────────────

interface ApplicationTableProps {
  data: ApplicationResponse[];
  onViewResponses: (app: ApplicationResponse) => void;
}

export const ApplicationTable = ({ data, onViewResponses }: ApplicationTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [teamFilter, setTeamFilter] = useState<Team | ''>('');
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  const handleNotify = async (app: ApplicationResponse) => {
    setNotifyingId(app.id);
    try {
      await sendNotification(app.id);
      toast.success(`Notification sent to ${app.first_name} ${app.last_name}`);
    } catch {
      toast.error('Failed to send notification. Please try again.');
    } finally {
      setNotifyingId(null);
    }
  };

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
      columnHelper.accessor('team_id', {
        header: 'Team',
        cell: (info) => {
          const team = info.getValue();
          return team ? <TeamBadge team={team as Team} /> : <NA />;
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
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('submitted_at', {
        header: 'Submitted',
        cell: (info) => {
          const val = info.getValue();
          if (!val) return <NA />;
          return (
            <span className="text-muted-foreground text-xs">
              {new Date(val).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const app = row.original;
          const isNotifying = notifyingId === app.id;
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewResponses(app)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                onClick={() => handleNotify(app)}
                disabled={isNotifying}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
              >
                {isNotifying ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )}
                Notify
              </button>
            </div>
          );
        },
      }),
    ],
    [notifyingId, onViewResponses]
  );

  const filteredData = useMemo(() => {
    return data
      .filter((a) => !statusFilter || a.status === statusFilter)
      .filter((a) => !teamFilter || a.team_id === teamFilter);
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

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b border-border flex-wrap">

        {/* Search */}
        <label className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground flex-1 min-w-48 max-w-xs">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search applicants..."
            className="bg-transparent outline-none w-full placeholder:text-muted-foreground text-foreground"
          />
        </label>

        {/* Team filter */}
        <Dropdown<Team>
          value={teamFilter}
          onChange={(val) => { setTeamFilter(val); table.setPageIndex(0); }}
          options={Object.entries(TEAM_LABELS) as [Team, string][]}
          placeholder="All Teams"
        />

        {/* Status filter */}
        <Dropdown<ApplicationStatus>
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); table.setPageIndex(0); }}
          options={Object.entries(STATUS_LABELS) as [ApplicationStatus, string][]}
          placeholder="All Statuses"
        />

        {/* Result count */}
        <span className="ml-auto text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} result
          {table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
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
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-1 p-4 border-t border-border">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors cursor-pointer disabled:cursor-default"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <button
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