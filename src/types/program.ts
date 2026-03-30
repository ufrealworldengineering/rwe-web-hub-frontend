import type { UserRole } from '@/api/store/authStore';

export type ProgramYear = 'first' | 'second' | 'third' | 'fourth' | 'other';

export type ProgramManager = {
    id: string;
    email: string;
    role: UserRole;
    first_name: string | null;
    last_name: string | null;
    year: ProgramYear | null;
};

export type ProgramResponse = {
    id: string;
    name: string;
    manager: string;
    active: boolean;
};

export type ProgramWithManagerResponse = ProgramResponse & {
    manager_rel?: ProgramManager | null;
};

export type ProgramCreate = {
    name: string;
    manager: string;
    active?: boolean;
};

export type ProgramUpdate = Partial<ProgramCreate>;

export type ProgramFilters = {
    skip?: number;
    limit?: number;
    active_only?: boolean;
};

export type ProgramDetailFilters = {
    include_manager?: boolean;
};
