import { Compass, Flame, Home, MessageCircle, User } from 'lucide-react';
import React from 'react'
import { Tooltip } from '../templates/Tooltip';
import { Link } from 'react-router-dom';

export const MobileCellNavbar = () => {
    const linksClassFooter = "text-gray-600 hover:text-[var(--special-purple)] transition-colors";
    const position = "bottom";
    return (
        <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex items-center justify-between z-50'>
            <Tooltip label='Home' position={position}>
                <Link to="#" className={linksClassFooter}>
                    <Home className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label='For you' position={position}>
                <Link to="#" className={linksClassFooter}>
                    <Flame className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label='Messages' position={position}>
                <Link to="#" className={linksClassFooter}>
                    <MessageCircle className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label='Discover' position={position}>
                <Link to="#" className={linksClassFooter}>
                    <Compass className="w-6 h-6" />
                </Link>
            </Tooltip>

            <Tooltip label='Account' position={position}>
                <Link to="#" className={linksClassFooter}>
                    <User className="w-6 h-6" />
                </Link>
            </Tooltip>
        </div>
    )
}
