import moment from 'moment';
import React from 'react'
import { useNavigate } from 'react-router-dom';

export interface Comment {
    id: number;
    user_id: number;
    content: string;
    post_id: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    }
}

interface CommentItemProps {
    comment: Comment;

}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const navigate = useNavigate();
    return (
        <div key={comment.id} className="pt-3 first:pt-0 flex items-start gap-3">
            <img
                src={comment?.user.avatar_url ?? "/icons/avatar1.svg"}
                alt={comment?.user.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/profile/${comment?.user.id}/${comment?.user.username}`)}>{comment.user.name}</span>
                        <span className="text-[15px] text-gray-400">{moment(comment.created_at).fromNow()}</span>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {comment.content}
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-1.5 ml-3 text-xs text-gray-500 font-medium">
                    <button className="hover:text-[var(--special-purple)] transition">Reply</button>
                </div>
            </div>
        </div>
    )
}
