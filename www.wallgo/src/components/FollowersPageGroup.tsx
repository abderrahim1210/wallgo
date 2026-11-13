import React, { useState } from 'react'
import type { User } from './Home'
import { t } from 'i18next';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import type { Group } from './Groups';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface FollowersPageGroupProps {
    u: User;
    user: User;
    obj: any;
    type: 'pages' | 'groups'
}

const FollowersPageGroup: React.FC<FollowersPageGroupProps> = ({ u, user, obj, type }) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const removeMember = async (id: number) => {
        if (!id) return null;
        setLoading(true);
        try {
            const res = await axios.delete(`${api_url}/${type}/${obj?.id}/remove_member/${id}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || t('profile.member_removed_successfully'));
                queryClient.invalidateQueries({ queryKey: [`${type}-followers`, obj?.id] });
            } else {
                setLoading(false);
                toast.error(res.data.message || t('profile.something_went_wrong'));
                console.log(res.data.message);
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response.data);
        }
    }

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="flex items-center gap-3 min-w-0">
                <img
                    src={u?.avatar_url || '/icons/avatar1.svg'}
                    alt={u?.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-800 flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate hover:underline cursor-pointer" onClick={() => navigate(`/profile/${u?.id}/${u?.username}`)}>
                        {u?.name}
                    </h4>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                        @{u?.username}
                    </span>
                </div>
            </div>

            {
                user?.id === obj?.owner_id && (
                    <button
                        disabled={loading}
                        onClick={() => removeMember(u.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
                    >
                        {loading ? t('profile.removing_member') : t('profile.remove_member')}
                    </button>
                )
            }
        </div>
    )
}

export default FollowersPageGroup