import axios from 'axios';
import { Bookmark, FileText, Layers, LogOut, Settings, Users, X } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const handleLogOut = async () => {
        try {
            const res = await axios.delete(`${api_url}/logout`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message || t('common.logoutSuccess'));
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

            <div className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">

                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex mt-3 items-center space-x-3">
                        <img
                            src={user?.avatar_url || '/icons/avatar1.svg'}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{user?.name}</h4>
                            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">@{user?.username}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-400 rounded-full transition"
                    >
                        <X size={25} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1.5">

                    <Link
                        to="/pages"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 p-3 rounded-xl font-medium transition"
                    >
                        <Layers size={20} className='text-emerald-500 dark:text-emerald-400' />
                        <span>{t('common.pages')}</span>
                    </Link>

                    <Link
                        to="/groups"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 p-3 rounded-xl font-medium transition"
                    >
                        <Users size={20} className='text-[var(--special-red)]' />
                        <span>{t('common.groups')}</span>
                    </Link>

                    <Link
                        to="/bookmarks"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 p-3 rounded-xl font-medium transition"
                    >
                        <Bookmark size={20} className='text-purple-500 dark:text-purple-400' />
                        <span>{t('common.bookmarks')}</span>
                    </Link>

                    <Link
                        to="/settings"
                        onClick={onClose}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 p-3 rounded-xl font-medium transition"
                    >
                        <Settings size={20} className='text-[var(--special-gray)]' />
                        <span>{t('common.settings')}</span>
                    </Link>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogOut}
                        className="w-full flex items-center justify-center cursor-pointer space-x-2 py-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-semibold transition text-sm"
                    >
                        <LogOut size={18} />
                        <span>{t('common.logout')}</span>
                    </button>
                </div>

            </div>
        </div>
    )
}
