import type { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api.ts';
import type {
	TeamByProgramFilters,
	TeamCreate,
	TeamDetailFilters,
	TeamFilters,
	TeamResponse,
	TeamUpdate,
	TeamWithProgramResponse,
} from '@/types/team';

const teamKeys = {
	all: ['teams'] as const,
	filtered: (filters?: TeamFilters) =>
		[...teamKeys.all, 'filtered', filters ?? {}] as const,
	detail: (id: string, filters?: TeamDetailFilters) =>
		[...teamKeys.all, 'detail', id, filters ?? {}] as const,
	byProgram: (programId: string, filters?: TeamByProgramFilters) =>
		[...teamKeys.all, 'program', programId, filters ?? {}] as const,
};

const toError = (error: unknown, fallback: string): Error => {
	if (error instanceof Error) {
		return error;
	}

	if (error && typeof error === 'object') {
		const axiosError = error as AxiosError<{ detail?: string }>;
		const message = axiosError.response?.data?.detail;
		if (message) {
			return new Error(message);
		}
	}

	return new Error(fallback);
};

// (ADMIN) FETCH ALL / FILTERED TEAMS
// GET /teams
export const useTeams = (filters?: TeamFilters) => {
	return useQuery<TeamResponse[], Error>({
		queryKey: teamKeys.filtered(filters),
		queryFn: async () => {
			try {
				const { data } = await api.get<TeamResponse[]>('/teams', {
					params: filters,
				});
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to fetch teams');
			}
		},
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
	});
};

// (ADMIN/MEMBER) FETCH SINGLE TEAM BY ID
// GET /teams/:id
export const useTeam = (id: string, filters?: TeamDetailFilters) => {
	return useQuery<TeamWithProgramResponse, Error>({
		queryKey: teamKeys.detail(id, filters),
		queryFn: async () => {
			try {
				const { data } = await api.get<TeamWithProgramResponse>(
					`/teams/${id}`,
					{ params: filters }
				);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to fetch team');
			}
		},
		enabled: Boolean(id),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
	});
};

// (ADMIN/PROGRAM MANAGER) FETCH TEAMS BY PROGRAM
// GET /teams/program/:programId
export const useTeamsByProgram = (
	programId: string,
	filters?: TeamByProgramFilters
) => {
	return useQuery<TeamResponse[], Error>({
		queryKey: teamKeys.byProgram(programId, filters),
		queryFn: async () => {
			try {
				const { data } = await api.get<TeamResponse[]>(
					`/teams/program/${programId}`,
					{ params: filters }
				);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to fetch program teams');
			}
		},
		enabled: Boolean(programId),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
	});
};

// (ADMIN) CREATE TEAM
// POST /teams
export const useCreateTeam = () => {
	const queryClient = useQueryClient();

	return useMutation<TeamResponse, Error, TeamCreate>({
		mutationFn: async (payload: TeamCreate) => {
			try {
				const { data } = await api.post<TeamResponse>('/teams', payload);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to create team');
			}
		},
		onSuccess: (createdTeam) => {
			queryClient.setQueryData(teamKeys.detail(createdTeam.id), createdTeam);
			queryClient.invalidateQueries({ queryKey: teamKeys.all });
		},
	});
};

// (ADMIN/PROGRAM MANAGER) UPDATE TEAM
// PATCH /teams/:id
export const useUpdateTeam = () => {
	const queryClient = useQueryClient();

	return useMutation<TeamResponse, Error, { id: string; updates: TeamUpdate }>({
		mutationFn: async ({ id, updates }) => {
			try {
				const { data } = await api.patch<TeamResponse>(`/teams/${id}`, updates);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to update team');
			}
		},
		onSuccess: (updatedTeam) => {
			queryClient.setQueryData(teamKeys.detail(updatedTeam.id), updatedTeam);
			queryClient.invalidateQueries({ queryKey: teamKeys.all });
		},
	});
};

// (ADMIN) DELETE TEAM
// DELETE /teams/:id
export const useDeleteTeam = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: async (id: string) => {
			try {
				await api.delete(`/teams/${id}`);
			} 
			catch (error) {
				throw toError(error, 'Failed to delete team');
			}
		},
		onSuccess: (_data, id) => {
			queryClient.removeQueries({ queryKey: teamKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: teamKeys.all });
		},
	});
};

