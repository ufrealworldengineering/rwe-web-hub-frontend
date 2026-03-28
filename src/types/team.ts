import type { ProgramResponse } from '@/types/program';

export type TeamResponse = {
    id: string;
    name: string;
    program: string;
    active: boolean;
    created_at: string;
};

export type TeamWithProgramResponse = TeamResponse & {
    program_rel?: ProgramResponse | null;
};

export type TeamCreate = {
    name: string;
    program: string;
    active?: boolean;
};

export type TeamUpdate = Partial<TeamCreate>;

export type TeamFilters = {
    skip?: number;
    limit?: number;
    active_only?: boolean;
};

export type TeamDetailFilters = {
    include_program?: boolean;
};

export type TeamByProgramFilters = {
    active_only?: boolean;
};
