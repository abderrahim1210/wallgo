import axios from 'axios';
import { Check, Edit3, Flag, Heart, Link, MoreHorizontal, Trash2, X } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { api_url } from '../pages/Auth/getUser';
import { FiSend } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/AuthProvider';
import { DropdownMenu, type DropdownItem } from '../templates/DropdownMenu';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import { Report } from './Report';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export interface Comment {
    id: number;
    user_id: number;
    content: string;
    post_id: number;
    created_at: string;
    updated_at: string;
    is_liked: boolean;
    reply_to?: number;
    likes_count: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    }
    replies?: Comment[]
}

interface CommentItemProps {
    comment: Comment;
    postId?: number;
    openReport: (isopen: boolean) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, openReport }) => {
    const navigate = useNavigate();
    const [addReplay, setAddReplay] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [liked, setLiked] = useState<boolean>(Boolean(comment?.is_liked));
    const { user } = useAuth()!;
    const [edit, setEdit] = useState(false);
    const [newContent, setNewContent] = useState(comment?.content);
    const { closeModal } = useModal()!;
    useEffect(() => {
        setLiked(Boolean(comment?.is_liked));
    }, [comment?.is_liked]);

    useEffect(() => {
        setNewContent(comment?.content);
    }, [edit]);

    const queryClient = useQueryClient();
    const handleLike = async () => {
        try {
            const res = await axios.post(`${api_url}/add_like`, { type: 'comment', comment_id: comment?.id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLiked(prev => !prev);
                queryClient.invalidateQueries({ queryKey: ['comments'] });
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const handleAddComment = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!replyContent) return null;
        try {
            const cmnt_id = comment?.reply_to ? comment.reply_to : comment?.id;
            const res = await axios.post(`${api_url}/comments/create`, { content: `@${comment.user.username} ${replyContent}`, post_id: postId, reply_to: cmnt_id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setAddReplay(false);
                queryClient.invalidateQueries({ queryKey: ['comments'] });
                setReplyContent('');
            } else {
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const editComment = async () => {
        if (!newContent) return null;
        try {
            const res = await axios.post(`${api_url}/comments/create`, { content: newContent, post_id: postId, comment_id: comment?.id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setEdit(false);
                setNewContent('');
                queryClient.invalidateQueries({ queryKey: ['comments'] });
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const isOwner = user?.id === comment?.user.id;
    const handleDelete = async () => {
        Swal.fire({
            title: "Delete comment",
            text: `Are you sure for delete this comment ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes , delete it',
            confirmButtonColor: '#7371FC',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${api_url}/comments/${comment?.id}`, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success(res.data.message || 'Comment deleted successfully');
                        queryClient.invalidateQueries({ queryKey: ['comments'] });
                    } else {
                        toast.error(res.data.message || 'Failed to delete comment');
                        console.log(res.data.message);
                    }
                } catch (err: any) {
                    console.error(err?.response.data);
                }
            }
        })
    }
    const commentMenuItems: DropdownItem[] = [
        {
            label: 'Copy Comment',
            icon: <Link className="w-4 h-4 text-blue-500" />,
            onClick: () => {
                navigator.clipboard.writeText(comment?.content);
                toast.success('Comment copied successfully');
            },
        },

        ...(isOwner ? [
            {
                label: `${edit ? 'Cancel Edit' : 'Edit Comment'}`,
                icon: <Edit3 className="w-4 h-4 text-emerald-500" />,
                onClick: () => { setEdit(prev => !prev) },
            },
            {
                label: 'Delete Comment',
                icon: <Trash2 className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: handleDelete,
            },
        ] : []),
        ...(!isOwner ? [
            {
                label: 'Report Comment',
                icon: <Flag className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => {
                    closeModal?.();
                    setTimeout(() => {
                        openReport(true);
                    }, 50);
                },
            },
        ] : [])
    ];
    return (
        <div key={comment?.id} className="pt-3 first:pt-0 flex items-start gap-3">
            <img
                src={comment?.user.avatar_url ?? "/icons/avatar1.svg"}
                alt={comment?.user.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/profile/${comment?.user.id}/${comment?.user.username}`)}>{comment.user.name}</span>
                        <span className="text-[12px] text-gray-400">{moment(comment.created_at).fromNow()}</span>
                    </div>
                    {
                        edit ? (
                            <div className='flex justify-center items-center gap-2'>
                                <input type="text"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[var(--special-purple)] transition shadow-sm"
                                />
                                <button className='cursor-pointer' onClick={editComment}>
                                    <Check className='text-[var(--special-purple)]' />
                                </button>
                                <button className='cursor-pointer' onClick={() => {
                                    setEdit(false);
                                    setNewContent(comment?.content);
                                }}>
                                    <X className='text-red-600' />
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                                {comment.content}
                            </p>
                        )
                    }
                </div>

                <div className="flex items-center gap-4 mt-1.5 ml-3 text-xs text-gray-500 font-medium">
                    <button onClick={handleLike} className="hover:text-[var(--special-red)] cursor-pointer transition flex justify-center gap-1">
                        <Heart className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : ''}`} /> {comment?.likes_count}
                    </button>
                    <button onClick={() => setAddReplay(prev => !prev)} className="hover:text-[var(--special-purple)] cursor-pointer transition">{addReplay ? 'Cancel' : `Reply ${comment.replies ? `(${comment.replies?.length})` : ''}`}</button>
                    <DropdownMenu
                        trigger={
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:text-[var(--special-purple)] rounded-full transition-colors cursor-pointer">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        }
                        items={commentMenuItems}
                    />
                </div>
                {addReplay && (
                    <>
                        <form onSubmit={handleAddComment} className="mt-3 flex items-center gap-2 animate-fadeIn">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to @${comment.user.username}...`}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[var(--special-purple)] transition shadow-sm"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-[var(--special-purple)] text-white p-2 rounded-xl hover:opacity-90 transition shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                            >
                                <FiSend className="w-3.5 h-3.5" />
                            </button>
                        </form>
                        {comment?.replies && comment.replies.length > 0 && (
                            <div className="pl-4 mt-3 border-l-2 border-gray-100 space-y-3">
                                {comment.replies.map((reply: Comment) => (
                                    <CommentItem key={reply.id} comment={reply} postId={postId} openReport={openReport} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    )
}
