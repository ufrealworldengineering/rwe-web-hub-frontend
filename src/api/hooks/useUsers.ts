import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// (ADMIN) FETCH ALL / FILTERED USERS
// GET /users
export const useUsers = (filters?: UserFilters) => {
    return useQuery<UserResponse[]>({
        queryKey: userKeys.filtered(filters),
        queryFn: async () => {
            const { data } = await api.get<UserResponse[]>('/users', {
                params: filters,
            });
            return data;
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
            const { data } = await api.get<UserResponse>(`/users/${id}`);
            return data;
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
            const { data } = await api.post<UserResponse>('/users', payload);
            return data;
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
            const { data } = await api.patch<UserResponse>(
                `/users/${id}`,
                updates
            );
            return data;
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
            const { data } = await api.patch<UserResponse>(
                `/users/${id}/role`,
                { role }
            );
            return data;
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
            await api.delete(`/users/${id}`);
        },
        onSuccess: (_data, id) => {
            // remove the individual record from cache
            queryClient.removeQueries({ queryKey: userKeys.detail(id) });
            // invalidate the list to reflect deletion
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
};
