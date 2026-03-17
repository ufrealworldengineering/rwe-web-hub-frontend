import type { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api.ts';
import type {
	ProgramCreate,
	ProgramDetailFilters,
	ProgramFilters,
	ProgramResponse,
	ProgramUpdate,
	ProgramWithManagerResponse,
} from '@/types/program';

const programKeys = {
	all: ['programs'] as const,
	filtered: (filters?: ProgramFilters) =>
		[...programKeys.all, 'filtered', filters ?? {}] as const,
	detail: (id: string, filters?: ProgramDetailFilters) =>
		[...programKeys.all, 'detail', id, filters ?? {}] as const,
	manager: (managerId: string) =>
		[...programKeys.all, 'manager', managerId] as const,
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

// (ADMIN) FETCH ALL / FILTERED PROGRAMS
// GET /programs
export const usePrograms = (filters?: ProgramFilters) => {
	return useQuery<ProgramResponse[], Error>({
		queryKey: programKeys.filtered(filters),
		queryFn: async () => {
			try {
				const { data } = await api.get<ProgramResponse[]>('/programs', {
					params: filters,
				});
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to fetch programs');
			}
		},
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
	});
};

// (ADMIN) FETCH SINGLE PROGRAM BY ID
// GET /programs/:id
export const useProgram = (id: string, filters?: ProgramDetailFilters) => {
	return useQuery<ProgramWithManagerResponse, Error>({
		queryKey: programKeys.detail(id, filters),
		queryFn: async () => {
			try {
				const { data } = await api.get<ProgramWithManagerResponse>(
					`/programs/${id}`,
					{ params: filters }
				);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to fetch program');
			}
		},
		enabled: Boolean(id),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
	});
};

// (ADMIN) FETCH PROGRAMS BY MANAGER
// GET /programs/manager/:managerId
export const useProgramsByManager = (managerId: string) => {
	return useQuery<ProgramResponse[], Error>({
		queryKey: programKeys.manager(managerId),
		queryFn: async () => {
			try {
				const { data } = await api.get<ProgramResponse[]>(
					`/programs/manager/${managerId}`
				);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to fetch manager programs');
			}
		},
		enabled: Boolean(managerId),
		staleTime: 1000 * 60 * 2,
		gcTime: 1000 * 60 * 5,
	});
};

// (ADMIN) CREATE PROGRAM
// POST /programs
export const useCreateProgram = () => {
	const queryClient = useQueryClient();

	return useMutation<ProgramResponse, Error, ProgramCreate>({
		mutationFn: async (payload: ProgramCreate) => {
			try {
				const { data } = await api.post<ProgramResponse>('/programs', payload);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to create program');
			}
		},
		onSuccess: (createdProgram) => {
			queryClient.setQueryData(
				programKeys.detail(createdProgram.id),
				createdProgram
			);
			queryClient.invalidateQueries({ queryKey: programKeys.all });
		},
	});
};

// (ADMIN) UPDATE PROGRAM
// PATCH /programs/:id
export const useUpdateProgram = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ProgramResponse,
		Error,
		{ id: string; updates: ProgramUpdate }
	>({
		mutationFn: async ({ id, updates }) => {
			try {
				const { data } = await api.patch<ProgramResponse>(
					`/programs/${id}`,
					updates
				);
				return data;
			} 
			catch (error) {
				throw toError(error, 'Failed to update program');
			}
		},
		onSuccess: (updatedProgram) => {
			queryClient.setQueryData(
				programKeys.detail(updatedProgram.id),
				updatedProgram
			);
			queryClient.invalidateQueries({ queryKey: programKeys.all });
		},
	});
};

// (ADMIN) DELETE PROGRAM
// DELETE /programs/:id
export const useDeleteProgram = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: async (id: string) => {
			try {
				await api.delete(`/programs/${id}`);
			} 
			catch (error) {
				throw toError(error, 'Failed to delete program');
			}
		},
		onSuccess: (_data, id) => {
			queryClient.removeQueries({ queryKey: programKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: programKeys.all });
		},
	});
};

