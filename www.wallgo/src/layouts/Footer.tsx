import { Compass, Flame, Home, MessageCircle, MessageSquare, Sparkles, User } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '../templates/Tooltip';

export const Footer = () => {
    const date = new Date();
    const year = date.getFullYear();
    const linksClass = "hover:text-[var(--special-purple)] transition-colors";
    
    return (
        <>
            <footer className='hidden lg:block py-6'>
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
        </>
    )
}
