'use client';

import { useState, useEffect } from 'react';
import { useFeed } from '@/hooks/useFeed';
import { UserCard } from '../components/UserCard';
import { X, Heart, Loader2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';

export const FeedPage = () => {
  const { feedQuery, sendRequestMutation } = useFeed();
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // Rotate the card based on x drag
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  
  // Opacities for stamps
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  useEffect(() => {
    if (feedQuery.data) {
      const data = feedQuery.data?.data || feedQuery.data;
      if (Array.isArray(data)) {
        setLocalUsers(data);
      }
    }
  }, [feedQuery.data]);

  const handleAction = async (status: 'interested' | 'ignore', toUserId: string) => {
    // Fire the API call optimistically in the background
    sendRequestMutation.mutate({ status, toUserId });
    
    // Animate the card flying off screen
    await controls.start({
      x: status === 'interested' ? window.innerWidth : -window.innerWidth,
      opacity: 0,
      rotate: status === 'interested' ? 20 : -20,
      transition: { duration: 0.3 }
    });
    
    // Remove from local state
    setLocalUsers(prev => prev.slice(1));
    // Reset motion values for the next card immediately
    x.set(0); 
    controls.set({ x: 0, opacity: 1, rotate: 0 });
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 120; // pixels
    if (info.offset.x > threshold) {
      await handleAction('interested', localUsers[0]._id);
    } else if (info.offset.x < -threshold) {
      await handleAction('ignore', localUsers[0]._id);
    } else {
      // Snap back if threshold not met
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  if (feedQuery.isLoading && localUsers.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (feedQuery.isError && localUsers.length === 0) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-red-400">
        Error loading feed. Please try again.
      </div>
    );
  }

  if (localUsers.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center text-center p-8">
        <div className="w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center mb-6">
           <Heart className="w-10 h-10 text-neutral-700" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-200 mb-3">You're out of matches.</h2>
        <p className="text-neutral-500">There's no one new around you.<br/>Check back later for new connections!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden relative w-full bg-black">
      
      {/* Stack of Cards */}
      <div className="relative w-full max-w-[380px] h-[65vh] min-h-[500px] max-h-[700px]">
        {[...localUsers].slice(0, 3).reverse().map((user, index) => {
          const isTop = index === Math.min(localUsers.length - 1, 2);
          const stackIndex = isTop ? 0 : (Math.min(localUsers.length - 1, 2) - index);

          return (
            <motion.div
              key={user._id}
              className="absolute w-full h-full cursor-grab active:cursor-grabbing origin-bottom"
              style={{
                zIndex: isTop ? 10 : 10 - stackIndex,
                scale: isTop ? 1 : 1 - (stackIndex * 0.04),
                y: isTop ? 0 : stackIndex * 12,
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? 1 : (stackIndex === 1 ? 0.8 : 0.4),
              }}
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragEnd={isTop ? handleDragEnd : undefined}
              animate={isTop ? controls : undefined}
              whileDrag={{ scale: 1.02 }}
            >
              <UserCard 
                user={user} 
                likeOpacity={isTop ? likeOpacity : undefined}
                nopeOpacity={isTop ? nopeOpacity : undefined}
                isTopCard={isTop}
              />
            </motion.div>
          );
        })}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 mt-8 z-20">
        <button
          onClick={() => handleAction('ignore', localUsers[0]._id)}
          disabled={sendRequestMutation.isPending}
          className="p-4 bg-black rounded-full border border-red-500/50 text-red-500 hover:bg-red-500/10 hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] disabled:opacity-50 disabled:hover:scale-100"
        >
          <X className="w-8 h-8" strokeWidth={3} />
        </button>
        <button
          onClick={() => handleAction('interested', localUsers[0]._id)}
          disabled={sendRequestMutation.isPending}
          className="p-4 bg-black rounded-full border border-green-500/50 text-green-500 hover:bg-green-500/10 hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] disabled:opacity-50 disabled:hover:scale-100"
        >
          <Heart className="w-8 h-8" strokeWidth={3} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
