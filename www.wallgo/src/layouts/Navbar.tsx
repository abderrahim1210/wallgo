import { Bookmark, Clapperboard, Compass, Flame, Heart, Home, Menu, MessagesCircle, Plus, PlusCircle, PlusSquare, Search, UserCircle } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Tooltip } from '../templates/Tooltip'
import { Notifications } from '../components/Notifications'
import { useAuth } from '../hooks/AuthProvider'
import { Offcanvas } from '../templates/Offcanvas'
import AnimatedMenuIcon from '../Icons/AnimatedMenuIcon'

export const Navbar = () => {
    const linksClasse = "text-gray-700 hover:text-[var(--special-purple)] transition duration-150";
    const position = "bottom";
    const location = useLocation();
    const currendPath = location.pathname;

    const isActive = (path: string) => currendPath === path;
    const navigate = useNavigate();
    const getLinkClass = (path: string) => {
        return `rounded-xl transition-all duration-150 flex items-center justify-center ${isActive(path) ? 'text-[var(--special-purple)] bg-purple-50 shadow-inner' : 'text-gray-600 hover:text-[var(--special-purple)] hover:bg-gray-50'}`;
    }
    const [notifOpen, setNotifOpen] = useState(false);
    const { user } = useAuth()!;
    const [showMenu, setShowMenu] = useState(false);
    return (
        <>
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-2 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <ul className="flex items-center m-0 p-0 list-none">
                        <li>
                            <Link to={'/'} title='WallGo' className={`${currendPath === '/' && 'bg-blue'}`}>
                                <img src="/icons/logos/mix_logo1.png" alt="WallGo Logo" className="h-10 w-auto object-contain p-1" />
                            </Link>
                        </li>
                    </ul>

                    <ul className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 space-x-10 m-0 p-0 list-none">
                        <li>
                            <Tooltip label='Home' position={position}>
                                <Link to="/" className={getLinkClass('/')}>
                                    <Home className='w-7 h-7' />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='For you' position={position}>
                                <Link to="/search" className={getLinkClass('/search')}>
                                    <Search className='w-7 h-7' />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Create Post' position={position}>
                                <Link to="/reels" className={getLinkClass('/reels')}>
                                    <Clapperboard className="w-7 h-7" />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Messages' position={position}>
                                <Link to="/messenger" className={getLinkClass('/messenger')}>
                                    <MessagesCircle className='w-7 h-7' />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Discover' position={position}>
                                <Link to="/saved_posts" className={getLinkClass('/saved_posts')}>
                                    <Bookmark className='w-7 h-7' />
                                </Link>
                            </Tooltip>
                        </li>

                    </ul>

                    <ul className="flex items-center m-0 p-0 space-x-3 list-none">
                        {
                            user ? (
                                <>
                                    <li className='flex items-center space-x-3'>
                                        <Tooltip label='Create post' position={position}>
                                            <button className={`${linksClasse} cursor-pointer lg:hidden hover:text-[var(--special-purple)]`} onClick={() => navigate('/create_post')}>
                                                <PlusCircle className='w-7 h-7' />
                                            </button>
                                        </Tooltip>
                                        <Tooltip label='Notifications' position={position}>
                                            <button className={`${linksClasse} cursor-pointer hover:text-[var(--special-red)]`} onClick={() => setNotifOpen(prev => !prev)}>
                                                <Heart className='w-7 h-7' />
                                            </button>
                                        </Tooltip>
                                        <Notifications isOpen={notifOpen} onClose={() => setNotifOpen(false)} />


                                        <Tooltip label='Account' position={position}>
                                            <Link to="/account/profile" className={`${getLinkClass('/account/profile')} hidden md:block`}>
                                                <img src={user?.avatar_url ?? '/icons/avatar1.svg'} alt='avatar' className='w-7 h-7 object-cover rounded-full' />
                                            </Link>
                                        </Tooltip>
                                    </li>
                                    <button className='cursor-pointer lg:hidden' onClick={() => setShowMenu(prev => !prev)}>
                                        <AnimatedMenuIcon className='hover:text-[var(--special-purple)] transition-all' />
                                    </button>

                                    {
                                        showMenu && (
                                            <Offcanvas user={user} onClose={() => setShowMenu(false)} />
                                        )
                                    }
                                </>
                            ) : (
                                <li className='flex items-center space-x-3'>
                                    <Link to={'/account/login'} className='font-bold text-gray-700 hover:text-[var(--special-purple)] transition-colors'>
                                        Login
                                    </Link>
                                    <Link to={'/account/signup'} className='px-4 py-2 font-bold bg-[var(--special-purple)] rounded-lg text-white hover:bg-opacity-90 transition-all'>
                                        Sign Up
                                    </Link>
                                </li>
                            )
                        }

                    </ul>

                </div>
            </nav>
        </>
    )
}
