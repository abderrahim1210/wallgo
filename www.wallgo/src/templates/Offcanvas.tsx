import axios from 'axios';
import { Bookmark, FileText, Layers, LogOut, Settings, Users, X } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';

interface OffcanvasProps {
    onClose: () => void;
    user: {
        name: string;
        username: string;
        avatar_url: string;
    };
}
export const Offcanvas: React.FC<OffcanvasProps> = ({ user, onClose }) => {
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
            const res = await axios.delete(`${api_url}/logout`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message || 'You are logged out successfully');
                setTimeout(() => {
                    navigate('/account/login');
                }, 1000);
            } else {
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-xs"
                onClick={onClose}
            />

            <div className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">

                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex mt-3 items-center space-x-3">
                        <img
                            src={user?.avatar_url || '/icons/avatar1.svg'}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{user?.name}</h4>
                            <span className="text-xs text-gray-400 truncate">@{user?.username}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-red-400 rounded-full transition"
                    >
                        <X size={25} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                    <Link
                        to="/myposts"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-medium transition"
                    >
                        <FileText size={20} className='text-blue-500' />
                        <span>My Posts</span>
                    </Link>

                    <Link
                        to="/pages"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-medium transition"
                    >
                        <Layers size={20} className='text-emerald-500' />
                        <span>Pages</span>
                    </Link>

                    <Link
                        to="/groups"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-medium transition"
                    >
                        <Users size={20} className='text-[var(--special-red)]' />
                        <span>Groups</span>
                    </Link>

                    <Link
                        to="/bookmarks"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-medium transition"
                    >
                        <Bookmark size={20} className='text-purple-500' />
                        <span>Bookmarks</span>
                    </Link>

                    <Link
                        to="/settings"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 p-3 rounded-xl font-medium transition"
                    >
                        <Settings size={20} className='text-[var(--special-gray)]' />
                        <span>Settings</span>
                    </Link>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogOut}
                        className="w-full flex items-center justify-center cursor-pointer space-x-2 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition text-sm"
                    >
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>

            </div>
        </div>
    )
}
