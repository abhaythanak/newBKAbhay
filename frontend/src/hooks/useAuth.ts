import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { authUtils } from '@/utils/auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // For token based auth if used, otherwise HTTP only cookie is set automatically
      if (data?.token) {
        authUtils.setToken(data.token);
      }
      setUser(data.user || data.data || data);
      toast.success('Logged in successfully!');
      router.push('/feed');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to login');
    },
  });

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to sign up');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      storeLogout();
      authUtils.logout(); // Redirects to login
      queryClient.clear();
    },
    onError: () => {
      toast.error('Failed to logout');
    }
  });

  const useProfile = () =>
    useQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const data = await authAPI.getProfile();
        const user = data?.data || data?.user || data;
        setUser(user);
        return user;
      },
      retry: false,
    });

  return {
    loginMutation,
    signupMutation,
    logoutMutation,
    useProfile,
  };
};
