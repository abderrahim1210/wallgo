import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

interface User {
    id: number;
    name: string;
    username: string;
    avatar_url?: string;
    is_following?: boolean;
}

interface FollowUserProps {
    user: User;
    onFollow: (following_id: number) => void;
    closeModal?: () => void;
}

export const FollowUser: React.FC<FollowUserProps> = ({ user, onFollow, closeModal }) => {
    const [follow, setFollow] = useState<boolean>(Boolean(user?.is_following));
    const navigate = useNavigate();
    const { user: cureentUser } = useAuth()!;
    const addFollow = () => {
        onFollow(user?.id);
        setFollow(prev => !prev);
    }

    const preview = () => {
        navigate(`/profile/${user?.id}/${user?.username}`);
        closeModal?.();
        navigate(0);
    }
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={user?.avatar_url || '/icons/avatar1.svg'}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate hover:underline cursor-pointer" onClick={() => preview()}>
                        {user?.name}
                    </h4>
                    <span className="text-xs font-medium text-gray-500 truncate">
                        @{user?.username}
                    </span>
                </div>
            </div>

            {
                user?.id !== cureentUser?.id && (
                    <button
                        onClick={addFollow}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${follow
                            ? 'bg-fuchsia-50 text-[var(--special-purple)] border border-[var(--special-purple)] hover:bg-fuchsia-100'
                            : 'bg-[var(--special-purple)] text-white hover:opacity-90 shadow-sm'
                            }`}
                    >
                        {follow ? 'Followed' : 'Follow'}
                    </button>
                )
            }
        </div>
    )
}
