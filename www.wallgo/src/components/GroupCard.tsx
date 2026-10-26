import React, { useState } from 'react'
import type { Group } from './Groups';
import { FaGlobe, FaLock } from 'react-icons/fa';
import { useFollowPG } from './useFollowPG';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

interface GroupCardProps {
    group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    const [followed, setFollowed] = useState<boolean>(group?.is_followed);
    const { handleFollow } = useFollowPG();
    const navigate = useNavigate();
    const { user } = useAuth()!;
    return (
        <div key={group.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                <img src={group.banner_url ?? '/backgrounds/users_group_banner.svg'} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    {group.visibility === 'private' ? <FaLock className="w-2.5 h-2.5" /> : <FaGlobe className="w-2.5 h-2.5" />}
                    {group.visibility}
                </span>
            </div>
            <div className="px-5 pb-5 relative">
                <div className="-mt-10 mb-3 flex justify-between items-end">
                    <img src={group.logo_url ?? '/icons/users_page.logo.svg'} alt="Logo" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md bg-white" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{group.followers_count} members</span>
                </div>
                <h3 className="font-bold text-base text-gray-900 cursor-pointer" onClick={() => navigate(`/groups/${group?.id}`)}>{group.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{group.description}</p>
                {
                    user?.id === group?.owner_id ? (
                        <button onClick={() => navigate(`/groups/${group?.id}`)} className="cursor-pointer w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition">
                            Manage Group
                        </button>
                    ) : (
                        <button onClick={
                            () => {
                                setFollowed(prev => !prev);
                                handleFollow(group?.id, 'group')
                            }} className={`cursor-pointer w-full py-2 ${followed ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' : 'bg-[var(--special-purple)] text-white hover:opacity-90'} hover:opacity-90 rounded-xl text-xs font-semibold transition shadow-sm`}>
                            {followed ? 'Joined' : 'Join Group'}
                        </button>
                    )
                }
            </div>
        </div >
    )
}
