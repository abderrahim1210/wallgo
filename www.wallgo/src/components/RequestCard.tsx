import React from 'react'
import type { Request } from './JoinGroupRequests'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

interface RequestCardProps {
    request: Request;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
    const navigate = useNavigate();
    return (
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md mb-3">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src={request.user.avatar_url || '/icons/avatar1.svg'}
                        alt={request.user.username}
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                        <h4 className="font-semibold text-gray-900 text-base">{request.user.username}</h4>
                        <p className="text-xs text-gray-500 cursor-pointer" onClick={() => navigate(`/profile/${request?.user.id}/${request?.user.username}`)}>@{request.user.username}</p>
                        <p className="text-xs text-[var(--special-purple)] font-medium mt-0.5">
                            Wants to join: <span className="font-bold">{request.group.name}</span>
                        </p>
                    </div>
                </div>

                <span className="text-xs text-gray-400 font-medium">
                    {moment(request?.created_at).fromNow()}
                </span>
            </div>

            {request.answer && (
                <div className="mt-3 px-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
                    <span className="font-semibold text-gray-900 block text-xs mb-1 uppercase tracking-wider">Answer:</span>
                    <p>{request.answer}</p>
                </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                <button
                    // disabled={loading}
                    // onClick={() => handleAction('reject')}
                    className="px-4 py-2 cursor-pointer rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                    Reject
                </button>
                <button
                    // disabled={loading}
                    // onClick={() => handleAction('accept')}
                    className="px-4 py-2 cursor-pointer rounded-xl text-xs font-semibold text-white bg-[var(--special-purple)] shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50"
                >
                    Accept
                </button>
            </div>
        </div>
    )
}
