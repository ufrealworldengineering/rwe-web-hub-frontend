import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Search, ChevronUp, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Member, AppYear } from '../../types/member';
import { APP_YEAR_LABELS } from '../../types/member';

const columnHelper = createColumnHelper<Member>();

const Badge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-md bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary">
    {label}
  </span>
);

const NA = () => <span className="text-white/50">N/A</span>;

const columns = [
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
  columnHelper.accessor('year', {
    header: 'Year',
    cell: (info) => {
      const year = info.getValue();
      return year
        ? <Badge label={APP_YEAR_LABELS[year]} />
        : <NA />;
    },
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => <span className="text-white/70">{info.getValue()}</span>,
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
];

interface MemberTableProps {
  data: Member[];
  onAddMember: () => void;
}

export const MemberTable = ({ data, onAddMember }: MemberTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [yearFilter, setYearFilter] = useState<AppYear | ''>('');
  const [teamFilter, setTeamFilter] = useState('');

  const teamOptions = useMemo(() => {
    const names = data
      .map((m) => m.team_rel?.name)
      .filter((name): name is string => Boolean(name));
    return [...new Set(names)].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data
      .filter((m) => !yearFilter || m.year === yearFilter)
      .filter((m) => !teamFilter || m.team_rel?.name === teamFilter);
  }, [data, yearFilter, teamFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="rounded-xl border border-white/10 bg-[#2c2c2c] text-white overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b border-white/10 flex-wrap">

        {/* Search */}
        <label className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-white/60 flex-1 min-w-48 max-w-xs">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search for a member..."
            className="bg-transparent outline-none w-full placeholder:text-white/40 text-white"
          />
        </label>

        {/* Team filter */}
        <div className="relative flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-sm cursor-pointer text-white">
          <ChevronUp className="h-4 w-4 text-white/60 shrink-0 pointer-events-none" />
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

        {/* Year filter */}
        <div className="relative flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-sm cursor-pointer text-white">
          <ChevronUp className="h-4 w-4 text-white/60 shrink-0 pointer-events-none" />
          <span className="pointer-events-none">{yearFilter ? APP_YEAR_LABELS[yearFilter] : 'All Years'}</span>
          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value as AppYear | ''); table.setPageIndex(0); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="">All Years</option>
            {(Object.entries(APP_YEAR_LABELS) as [AppYear, string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Add Member */}
        <button
          onClick={onAddMember}
          className="ml-auto flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-white/10">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wide"
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
              <td colSpan={columns.length} className="px-4 py-10 text-center text-white/50">
                No members found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors"
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
      <div className="flex items-center justify-end gap-1 p-4 border-t border-white/10">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
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
                : 'border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
