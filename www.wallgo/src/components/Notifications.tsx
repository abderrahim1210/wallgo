import axios from 'axios';
import React from 'react'
import { FiCheck, FiHeart, FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { api_url } from '../pages/Auth/getUser';
import { useQuery } from '@tanstack/react-query';

interface Notification {
    id: string;
    type: string;
    read_at: string;
    data: {
        sender_id: number;
        sender_name: string;
        sender_avatar:string;
        post_id:number;
        type: string;
        message:string;
    }
    created_at: string;
}

interface NotificationsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${api_url}/notifications`, { withCredentials: true, withXSRFToken: true });
            if (res.data.succes) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data } = useQuery({
        queryKey: ['notifications'],
        queryFn: fetchNotifications
    });

    const notifications : Notification[] = data?.notifications || [];
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={(e) => {
                e.stopPropagation();
                onClose();
            }} />

            <div className="absolute right-0 mt-5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-2">

                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-base text-gray-800">Notifications</h3>
                    <button className="text-xs text-[var(--special-purple)] hover:underline font-medium flex items-center gap-1">
                        <FiCheck className="w-3.5 h-3.5" /> Mark all as read
                    </button>
                </div>

                <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${!notif.read_at ? 'bg-purple-50/50' : 'bg-white'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={notif.data.sender_avatar}
                                        alt={notif.data.sender_name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${notif.type === 'like' ? 'bg-rose-500' :
                                        notif.type === 'follow' ? 'bg-purple-600' : 'bg-blue-500'
                                        }`}>
                                        {notif.type === 'like' && <FiHeart className="w-2.5 h-2.5" />}
                                        {notif.type === 'follow' && <FiUserPlus className="w-2.5 h-2.5" />}
                                        {notif.type === 'comment' && <FiMessageSquare className="w-2.5 h-2.5" />}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-gray-800 leading-snug">
                                        <span className="font-semibold">{notif.data.sender_name}</span> {notif.data.message}
                                    </p>
                                    <span className="text-[11px] text-gray-400 mt-1 block">{notif.created_at}</span>
                                </div>

                                {!notif.read_at && (
                                    <span className="w-2 h-2 rounded-full bg-[var(--special-purple)] self-center shrink-0"></span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-400 text-sm">
                            No notifications yet
                        </div>
                    )}
                </div>

                <div className="p-2.5 border-t border-gray-100 text-center bg-gray-50">
                    <button className="text-xs font-semibold text-gray-600 hover:text-[var(--special-purple)] transition-colors">
                        View All Notifications
                    </button>
                </div>

            </div>
        </>
    )
}
