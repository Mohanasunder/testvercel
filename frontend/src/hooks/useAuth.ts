import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import type { LoginFormData, RegisterFormData } from '../schemas/authSchema';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginFormData) =>
      api.post('/auth/login', data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.access_token, data.refresh_token, { id: '', email: '', username: '' });
      api.get('/auth/me').then((r) => {
        setAuth(data.access_token, data.refresh_token, r.data);
      });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      api.post('/auth/register', data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.access_token, data.refresh_token, { id: '', email: '', username: '' });
      api.get('/auth/me').then((r) => {
        setAuth(data.access_token, data.refresh_token, r.data);
      });
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  return () => {
    clearAuth();
    queryClient.clear();
  };
}
