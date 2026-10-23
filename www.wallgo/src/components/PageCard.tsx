import React, { useState } from 'react'
import type { Page } from './PageProfile'
import { useNavigate } from 'react-router-dom'
import { useFollowPG } from './useFollowPG'
import { useAuth } from '../hooks/AuthProvider'

interface PageCardProps {
    page: Page
}

export const PageCard: React.FC<PageCardProps> = ({ page }) => {
    const navigate = useNavigate();

    const { handleFollow } = useFollowPG();
    const { user } = useAuth()!;
    const [followed, setFollowed] = useState<boolean>(page?.is_followed);
    return (
        <div key={page.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                <img src={page?.banner_url ?? '/backgrounds/users_banner.svg'} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="px-5 pb-5 relative">
                <div className="-mt-10 mb-3 flex justify-between items-end">
                    <img src={page?.logo_url ?? '/icons/users.svg'} alt="Logo" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md bg-white" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{page.followers_count} followers</span>
                </div>
                <h3 className="font-bold text-base text-gray-900 cursor-pointer" onClick={() => navigate(`/pages/${page?.id}`)}>{page.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{page.description}</p>

                {
                    user?.id === page?.owner_id ? (
                        <button onClick={() => navigate(`/pages/${page?.id}`)} className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition">
                            Manage Page
                        </button>
                    ) : (
                        <button onClick={(() => {
                            setFollowed(prev => !prev);
                            handleFollow(page?.id, 'page');
                        })} className={`w-full py-2 hover:opacity-90 rounded-xl text-xs font-semibold transition shadow-sm ${followed ? 'bg-gray-100 text-gray-700 hover:bg-gray-300 border border-gray-300' : 'bg-[var(--special-purple)] text-white hover:opacity-90'}`}>
                            {followed ? 'Followed' : 'Follow Page'}
                        </button>
                    )
                }
            </div>
        </div >
    )
}
