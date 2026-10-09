import React from 'react'
import { FiCheck, FiHeart, FiMessageSquare, FiUserPlus } from 'react-icons/fi';

interface Notification {
    id: number;
    type: 'like' | 'follow' | 'comment';
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    time: string;
    read: boolean;
}

interface NotificationsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const notifications: Notification[] = [
        {
            id: 1,
            type: 'like',
            user: {
                name: 'Sara Miller',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
            },
            content: 'liked your post.',
            time: '10m ago',
            read: false,
        },
        {
            id: 2,
            type: 'follow',
            user: {
                name: 'John Doe',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'started following you.',
            time: '1h ago',
            read: false,
        },
        {
            id: 3,
            type: 'comment',
            user: {
                name: 'Amina Alaoui',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
            },
            content: 'commented: "Amazing work! 🔥"',
            time: '3h ago',
            read: true,
        },
    ];
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />

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
                                className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-purple-50/50' : 'bg-white'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={notif.user.avatar}
                                        alt={notif.user.name}
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
                                        <span className="font-semibold">{notif.user.name}</span> {notif.content}
                                    </p>
                                    <span className="text-[11px] text-gray-400 mt-1 block">{notif.time}</span>
                                </div>

                                {!notif.read && (
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
