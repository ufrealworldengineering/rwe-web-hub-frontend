export type AppYear = 'first' | 'second' | 'third' | 'fourth' | 'other';

export const APP_YEAR_LABELS: Record<AppYear, string> = {
  first:  'first',
  second: 'second',
  third:  'third',
  fourth: 'fourth',
  other:  'other',
};

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  team: string;
  team_rel?: Team;
  year?: AppYear;
}

export interface NewMember {
  first_name: string;
  last_name: string;
  email: string;
  team: string;
  year?: AppYear;
}

export interface ManagerInfo {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface ProgramInfo {
  id: string;
  name: string;
  manager: string;
  manager_rel?: ManagerInfo;
}

export interface Team {
  id: string;
  name: string;
  program: string;
  active: boolean;
  created_at: string;
  program_rel?: ProgramInfo;
}
