import { User } from '@/api/auth.api';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl border border-neutral-700 w-full max-w-sm mx-auto select-none pointer-events-none">
      <div className="relative h-80 w-full bg-neutral-700">
        {user.photoUrl ? (
          <img 
            src={user.photoUrl} 
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover pointer-events-none"
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-4xl pointer-events-none">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-2xl font-bold text-white">
            {user.firstName} {user.lastName}{user.age ? `, ${user.age}` : ''}
          </h2>
          {user.gender && <p className="text-neutral-300 capitalize">{user.gender}</p>}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {user.about && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-1">About</h3>
            <p className="text-neutral-200">{user.about}</p>
          </div>
        )}

        {user.skills && user.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm font-medium border border-pink-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
