import { Compass, Flame, Home, MessageCircle, MessageSquare, Sparkles, User } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '../templates/Tooltip';

export const Footer = () => {
    const date = new Date();
    const year = date.getFullYear();
    const linksClass = "hover:text-[var(--special-purple)] transition-colors";
    const linksClassFooter = "text-gray-600 hover:text-[var(--special-purple)] transition-colors";
    const position = "bottom";
    return (
        <div>
            <footer className='hidden lg:block py-6 border-t border-gray-100 bg-white'>
                <div className='max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500'>
                    <p>&copy;{year} All rights reserved by WallGo.</p>
                    <div className="flex space-x-6 mt-2 sm:mt-0">
                        <Link to="#" className={linksClass}>About</Link>
                        <Link to="#" className={linksClass}>Privacy</Link>
                        <Link to="#" className={linksClass}>Terms</Link>
                        <Link to="#" className={linksClass}>Support</Link>
                    </div>
                </div>
            </footer>
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
        </div>
    )
}
