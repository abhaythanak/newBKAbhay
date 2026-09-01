'use client';

import { useConnections } from '@/hooks/useConnections';
import { ConnectionCard } from '../components/ConnectionCard';
import { Loader2, Bell } from 'lucide-react';

export const RequestsPage = () => {
  const { requestsQuery, reviewRequestMutation } = useConnections();

  const handleReview = (status: 'accepted' | 'rejected', requestId: string) => {
    reviewRequestMutation.mutate({ status, requestId });
  };

  if (requestsQuery.isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (requestsQuery.isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-red-400">
        Error loading requests. Please try again.
      </div>
    );
  }

  const requests = requestsQuery.data?.data || requestsQuery.data || [];

  return (
    <div className="max-w-4xl mx-auto p-6 mt-16">
      <div className="mb-8 flex items-center gap-3">
        <Bell className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-white">Pending Requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 text-lg">No pending requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((request: any) => (
            <ConnectionCard 
              key={request._id}
              user={request.fromUserId || request} // fromUserId is who sent it
              type="request"
              requestId={request._id}
              onAccept={(id) => handleReview('accepted', id)}
              onReject={(id) => handleReview('rejected', id)}
              isLoading={reviewRequestMutation.isPending && reviewRequestMutation.variables?.requestId === request._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
