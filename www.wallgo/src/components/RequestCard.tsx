import React, { useState } from 'react'
import type { Request } from './JoinGroupRequests'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useFollowPG } from './useFollowPG';
import { useTranslation } from 'react-i18next';

interface RequestCardProps {
    request: Request;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const changeStatus = async (status: string) => {
        if (!request.id) return null;
        setLoading(true);
        try {
            const res = await axios.post(`${api_url}/request/change_status`, { group_id: request?.group.id, request_id: request.id, user_id: request?.user.id, status: status }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || t('requests.statusChanged'));
                queryClient.invalidateQueries({ queryKey: ['groups_requests'] });
            } else {
                setLoading(false);
                toast.error(res.data.message || t('requests.statusChangeFailed'));
                console.log(res.data.message);
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response.data);
        }
    }
    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md mb-3">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src={request.user.avatar_url || '/icons/avatar1.svg'}
                        alt={request.user.username}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                    />
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base">{request.user.username}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => navigate(`/profile/${request?.user.id}/${request?.user.username}`)}>@{request.user.username}</p>
                        <p className="text-xs text-[var(--special-purple)] font-medium mt-0.5">
                            {t('requests.wantsToJoin')} <span className="font-bold">{request.group.name}</span>
                        </p>
                    </div>
                </div>

                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {moment(request?.created_at).fromNow()}
                </span>
            </div>

            {request.answer && (
                <div className="mt-3 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 block text-xs mb-1 uppercase tracking-wider">{t('requests.answer')}</span>
                    <p>{request.answer}</p>
                </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
                <button
                    disabled={loading}
                    onClick={() => changeStatus('rejected')}
                    className="px-4 py-2 cursor-pointer rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                >
                    {t('requests.reject')}
                </button>
                <button
                    disabled={loading}
                    onClick={() => changeStatus('accepted')}
                    className="px-4 py-2 cursor-pointer rounded-xl text-xs font-semibold text-white bg-[var(--special-purple)] shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50"
                >
                    {t('requests.accept')}
                </button>
            </div>
        </div>
    )
}
