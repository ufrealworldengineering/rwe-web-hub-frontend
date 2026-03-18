import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import api from '../api.ts';
import type {
    UserCreate,
    UserFilters,
    UserResponse,
    UserUpdate,
} from '@/types/user';

const userKeys = {
    all: ['users'] as const,
    filtered: (filters?: UserFilters) =>
        [...userKeys.all, filters ?? {}] as const,
    detail: (id: string) => [...userKeys.all, id] as const,
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

// (ADMIN) FETCH ALL / FILTERED USERS
// GET /users
export const useUsers = (filters?: UserFilters) => {
    return useQuery<UserResponse[]>({
        queryKey: userKeys.filtered(filters),
        queryFn: async () => {
            try {
                const { data } = await api.get<UserResponse[]>('/users', {
                    params: filters,
                });
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to fetch users');
			}
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5,    // 5 minutes
    });
};

// (ADMIN) FETCH SINGLE USER BY ID
// GET /users/:id
export const useUser = (id: string) => {
    return useQuery<UserResponse>({
        queryKey: userKeys.detail(id),
        queryFn: async () => {
            try {
                const { data } = await api.get<UserResponse>(`/users/${id}`);
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to fetch user');
			}
        },
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
    });
};

// (ADMIN) CREATE USER
// POST /users
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<UserResponse, Error, UserCreate>({
        mutationFn: async (payload: UserCreate) => {
            try {
                const { data } = await api.post<UserResponse>('/users', payload);
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to create user');
			}
        },
        onSuccess: () => {
            // invalidate the list so it refetches with the new user
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};

// (ADMIN) UPDATE USER
// PATCH /users/:id
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<UserResponse, Error, { id: string; updates: UserUpdate }>({
        mutationFn: async ({ id, updates }) => {
            try {
                const { data } = await api.patch<UserResponse>(
                    `/users/${id}`,
                    updates
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to update user');
			}
        },
        onSuccess: (updatedUser) => {
            // update the individual record in the cache
            queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
            // invalidate the list for refetch
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};

// (ADMIN) UPDATE USER ROLE
// PATCH /users/:id/role
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation<UserResponse, Error, { id: string; role: UserResponse['role'] }>({
        mutationFn: async ({ id, role }) => {
            try {
                const { data } = await api.patch<UserResponse>(
                    `/users/${id}/role`,
                    { role }
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to update user role');
			}
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};

// (ADMIN) DELETE USER
// DELETE /users/:id
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (id: string) => {
            try {
                await api.delete(`/users/${id}`);
            }
            catch (error) {
				throw toError(error, 'Failed to delete user');
			}
        },
        onSuccess: (_data, id) => {
            // remove the individual record from cache
            queryClient.removeQueries({ queryKey: userKeys.detail(id) });
            // invalidate the list to reflect deletion
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};
