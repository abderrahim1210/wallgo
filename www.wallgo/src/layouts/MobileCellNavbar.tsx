import { Clapperboard, Compass, Flame, Home, MessageCircle, Plus, Search, User } from 'lucide-react';
import React from 'react'
import { Tooltip } from '../templates/Tooltip';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../services/api';

export const MobileCellNavbar = () => {
    const { t } = useTranslation();
    const position = "top";
    const location = useLocation();
    const currendPath = location.pathname;
    const { user } = useAuth()!;
    const isActive = (path: string) => currendPath === path;
    const getLinkClass = (path: string) => {
        return `rounded-xl transition-all duration-150 flex items-center justify-center ${isActive(path) ? 'text-[var(--special-purple)] bg-purple-50 dark:bg-purple-950/40 shadow-inner' : 'text-gray-600 dark:text-gray-400 hover:text-[var(--special-purple)] transition-colors'}`;
    }


    const fetchNewMessages = async () => {
        try {
            const res = await axios.get(`${api_url}/notifications`, { withCredentials: true, withXSRFToken: true });
            if (res.data && res.data.success) {
                return res.data.messages;
            }
            return 0;
        } catch (err: any) {
            console.error(err?.response.data);
            return 0;
        }
    }

    const { data: messages = 0 } = useQuery({
        queryKey: ['messages_count'],
        queryFn: fetchNewMessages
    });

    return (
        <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-3 px-6 flex items-center justify-between z-40 shadow-lg'>
            <Tooltip label={t('common.home')} position={position}>
                <Link to="/" className={getLinkClass('/')}>
                    <Home className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label={t('common.forYou')} position={position}>
                <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label={t('common.reels')} position={position}>
                <Link to="/reels" className={getLinkClass('/reels')}>
                    <Clapperboard className="w-6 h-6" />
                </Link>
            </Tooltip>
            <Tooltip label={t('common.messages')} position={position}>
                <Link to="/messenger" className={getLinkClass('/messenger')}>
                    <MessageCircle className="w-6 h-6" />
                    {messages > 0 && (
                        <span className="absolute bottom-4.5 right-1 w-3 h-3 p-2 pt-2 flex justify-center items-center bg-red-500 rounded-full border-2 border-white text-white text-xs text-center font-bold">{messages}</span>
                    )}
                </Link>
            </Tooltip>

            <Tooltip label={t('common.profile')} position={position}>
                <Link to="/account/profile" className={getLinkClass('/account/profile')}>
                    <img src={user && user?.avatar_url ? user.avatar_url : '/icons/avatar1.svg'} alt={t('common.avatar')} className='w-7 h-7 object-cover rounded-full' />
                </Link>
            </Tooltip>

        </div>
    )
}
