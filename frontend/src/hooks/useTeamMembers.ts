import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useTeamMembers(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'team-members'],
    queryFn: () => api.get(`/projects/${projectId}/team-members`).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useCreateTeamMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; role: string }) =>
      api.post(`/projects/${projectId}/team-members`, data).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['projects', projectId, 'team-members'] }),
  });
}

export function useDeleteTeamMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      api.delete(`/projects/${projectId}/team-members/${memberId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['projects', projectId, 'team-members'] }),
  });
}
