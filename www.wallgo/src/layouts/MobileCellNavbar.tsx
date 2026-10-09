import { Clapperboard, Compass, Flame, Home, MessageCircle, Plus, Search, User } from 'lucide-react';
import React from 'react'
import { Tooltip } from '../templates/Tooltip';
import { Link, useLocation } from 'react-router-dom';

export const MobileCellNavbar = () => {
    const position = "top";
    const location = useLocation();
    const currendPath = location.pathname;

    const isActive = (path: string) => currendPath === path;
    const getLinkClass = (path: string) => {
        return `rounded-xl transition-all duration-150 flex items-center justify-center ${isActive(path) ? 'text-[var(--special-purple)] bg-purple-50 shadow-inner' : 'text-gray-600 hover:text-[var(--special-purple)] transition-colors'}`;
    }
    return (
        <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-6 flex items-center justify-between z-50 shadow-lg'>
            <Tooltip label='Home' position={position}>
                <Link to="/" className={getLinkClass('/')}>
                    <Home className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label='For you' position={position}>
                <Link to="/search" className={getLinkClass('/search')}>
                    <Search className="w-6 h-6" />
                </Link>
            </Tooltip>

            {/* <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                <Link
                    to="/create-post"
                    className="flex items-center justify-center w-14 h-14 bg-[var(--special-purple)] text-white rounded-full  border-4 border-white hover:scale-105 transition-transform cursor-pointer"
                >
                    <Plus className="w-7 h-7" />
                </Link>
            </div> */}

            <Tooltip label='Messages' position={position}>
                <Link to="/reels" className={getLinkClass('/reels')}>
                    <Clapperboard className="w-6 h-6" />
                </Link>
            </Tooltip>
            <Tooltip label='Messages' position={position}>
                <Link to="/messenger" className={getLinkClass('/messenger')}>
                    <MessageCircle className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label='Profile' position={position}>
                <Link to="/account/profile" className={getLinkClass('/account/profile')}>
                    <User className="w-6 h-6" />
                </Link>
            </Tooltip>

        </div>
    )
}
