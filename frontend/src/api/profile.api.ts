import api from './axios';

export const profileAPI = {
  editProfile: async (data: any) => {
    const res = await api.patch('/profile/edit', data);
    return res.data;
  },
};
