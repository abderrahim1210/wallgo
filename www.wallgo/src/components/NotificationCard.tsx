import React from 'react'
import type { Notification } from './Notifications'
import { FiHeart, FiMessageSquare, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../pages/Auth/getUser'
import moment from 'moment'

interface NotificationCardProps {
    notif: Notification
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notif }) => {
    const navigate = useNavigate();
    const handleRead = async (id: string) => {
        if (!id) return null;
        try {
            await axios.post(`${api_url}/notifications/is_read`, { notification_id: id }, { withCredentials: true, withXSRFToken: true });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return (
        <div
            key={notif.id}
            onClick={() => {
                navigate(notif.data.link);
                handleRead(notif.id);
            }}
            className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${!notif.read_at ? 'bg-purple-50/50' : 'bg-white'
                }`}
        >
            <div className="relative shrink-0">
                <img
                    src={notif.data.user_avatar}
                    alt={notif.data.user_name}
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
                    <span className="font-semibold">{notif.data.user_name}</span> {notif.data.message} {notif?.data?.comment_content && `"${notif.data.comment_content}"`}
                </p>
                <span className="text-[11px] text-gray-400 mt-1 block">{moment(notif.created_at).fromNow()}</span>
            </div>

            {!notif.read_at && (
                <span className="w-2 h-2 rounded-full bg-[var(--special-purple)] self-center shrink-0"></span>
            )}
        </div>
    )
}
