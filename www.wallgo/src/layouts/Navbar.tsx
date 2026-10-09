import { Bookmark, Clapperboard, Compass, Flame, Heart, Home, MessagesCircle, PlusSquare, Search, UserCircle } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from '../templates/Tooltip'
import { Notifications } from '../components/Notifications'

export const Navbar = () => {
    const linksClasse = "text-gray-700 hover:text-[var(--special-purple)] transition duration-150";
    const position = "bottom";
    const location = useLocation();
    const currendPath = location.pathname;

    const isActive = (path: string) => currendPath === path;
    const getLinkClass = (path: string) => {
        return `rounded-xl transition-all duration-150 flex items-center justify-center ${isActive(path) ? 'text-[var(--special-purple)] bg-purple-50 shadow-inner' : 'text-gray-600 hover:text-[var(--special-purple)] hover:bg-gray-50'}`;
    }
    const [notifOpen, setNotifOpen] = useState(false);
    return (
        <>
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-2 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <ul className="flex items-center m-0 p-0 list-none">
                        <li>
                            <Link to={'/'} title='WallGo' className={`${currendPath === '/' && 'bg-blue'}`}>
                                <img src="/icons/dark_logo.png" alt="WallGo Logo" className="h-10 w-auto object-contain p-1" />
                            </Link>
                        </li>
                    </ul>

                    <ul className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 space-x-10 m-0 p-0 list-none">
                        <li>
                            <Tooltip label='Home' position={position}>
                                <Link to="/" className={getLinkClass('/')}>
                                    <Home />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='For you' position={position}>
                                <Link to="/search" className={getLinkClass('/search')}>
                                    <Search />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Create Post' position={position}>
                                <Link to="/reels" className={getLinkClass('/reels')}>
                                    <Clapperboard className="w-6 h-6" />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Messages' position={position}>
                                <Link to="/messenger" className={getLinkClass('/messenger')}>
                                    <MessagesCircle />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Discover' position={position}>
                                <Link to="/saved_posts" className={getLinkClass('/saved_posts')}>
                                    <Bookmark />
                                </Link>
                            </Tooltip>
                        </li>

                    </ul>

                    <ul className="flex items-center m-0 p-0 list-none">
                        <li className='flex items-center space-x-3'>
                            <Tooltip label='Notifications' position={position}>
                                <Link to={'/'} className={`${linksClasse} hover:text-[var(--special-red)]`} onClick={() => setNotifOpen(prev => !prev)}>
                                    <Heart className='w-6 h-6' />
                                </Link>
                            </Tooltip>
                            <Notifications isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                            {/* </li>
                        <li> */}
                            <Tooltip label='Account' position={position}>
                                <Link to="/account/profile" className={getLinkClass('/account/profile')}>
                                    <UserCircle className="w-6 h-6" />
                                </Link>
                            </Tooltip>
                        </li>
                        {/* <li className='flex items-center space-x-3'>
                            <Link to={'/account/login'} className='font-bold text-gray-700 hover:text-[var(--special-purple)] transition-colors'>
                                Login
                            </Link>
                            <Link to={'/account/signup'} className='px-4 py-2 font-bold bg-[var(--special-purple)] rounded-lg text-white hover:bg-opacity-90 transition-all'>
                                Sign Up
                            </Link>
                        </li> */}
                    </ul>

                </div>
            </nav>
        </>
    )
}
