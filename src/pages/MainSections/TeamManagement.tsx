import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, Loader2, Users } from 'lucide-react';
import { usePublicTeamDirectory } from '@/api/hooks/useTeams';
import type { TeamWithProgramResponse } from '@/types/team';

const columnHelper = createColumnHelper<TeamWithProgramResponse>();

/**
 * Public directory of teams — read-only, API-backed.
 */
export default function TeamManagement() {
  const { data: teams = [], isLoading, isError } = usePublicTeamDirectory(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Team',
        cell: (info) => (
          <span className="font-semibold text-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'program',
        header: 'Program',
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.program_rel?.name ?? row.original.program}
          </span>
        ),
      }),
      columnHelper.accessor('active', {
        header: 'Recruiting',
        cell: (info) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
              info.getValue()
                ? 'bg-primary/10 text-primary ring-primary/20'
                : 'bg-muted text-muted-foreground ring-border'
            }`}
          >
            {info.getValue() ? 'Open' : 'Paused'}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: teams,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _id, filter) => {
      const q = String(filter).toLowerCase();
      const t = row.original;
      const pname = t.program_rel?.name ?? '';
      return (
        t.name.toLowerCase().includes(q) ||
        pname.toLowerCase().includes(q)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 text-destructive text-center">
          Unable to load teams. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Directory</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Design teams</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our active teams. Apply from the Applications page to join a team.
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm max-w-md mx-auto">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search teams or programs..."
            className="bg-transparent outline-none w-full placeholder:text-muted-foreground text-foreground"
          />
        </label>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border bg-muted/30">
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                    No teams match your search.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4">
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
      </div>
    </section>
  );
}
