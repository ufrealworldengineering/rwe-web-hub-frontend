import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import type { Member, NewMember, Team } from '../types/member';



export const useMembers = () =>
  useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: () =>
      api.get('/members/', { params: { include_team: true } }).then((res) => res.data),
  });

export const useTeams = () =>
  useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams/').then((res) => res.data),
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

