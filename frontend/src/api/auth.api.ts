import api from './axios';

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  emailId: string;
  photoUrl?: string;
  about?: string;
  age?: number;
  skills?: string[];
  gender?: string;
}

export const authAPI = {
  login: async (data: any) => {
    const res = await api.post('/login', data);
    return res.data;
  },
  signup: async (data: any) => {
    const res = await api.post('/signup', data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/logout');
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/profile/view');
    return res.data;
  },
};
