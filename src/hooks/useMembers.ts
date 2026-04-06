import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import type { Member, NewMember } from '../types/member';
import { useTeams } from '@/api/hooks/useTeams';

export { useTeams };

export const useMembers = () =>
  useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: () =>
      api.get('/members/', { params: { include_team: true } }).then((res) => res.data),
  });

export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newMember: NewMember) =>
      api.post('/members/', newMember).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NewMember> }) =>
      api.patch(`/members/${id}`, updates).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/members/${id}`).then(() => undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};
