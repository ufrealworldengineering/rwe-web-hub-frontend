import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useTeams,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
} from '@/api/hooks/useTeams';
import { usePrograms } from '@/api/hooks/usePrograms';
import type { TeamResponse } from '@/types/team';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<TeamResponse>();

export function AdminTeamsTable() {
  const { data: teams = [], isLoading, isError, refetch } = useTeams();
  const { data: programs = [] } = usePrograms();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const [globalFilter, setGlobalFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<TeamResponse | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formProgram, setFormProgram] = useState('');
  const [formActive, setFormActive] = useState(true);

  const openCreate = () => {
    setFormName('');
    setFormProgram(programs[0]?.id ?? '');
    setFormActive(true);
    setCreateOpen(true);
  };

  const openEdit = (t: TeamResponse) => {
    setFormName(t.name);
    setFormProgram(t.program);
    setFormActive(t.active);
    setEditTeam(t);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'program',
        header: 'Program',
        cell: ({ row }) => {
          const pid = row.original.program;
          const name = programs.find((p) => p.id === pid)?.name ?? pid;
          return <span className="text-muted-foreground text-sm">{name}</span>;
        },
      }),
      columnHelper.accessor('active', {
        header: 'Active',
        cell: (info) => (
          <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${
              info.getValue()
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'border-border bg-muted text-muted-foreground'
            }`}
          >
            {info.getValue() ? 'Yes' : 'No'}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => openEdit(row.original)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => setDeleteTeamId(row.original.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      }),
    ],
    [programs]
  );

  const table = useReactTable({
    data: teams,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _id, filter) => {
      const q = String(filter).toLowerCase();
      const t = row.original;
      const pname = programs.find((p) => p.id === t.program)?.name ?? '';
      return (
        t.name.toLowerCase().includes(q) ||
        pname.toLowerCase().includes(q)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const submitCreate = () => {
    if (!formName.trim() || !formProgram) {
      toast.error('Name and program are required');
      return;
    }
    createTeam.mutate(
      { name: formName.trim(), program: formProgram, active: formActive },
      {
        onSuccess: () => {
          toast.success('Team created');
          setCreateOpen(false);
          void refetch();
        },
        onError: () => toast.error('Failed to create team'),
      }
    );
  };

  const submitEdit = () => {
    if (!editTeam) return;
    if (!formName.trim() || !formProgram) {
      toast.error('Name and program are required');
      return;
    }
    updateTeam.mutate(
      {
        id: editTeam.id,
        updates: { name: formName.trim(), program: formProgram, active: formActive },
      },
      {
        onSuccess: () => {
          toast.success('Team updated');
          setEditTeam(null);
          void refetch();
        },
        onError: () => toast.error('Failed to update team'),
      }
    );
  };

  const confirmDelete = () => {
    if (!deleteTeamId) return;
    deleteTeam.mutate(deleteTeamId, {
      onSuccess: () => {
        toast.success('Team deleted');
        setDeleteTeamId(null);
        void refetch();
      },
      onError: () => toast.error('Failed to delete team'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-destructive">Could not load teams.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex flex-1 min-w-[12rem] items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search teams..."
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>
        <Button type="button" onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New team
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  No teams yet.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
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
        <div className="flex items-center justify-end gap-1 border-t border-border p-4">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {createOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setCreateOpen(false); }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create team</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Program</label>
                <select
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={submitCreate} disabled={createTeam.isPending}>
                {createTeam.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {editTeam ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditTeam(null); }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Edit team</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Program</label>
                <select
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditTeam(null)}>Cancel</Button>
              <Button onClick={submitEdit} disabled={updateTeam.isPending}>
                {updateTeam.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteTeamId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTeamId(null); }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Delete team?</h2>
            <p className="text-sm text-muted-foreground mb-6">This cannot be undone. Ensure no applications depend on this team.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTeamId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteTeam.isPending}>
                {deleteTeam.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
