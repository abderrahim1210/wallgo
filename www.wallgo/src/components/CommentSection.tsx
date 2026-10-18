import React, { useState } from 'react'
import { FiSend } from 'react-icons/fi';
import { CommentItem, type Comment } from './CommentItem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';

// interface Comment {
//     id: number;
//     user: {
//         name: string;
//         username: string;
//         avatar_url: string;
//     };
//     content: string;
//     crea: string;
//     likes: number;
// };

interface CommentSectionProps {
    postId: number;
    // userId: number;
}
export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    // const [comments, setComments] = useState<Comment[]>([
    //     {
    //         id: 1,
    //         user: {
    //             name: 'Sara Miller',
    //             username: 'saramiller',
    //             avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    //         },
    //         content: 'This looks absolutely stunning! Great work on the UI 🚀🔥',
    //         time: '2h ago',
    //         likes: 4,
    //     },
    //     {
    //         id: 2,
    //         user: {
    //             name: 'John Doe',
    //             username: 'johndoe',
    //             avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    //         },
    //         content: 'Amazing photography and nice capture!',
    //         time: '1h ago',
    //         likes: 2,
    //     },
    // ]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${api_url}/comments/${postId}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.comments;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: comments = [] } = useQuery({
        queryKey: ['comments', postId],
        queryFn: fetchComments,
        enabled:!!postId,
        staleTime: 1000 * 60 * 5
    });

    const [newComment, setNewComment] = useState('');
    const queryClient = useQueryClient();
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(`${api_url}/comments/create`, { post_id: postId, content: newComment }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message || 'Comment added successfully');
                queryClient.invalidateQueries({ queryKey: ['comments'] });
            } else {
                toast.error(res.data.message || 'Failed to add comment');
                console.error(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
        setNewComment('');
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full mx-auto">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base">Comments ({comments?.length})</h3>
            </div>

            <div className="overflow-y-auto p-4 space-y-4 divide-y divide-gray-50">
                {comments?.length > 0 ? (
                    comments.map((comment: Comment, index:number) => (
                        <CommentItem comment={comment} postId={postId} key={index} />
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        No comments yet. Be the first to comment!
                    </div>
                )}
            </div>

            <form onSubmit={handleAddComment} className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5  text-gray-800 focus:outline-none focus:border-[var(--special-purple)] transition"
                />
                <button
                    type="submit"
                    className="bg-[var(--special-purple)] text-white p-2.5 rounded-xl hover:opacity-90 transition shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                >
                    <FiSend className="w-5 h-5" />
                </button>
            </form>

        </div>
    )
}
