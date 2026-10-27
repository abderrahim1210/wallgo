import React, { useState } from 'react'
import type { User } from './Home'
import { useFollow } from './useFollow';
import { useNavigate } from 'react-router-dom';

interface FollowUserCardProps {
    user: User;
}

const FollowUserCard: React.FC<FollowUserCardProps> = ({ user }) => {
    const [follow, setFollow] = useState<boolean>(false);
    const { add_follow } = useFollow();

    const addFollow = (user_id: number) => {
        add_follow(user_id);
        setFollow(prev => !prev);
    }
    const navigate = useNavigate();
    return (
        <div
            key={user.id}
            className="min-w-[150px] sm:min-w-[170px] md:max-w-[160px] bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col items-center text-center snap-start shrink-0"
        >
            <img
                src={user.avatar_url || 'https://via.placeholder.com/150'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover mb-2 border border-white shadow-sm"
            />
            <h4 className="text-xs font-bold text-gray-800 truncate w-full cursor-pointer" onClick={() => navigate(`/profile/${user?.id}/${user?.username}`)}>{user.name}</h4>
            <span className="text-[10px] text-gray-400 truncate w-full mb-3">@{user.username}</span>

            <button
                onClick={() => addFollow(user?.id)}
                className={`w-full py-1.5 ${follow ? 'bg-[var(--special-white)] border border-[var(--special-gray)] text-[var(--special-gray)]' : 'bg-[var(--special-purple)] text-white'} text-[11px] font-semibold rounded-lg shadow-sm transition`}
            >
                Follow
            </button>
        </div>
    )
}

export default FollowUserCard