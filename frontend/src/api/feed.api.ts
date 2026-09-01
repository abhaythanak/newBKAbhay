import api from './axios';

export const feedAPI = {
  getFeed: async () => {
    const res = await api.get('/feed');
    return res.data;
  },
  sendRequest: async (status: 'interested' | 'ignored', toUserId: string) => {
    const res = await api.post(`/request/send/${status}/${toUserId}`);
    return res.data;
  },
};
