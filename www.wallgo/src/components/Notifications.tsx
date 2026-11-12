import axios from 'axios';
import React from 'react'
import { FiCheck } from 'react-icons/fi';
import { api_url } from '../pages/Auth/getUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { NotificationCard } from './NotificationCard';
import { useTranslation } from 'react-i18next';

export interface Notification {
    id: string;
    type: string;
    read_at: string;
    data: {
        user_id: number;
        user_name: string;
        user_avatar: string;
        post_id: number;
        type: string;
        message: string;
        link: string;
        followig_id?: number;
        comment_content?:string;
    }
    created_at: string;
}

interface NotificationsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${api_url}/notifications`, { withCredentials: true, withXSRFToken: true });
            if (res.data && res.data.success) {
                return res.data.notifications;
            }
            return [];
        } catch (err: any) {
            console.error(err?.response.data);
            return [];
        }
    }

    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
        enabled: isOpen
    });


    const queryClient = useQueryClient();
    const handleReadAll = async () => {
        try {
            await axios.post(`${api_url}/notifications/is_read/all`, {}, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success){
                    queryClient.invalidateQueries({queryKey:['notifications']})
                }
            });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    const navigate = useNavigate();
    if (!isOpen) return null;
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={(e) => {
                e.stopPropagation();
                onClose();
            }} />

            <div className="absolute ltr:right-0 rtl:left-0 top-0 mt-5 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden transform transition-all animate-in fade-in slide-in-from-top-2">

                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                    <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">{t('notifications.title')}</h3>
                    <button onClick={handleReadAll} className="text-xs text-[var(--special-purple)] hover:underline font-medium flex items-center gap-1">
                        <FiCheck className="w-3.5 h-3.5" /> {t('notifications.markAllRead')}
                    </button>
                </div>

                <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <NotificationCard notif={notif} key={notif.id} />
                        ))
                    ) : (
                        <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                            {t('notifications.empty')}
                        </div>
                    )}
                </div>

                <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50 dark:bg-gray-800">
                    <button onClick={() => navigate('/notifications/all')} className="cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-[var(--special-purple)] transition-colors">
                        {t('notifications.viewAll')}
                    </button>
                </div>

            </div>
        </>
    )
}
