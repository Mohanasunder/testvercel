import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'milestones'],
    queryFn: () => api.get(`/projects/${projectId}/milestones`).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useCreateMilestone(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string; due_date?: string; status?: string }) =>
      api.post(`/projects/${projectId}/milestones`, data).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['projects', projectId, 'milestones'] }),
  });
}

export function useDeleteMilestone(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId: string) =>
      api.delete(`/projects/${projectId}/milestones/${milestoneId}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['projects', projectId, 'milestones'] }),
  });
}
