import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { connectionsAPI } from '@/api/connections.api';
import { toast } from 'react-toastify';

export const useConnections = () => {
  const queryClient = useQueryClient();

  const connectionsQuery = useQuery({
    queryKey: ['connections'],
    queryFn: connectionsAPI.getConnections,
  });

  const requestsQuery = useQuery({
    queryKey: ['requests'],
    queryFn: connectionsAPI.getReceivedRequests,
  });

  const reviewRequestMutation = useMutation({
    mutationFn: ({ status, requestId }: { status: 'accepted' | 'rejected'; requestId: string }) => 
      connectionsAPI.reviewRequest(status, requestId),
    onSuccess: (data, variables) => {
      toast.success(variables.status === 'accepted' ? 'Request Accepted!' : 'Request Rejected');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      if (variables.status === 'accepted') {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to review request');
    },
  });

  return {
    connectionsQuery,
    requestsQuery,
    reviewRequestMutation,
  };
};
