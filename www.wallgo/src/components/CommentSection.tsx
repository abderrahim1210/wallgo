import React, { useState } from 'react'
import { FiSend } from 'react-icons/fi';

interface Comment {
    id: number;
    user: {
        name: string;
        username: string;
        avatar: string;
    };
    content: string;
    time: string;
    likes: number;
};

interface CommentSectionProps {
    postId: number;
    // onClose: () => void
}
export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            user: {
                name: 'Sara Miller',
                username: 'saramiller',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
            },
            content: 'This looks absolutely stunning! Great work on the UI 🚀🔥',
            time: '2h ago',
            likes: 4,
        },
        {
            id: 2,
            user: {
                name: 'John Doe',
                username: 'johndoe',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Amazing photography and nice capture!',
            time: '1h ago',
            likes: 2,
        },
    ]);

    const [newComment, setNewComment] = useState('');

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const commentObj: Comment = {
            id: Date.now(),
            user: {
                name: 'Abderrahim',
                username: 'abdou_12',
                avatar: 'https://images.pexels.com/photos/15482284/pexels-photo-15482284.jpeg',
            },
            content: newComment,
            time: 'Just now',
            likes: 0,
        };

        setComments([commentObj, ...comments]);
        setNewComment('');
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full mx-auto">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base">Comments ({comments.length})</h3>
            </div>

            <div className=" overflow-y-auto p-4 space-y-4 divide-y divide-gray-50">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="pt-3 first:pt-0 flex items-start gap-3">
                            <img
                                src={comment.user.avatar}
                                alt={comment.user.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-xs sm:text-sm text-gray-900">{comment.user.name}</span>
                                        <span className="text-[11px] text-gray-400">{comment.time}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mt-1.5 ml-3 text-xs text-gray-500 font-medium">
                                    <button className="hover:text-[var(--special-purple)] transition">Like ({comment.likes})</button>
                                    <button className="hover:text-[var(--special-purple)] transition">Reply</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400 text-sm">
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
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] transition"
                />
                <button
                    type="submit"
                    className="bg-[var(--special-purple)] text-white p-2.5 rounded-xl hover:opacity-90 transition shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                >
                    <FiSend className="w-4 h-4" />
                </button>
            </form>

        </div>
    )
}
