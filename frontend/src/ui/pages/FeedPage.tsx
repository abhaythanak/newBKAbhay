'use client';

import { useFeed } from '@/hooks/useFeed';
import { UserCard } from '../components/UserCard';
import { X, Heart, Loader2 } from 'lucide-react';

export const FeedPage = () => {
  const { feedQuery, sendRequestMutation } = useFeed();

  const handleAction = (status: 'interested' | 'ignored', toUserId: string) => {
    sendRequestMutation.mutate({ status, toUserId });
  };

  if (feedQuery.isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (feedQuery.isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-red-400">
        Error loading feed. Please try again.
      </div>
    );
  }

  const users = feedQuery.data?.data || feedQuery.data || [];

  if (users.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center text-center p-8">
        <h2 className="text-3xl font-bold text-neutral-300 mb-4">No More Profiles</h2>
        <p className="text-neutral-500">Check back later for new connections!</p>
      </div>
    );
  }

  // Just show the first user in the array (like a stack of cards)
  const currentUser = users[0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-sm relative">
        <UserCard user={currentUser} />
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => handleAction('ignored', currentUser._id)}
            disabled={sendRequestMutation.isPending}
            className="p-4 bg-neutral-800 rounded-full border border-neutral-700 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={() => handleAction('interested', currentUser._id)}
            disabled={sendRequestMutation.isPending}
            className="p-4 bg-neutral-800 rounded-full border border-neutral-700 text-green-500 hover:bg-green-500/10 hover:border-green-500 transition-all shadow-lg hover:shadow-green-500/20 disabled:opacity-50"
          >
            <Heart className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
