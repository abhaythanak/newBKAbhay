'use client';

import { useConnections } from '@/hooks/useConnections';
import { ConnectionCard } from '../components/ConnectionCard';
import { Loader2, Users } from 'lucide-react';

export const ConnectionsPage = () => {
  const { connectionsQuery } = useConnections();

  if (connectionsQuery.isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (connectionsQuery.isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-red-400">
        Error loading connections. Please try again.
      </div>
    );
  }

  const connections = connectionsQuery.data?.data || connectionsQuery.data || [];

  return (
    <div className="max-w-4xl mx-auto p-6 mt-16">
      <div className="mb-8 flex items-center gap-3">
        <Users className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold text-white">Your Connections</h1>
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400 text-lg">You don't have any connections yet.</p>
          <p className="text-neutral-500 mt-2">Go to the feed to find matches!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((connection: any) => (
            <ConnectionCard 
              key={connection._id || connection.fromUserId?._id || connection.toUserId?._id}
              // Depending on how backend sends it. Usually it sends the populated user object in toUserId or fromUserId or direct
              user={connection.fromUserId?._id ? connection.fromUserId : (connection.toUserId?._id ? connection.toUserId : connection)}
              type="connection"
            />
          ))}
        </div>
      )}
    </div>
  );
};
