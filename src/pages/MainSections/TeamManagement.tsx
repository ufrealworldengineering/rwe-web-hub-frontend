import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, Plus, Edit2, ChevronLeft, ChevronRight, X, Users } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  members: number;
  status: 'Active' | 'On Hold' | 'Inactive';
  application: 'Open' | 'Closed';
  manager: string;
}

const teamsData: Team[] = [
  { id: 1, name: 'Web Dev', members: 5, status: 'Active', application: 'Closed', manager: 'Jane Doe' },
  { id: 2, name: 'AI Research', members: 8, status: 'On Hold', application: 'Open', manager: 'John Smith' },
  { id: 3, name: 'Robotics', members: 12, status: 'Active', application: 'Closed', manager: 'Alina Garib' },
];

const columnHelper = createColumnHelper<Team>();

/**
 * Modern Dot Badge Component
 */
const StatusBadge = ({ label, type }: { label: string; type: 'success' | 'warning' | 'error' | 'info' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
    error: 'bg-rose-500/10 text-rose-600 ring-rose-500/20',
    info: 'bg-sky-500/10 text-sky-600 ring-sky-500/20',
  };

  const dots = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-sky-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${styles[type]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[type]}`} />
      {label}
    </span>
  );
};

export default function TeamManagement() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const openModal = (team: Team | null = null) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Team Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground tracking-tight">{info.getValue()}</span>
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Internal Squad</span>
        </div>
      ),
    }),
    columnHelper.accessor('members', {
      header: () => <div className="flex items-center gap-1"><Users size={12}/> Capacity</div>,
      cell: (info) => <span className="font-mono text-muted-foreground tabular-nums">{info.getValue()} Members</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const val = info.getValue();
        if (val === 'Active') return <StatusBadge label="Active" type="success" />;
        if (val === 'On Hold') return <StatusBadge label="On Hold" type="warning" />;
        return <StatusBadge label="Inactive" type="error" />;
      },
    }),
    columnHelper.accessor('application', {
      header: 'Application',
      cell: (info) => (
        <StatusBadge 
          label={info.getValue()} 
          type={info.getValue() === 'Open' ? 'info' : 'info'} // Uses blue for both or customize further
        />
      ),
    }),
    columnHelper.accessor('manager', {
      header: 'Manager',
      cell: (info) => <span className="text-sm text-foreground/80">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => openModal(row.original)}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:bg-secondary/10 hover:text-secondary hover:border-secondary/30 transition-all cursor-pointer"
        >
          <Edit2 size={14} />
        </button>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: teamsData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all placeholder:text-muted-foreground"
          />
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm hover:shadow-md hover:bg-secondary/90 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground font-medium">No results found</span>
                    <span className="text-xs text-muted-foreground/60">Try adjusting your search criteria</span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-muted/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
        <span className="text-xs font-medium text-muted-foreground tracking-tight">
          Showing {table.getRowModel().rows.length} of {teamsData.length} teams
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-30 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  table.getState().pagination.pageIndex === i
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-30 transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">{selectedTeam ? 'Update Team' : 'New Team'}</h2>
                <p className="text-xs text-muted-foreground">Configure your team settings and workspace</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Team Details</label>
                  <input
                    defaultValue={selectedTeam?.name}
                    placeholder="e.g. Design Systems"
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Team Lead / Manager</label>
                  <input
                    defaultValue={selectedTeam?.manager}
                    placeholder="Search by name or email"
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-secondary-foreground shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all"
                >
                  {selectedTeam ? 'Save changes' : 'Create team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}