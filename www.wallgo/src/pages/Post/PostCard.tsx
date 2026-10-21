import { AlertTriangle, Bookmark, Edit3, Flag, Heart, Link, MessageCircle, MoreHorizontal, Share2, Trash2, X } from 'lucide-react';
import React, { useState } from 'react'
import { DropdownMenu, type DropdownItem } from '../../templates/DropdownMenu';
import { Toast, type ToastType } from '../../components/Toast';
import { useModal } from '../../hooks/ModalProvider';
import ModalTemplate from '../../templates/ModalTemplate';
import { CommentSection } from '../../components/CommentSection';
import ShareDropdown from '../../components/ShareDropdown';
import moment from 'moment';
import { useAuth } from '../../hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../templates/PostGrid';
import { SelectedPosts } from '../../components/SelectedPosts';
import { Report } from '../../components/Report';
import { Link as LinkR } from 'react-router-dom'
import axios from 'axios';
import { api_url } from '../Auth/getUser';
interface PostCardProps {
    post: Post;
    onDelete: (id: number) => void;
}
export const PostCard: React.FC<PostCardProps> = ({
    post,
    onDelete
}) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post?.likes_count);
    const [saved, setSaved] = useState(false);
    const { show, openModal, closeModal } = useModal()!;
    const { user: currentUser } = useAuth()!;
    const handleLike = async () => {
        if (liked) {
            setLikes(likes - 1);
            setLiked(false);
        } else {
            setLikes(likes + 1);
            setLiked(true);
        }
        try {
            const res = await axios.post(`${api_url}/add_like`, { post_id: post?.id, type: 'post' }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                if (res.data.is_liked) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            } else {
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const triggerToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const isOwner = currentUser?.id === post?.user?.id;

    const navigate = useNavigate();

    const postMenuItems: DropdownItem[] = [
        {
            label: 'Copy link',
            icon: <Link className="w-4 h-4 text-blue-500" />,
            onClick: () => triggerToast('Copy link', 'success'),
        },

        ...(isOwner ? [
            {
                label: 'Edit Post',
                icon: <Edit3 className="w-4 h-4 text-emerald-500" />,
                onClick: () => navigate(`/post/${post?.id}/edit`, { state: { postToEdit: { content: post?.content, media_url: post?.media_url, created_at: post?.created_at }, id: post?.id } }),
            },
            {
                label: 'Delete Post',
                icon: <Trash2 className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => onDelete(post?.id),
            },
        ] : []),
        ...(!isOwner ? [
            {
                label: 'Report Post',
                icon: <Flag className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => openModal('report'),
            },
        ] : [])
    ];

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center space-x-3">
                    {
                        post?.is_owner && post?.postable ? (
                            <img
                                src={post?.postable?.logo_url || '/icons/users.svg'}
                                alt={post?.user.name}
                                className="w-10 h-10 rounded-full object-cover border border-purple-100"
                            />
                        ) : (
                            <img
                                src={post?.user?.avatar_url || '/icons/avatar1.svg'}
                                alt={post?.user.name}
                                className="w-10 h-10 rounded-full object-cover border border-purple-100"
                            />
                        )
                    }
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                            {
                                post?.is_owner && post?.postable ? (
                                    <LinkR to={`/pages/${post?.postable?.id}`}>
                                        {post?.postable?.name}
                                    </LinkR>
                                ) : (
                                    <LinkR to={`/profile/${post?.user.id}/${post?.user.username}`}>
                                        {post?.user.name}
                                    </LinkR>
                                )
                            }
                        </h4>
                        <span className="text-xs text-gray-500">
                            {!post?.postable && `@${post?.user.username} • `} {moment(post?.created_at).fromNow()}
                        </span>
                    </div>
                </div>
                <DropdownMenu
                    trigger={
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    }
                    items={postMenuItems}
                />

                {
                    toast && (
                        <Toast message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)} />
                    )
                }
            </div>

            <div className="px-4 pb-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {post?.content}
            </div>

            {post?.media_url && (
                <div className="w-full bg-gray-50 max-h-[500px] overflow-hidden flex items-center justify-center">
                    <img src={post?.media_url} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" onClick={() => setSelectedPost(post)} />
                </div>
            )}

            {
                show === `comments_${post?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <CommentSection postId={post?.id} />
                    </ModalTemplate>
                )
            }

            {
                show === 'share' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ShareDropdown postUrl={window.location.href} />
                    </ModalTemplate>
                )
            }

            {
                show === 'report' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={post?.id} type='post_id' />
                    </ModalTemplate>
                )
            }

            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 mt-1">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group cursor-pointer"
                    >
                        <Heart
                            className={`w-6 h-6 transition-transform active:scale-125 ${liked || post?.is_liked ? 'text-red-500 fill-red-500' : 'group-hover:scale-110'
                                }`}
                        />
                        <span className="text-xs font-semibold text-gray-700">{likes}</span>
                    </button>

                    <button onClick={() => openModal(`comments_${post?.id}`)} className="flex items-center space-x-2 text-gray-600 hover:text-[var(--special-purple)] transition-colors group cursor-pointer">
                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-gray-700">{post?.comments_count}</span>
                    </button>

                    <button onClick={() => openModal('share')} className="text-gray-600 hover:text-blue-500 transition-colors group cursor-pointer">
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <button
                    onClick={() => setSaved(!saved)}
                    className={`text-gray-600 hover:text-[var(--special-purple)] transition-colors cursor-pointer ${saved ? 'text-[var(--special-purple)]' : ''
                        }`}
                >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-[var(--special-purple)]' : ''}`} />
                </button>
            </div>
            {selectedPost && (
                <SelectedPosts post={selectedPost} onClose={() => setSelectedPost(null)} onDelete={onDelete} />
            )}
        </div>
    )
}
