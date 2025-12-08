import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest, RegisterRequest } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth.store';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      // Redirect based on role
      if (data.user.role === 'pitch_owner') {
        router.push('/business/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      // Redirect based on role
      if (data.user.role === 'pitch_owner') {
        router.push('/business/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      router.push('/');
    },
  });
}
