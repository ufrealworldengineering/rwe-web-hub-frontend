import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type FilterFn,
} from '@tanstack/react-table';
import { useState, useMemo, useCallback } from 'react';
import { Search, ChevronUp, Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Member } from '../../types/member';
import { useDeleteMember } from '../../hooks/useMembers';
import toast from 'react-hot-toast';
import { EditMemberModal } from './EditMemberModal';

const memberSearchFilter: FilterFn<Member> = (row, _columnId, filterValue: string) => {
  const q = filterValue.toLowerCase();
  const { first_name, last_name, email, team_rel } = row.original;
  return (
    first_name?.toLowerCase().includes(q) ||
    last_name?.toLowerCase().includes(q) ||
    `${first_name} ${last_name}`.toLowerCase().includes(q) ||
    email?.toLowerCase().includes(q) ||
    team_rel?.name?.toLowerCase().includes(q) ||
    false
  );
};

const columnHelper = createColumnHelper<Member>();

const Badge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-md bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
    {label}
  </span>
);

const NA = () => <span className="text-muted-foreground">N/A</span>;

interface MemberTableProps {
  data: Member[];
  onAddMember: () => void;
}

export const MemberTable = ({ data, onAddMember }: MemberTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState<Member | null>(null);
  const { mutate: removeMember, isPending: deletePending } = useDeleteMember();

  const teamOptions = useMemo(() => {
    const names = data
      .map((m) => m.team_rel?.name)
      .filter((name): name is string => Boolean(name));
    return [...new Set(names)].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((m) => !teamFilter || m.team_rel?.name === teamFilter);
  }, [data, teamFilter]);

  const confirmDelete = useCallback(() => {
    if (!deleting) return;
    removeMember(deleting.id, {
      onSuccess: () => {
        toast.success('Member removed');
        setDeleting(null);
      },
      onError: () => toast.error('Failed to delete member'),
    });
  }, [deleting, removeMember]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'member',
        header: 'Member',
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.first_name} {row.original.last_name}
          </span>
        ),
      }),
      columnHelper.accessor('team_rel', {
        id: 'team',
        header: 'Team',
        cell: (info) => {
          const name = info.getValue()?.name;
          return name ? <Badge label={name} /> : <NA />;
        },
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'program_manager',
        header: 'Program Manager',
        cell: ({ row }) => {
          const mgr = row.original.team_rel?.program_rel?.manager_rel;
          if (!mgr) return <NA />;
          const name = `${mgr.first_name ?? ''} ${mgr.last_name ?? ''}`.trim();
          return name || mgr.email;
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(row.original)}
              className="rounded-md border border-border p-1.5 text-foreground hover:bg-muted"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeleting(row.original)}
              className="rounded-md border border-border p-1.5 text-destructive hover:bg-destructive/10"
              title="Remove"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: memberSearchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden">

        <div className="flex items-center gap-2 p-4 border-b border-border flex-wrap">

          <label className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground flex-1 min-w-48 max-w-xs">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search for a member..."
              className="bg-transparent outline-none w-full placeholder:text-muted-foreground text-foreground"
            />
          </label>

          <div className="relative flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm cursor-pointer text-foreground">
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 pointer-events-none" />
            <span className="pointer-events-none">{teamFilter || 'All Teams'}</span>
            <select
              value={teamFilter}
              onChange={(e) => { setTeamFilter(e.target.value); table.setPageIndex(0); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="">All Teams</option>
              {teamOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onAddMember}
            className="ml-auto flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
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
                  No members found.
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

      {editing ? (
        <EditMemberModal member={editing} onClose={() => setEditing(null)} />
      ) : null}

      {deleting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleting(null); }}
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Remove member?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Remove {deleting.first_name} {deleting.last_name} from the roster?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletePending}
                className="rounded-lg bg-destructive px-4 py-2 text-sm text-destructive-foreground flex items-center gap-2"
              >
                {deletePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
