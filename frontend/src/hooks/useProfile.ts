import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileAPI } from '@/api/profile.api';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/auth.store';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();

  const editProfileMutation = useMutation({
    mutationFn: profileAPI.editProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully!');
      // Update the local user state
      if (data?.data) {
          setUser({ ...user, ...data.data });
      } else if (data?.user) {
          setUser({ ...user, ...data.user });
      } else {
          setUser({ ...user, ...data });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    },
  });

  return {
    editProfileMutation,
  };
};
