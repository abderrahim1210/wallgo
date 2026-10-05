import { Bookmark, Clapperboard, Compass, Flame, Heart, Home, MessagesCircle, PlusSquare, Search, UserCircle } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Tooltip } from '../templates/Tooltip'

export const Navbar = () => {
    const linksClasse = "text-gray-700 hover:text-[var(--special-purple)] transition duration-150";
    const position = "bottom";
    const location = useLocation();
    const currendPath = location.pathname;

    const isActive = (path: string) => currendPath === path;
    const getLinkClass = (path: string) => {
        return `rounded-xl transition-all duration-150 flex items-center justify-center ${isActive(path) ? 'text-[var(--special-purple)] bg-purple-50 shadow-inner' : 'text-gray-600 hover:text-[var(--special-purple)] hover:bg-gray-50'}`;
    }
    return (
        <>
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <ul className="flex items-center m-0 p-0 list-none">
                        <li>
                            <Link to={'/'} title='WallGo' className={`${currendPath === '/' && 'bg-blue'}`}>
                                <img src="/icons/dark_logo.png" alt="WallGo Logo" className="h-10 w-auto object-contain p-1" />
                            </Link>
                        </li>
                    </ul>

                    <ul className="hidden md:flex items-center space-x-10 m-0 p-0 list-none">
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
                                <Link to="/create-post" className={getLinkClass('/create-post')}>
                                    <Clapperboard className="w-6 h-6" />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Messages' position={position}>
                                <Link to="/messages" className={getLinkClass('/messages')}>
                                    <MessagesCircle />
                                </Link>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip label='Discover' position={position}>
                                <Link to="/discover" className={getLinkClass('/discover')}>
                                    <Bookmark />
                                </Link>
                            </Tooltip>
                        </li>

                    </ul>

                    <ul className="flex items-center m-0 p-0 list-none">
                        {/* <li>
                            <Link to={'/'} className={linksClasse}>
                                <Heart className='w-6 h-6' />
                            </Link>
                        </li>
                        <li>
                            <Tooltip label='Account' position={position}>
                                <Link to="#" className={`flex items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors ${linksClasse}`}>
                                    <UserCircle className="w-6 h-6" />
                                </Link>
                            </Tooltip>
                        </li> */}
                        <li className='flex items-center space-x-3'>
                            <Link to={'/account/login'} className='font-bold text-gray-700 hover:text-[var(--special-purple)] transition-colors'>
                                Login
                            </Link>
                            <Link to={'/account/signup'} className='px-4 py-2 font-bold bg-[var(--special-purple)] rounded-lg text-white hover:bg-opacity-90 transition-all'>
                                Sign Up
                            </Link>
                        </li>
                    </ul>

                </div>
            </nav>
        </>
    )
}
