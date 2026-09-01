import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedAPI } from '@/api/feed.api';
import { toast } from 'react-toastify';

export const useFeed = () => {
  const queryClient = useQueryClient();

  const feedQuery = useQuery({
    queryKey: ['feed'],
    queryFn: feedAPI.getFeed,
  });

  const sendRequestMutation = useMutation({
    mutationFn: ({ status, toUserId }: { status: 'interested' | 'ignored'; toUserId: string }) => 
      feedAPI.sendRequest(status, toUserId),
    onSuccess: (data, variables) => {
      // Optimistically remove the user from the feed or refetch
      toast.success(variables.status === 'interested' ? 'Interested!' : 'Passed');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send request');
    },
  });

  return {
    feedQuery,
    sendRequestMutation,
  };
};
