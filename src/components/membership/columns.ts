import { createColumnHelper } from '@tanstack/react-table';
import type { Member } from '../../types/member';
import { APP_YEAR_LABELS } from '../../types/member';

const columnHelper = createColumnHelper<Member>();

export const columns = [
  columnHelper.accessor('first_name', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('last_name', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('team_rel', {
    header: 'Team',
    cell: (info) => info.getValue()?.name ?? 'N/A',
  }),
  columnHelper.accessor('year', {
    header: 'Year',
    cell: (info) => {
      const year = info.getValue();
      return year ? APP_YEAR_LABELS[year] : 'N/A';
    },
  }),
  columnHelper.display({
    id: 'program_manager',
    header: 'Program Manager',
    cell: ({ row }) => {
      const mgr = row.original.team_rel?.program_rel?.manager_rel;
      if (!mgr) return 'N/A';
      const name = `${mgr.first_name ?? ''} ${mgr.last_name ?? ''}`.trim();
      return name || mgr.email;
    },
  }),
];