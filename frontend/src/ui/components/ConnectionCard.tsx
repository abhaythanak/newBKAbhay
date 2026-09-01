import { User } from '@/api/auth.api';

interface ConnectionCardProps {
  user: User;
  type: 'connection' | 'request';
  requestId?: string;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  isLoading?: boolean;
}

export const ConnectionCard = ({ user, type, requestId, onAccept, onReject, isLoading }: ConnectionCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-xl border border-neutral-700">
      <div className="h-16 w-16 rounded-full overflow-hidden bg-neutral-700 flex-shrink-0">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xl font-bold">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-white">
          {user.firstName} {user.lastName} {user.age ? `, ${user.age}` : ''}
        </h3>
        {user.about ? (
          <p className="text-sm text-neutral-400 line-clamp-1">{user.about}</p>
        ) : (
          <p className="text-sm text-neutral-500 italic">No bio provided</p>
        )}
      </div>

      {type === 'request' && requestId && (
        <div className="flex gap-2">
          <button 
            onClick={() => onReject && onReject(requestId)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-neutral-700 text-white font-medium hover:bg-neutral-600 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
          <button 
            onClick={() => onAccept && onAccept(requestId)}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};
