import { User } from '@/api/auth.api';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface UserCardProps {
  user: User;
  likeOpacity?: any;
  nopeOpacity?: any;
  isTopCard?: boolean;
}

export const UserCard = ({ user, likeOpacity, nopeOpacity, isTopCard = false }: UserCardProps) => {
  return (
    <div className="relative w-full h-full bg-neutral-900 rounded-[20px] overflow-hidden shadow-2xl border border-neutral-800 select-none pointer-events-none group">
      
      {/* Background Image */}
      {user.photoUrl ? (
        <img 
          src={user.photoUrl} 
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover pointer-events-none"
          draggable="false"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-500 text-6xl font-bold pointer-events-none">
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
      )}

      {/* LIKE / NOPE Stamps (only visible/animated on the top card during drag) */}
      {isTopCard && likeOpacity && nopeOpacity && (
        <>
          <motion.div 
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-black text-4xl py-1 px-3 rounded-md rotate-[-15deg] pointer-events-none tracking-wider"
          >
            LIKE
          </motion.div>
          <motion.div 
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-black text-4xl py-1 px-3 rounded-md rotate-[15deg] pointer-events-none tracking-wider"
          >
            NOPE
          </motion.div>
        </>
      )}

      {/* Bottom Gradient and Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 pt-32 pb-6 px-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end">
        
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            {user.firstName}{user.age ? <span className="font-light ml-2">{user.age}</span> : ''}
          </h2>
          <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm pointer-events-auto">
             <Info className="w-4 h-4 text-white" />
          </button>
        </div>

        {user.gender && <p className="text-neutral-300 capitalize text-sm mb-2">{user.gender}</p>}
        
        {user.about && (
          <p className="text-white/90 text-sm line-clamp-2 mb-3">{user.about}</p>
        )}

        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 max-h-[60px] overflow-hidden">
            {user.skills.slice(0, 4).map((skill, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/10"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/70 rounded-full text-xs font-medium border border-white/5">
                +{user.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
