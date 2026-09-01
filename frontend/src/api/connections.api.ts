import api from './axios';

export const connectionsAPI = {
  getReceivedRequests: async () => {
    const res = await api.get('/user/request/received');
    return res.data;
  },
  getConnections: async () => {
    const res = await api.get('/user/connections');
    return res.data;
  },
  reviewRequest: async (status: 'accepted' | 'rejected', requestId: string) => {
    const res = await api.post(`/request/review/${status}/${requestId}`);
    return res.data;
  },
};
