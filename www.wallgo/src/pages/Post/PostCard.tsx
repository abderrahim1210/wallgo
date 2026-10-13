import { Bookmark, Edit3, Flag, Heart, Link, MessageCircle, MoreHorizontal, Share2, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { DropdownMenu, type DropdownItem } from '../../templates/DropdownMenu';
import { Toast, type ToastType } from '../../components/Toast';
import { useModal } from '../../hooks/ModalProvider';
import ModalTemplate from '../../templates/ModalTemplate';
import { CommentSection } from '../../components/CommentSection';
import ShareDropdown from '../../components/ShareDropdown';
import moment from 'moment';
import { useAuth } from '../../hooks/AuthProvider';

interface PostCardProps {
    id: number,
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    content: string,
    media_url: string,
    created_at: string,
    likes_count: number,
    comments_count: number
}
export const PostCard: React.FC<PostCardProps> = ({
    user,
    content,
    media_url,
    created_at,
    likes_count,
    comments_count
}) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(likes_count);
    const [saved, setSaved] = useState(false);
    const { show, openModal, closeModal } = useModal()!;
    const { user: currentUser } = useAuth()!;
    const handleLike = () => {
        if (liked) {
            setLikes(likes - 1);
            setLiked(false);
        } else {
            setLikes(likes + 1);
            setLiked(true);
        }
    }

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const triggerToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const isOwner = currentUser?.id === user?.id;

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
                onClick: () => console.log('Edit clicked'),
            },
            {
                label: 'Delete Post',
                icon: <Trash2 className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => console.log('Delete clicked'),
            },
        ] : []),
        ...(!isOwner ? [
            {
                label: 'Report Post',
                icon: <Flag className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => console.log('Report clicked'),
            },
        ] : [])
    ];
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center space-x-3">
                    <img
                        src={user.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-purple-100"
                    />
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900 leading-tight">{user.name}</h4>
                        <span className="text-xs text-gray-500">@{user.username} • {moment(created_at).fromNow()}</span>
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
                {content}
            </div>

            {media_url && (
                <div className="w-full bg-gray-50 max-h-[500px] overflow-hidden flex items-center justify-center">
                    <img src={media_url} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
            )}

            {
                show === 'comments' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <CommentSection postId={1} />
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

            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 mt-1">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group cursor-pointer"
                    >
                        <Heart
                            className={`w-6 h-6 transition-transform active:scale-125 ${liked ? 'text-red-500 fill-red-500' : 'group-hover:scale-110'
                                }`}
                        />
                        <span className="text-xs font-semibold text-gray-700">{likes}</span>
                    </button>

                    <button onClick={() => openModal('comments')} className="flex items-center space-x-2 text-gray-600 hover:text-[var(--special-purple)] transition-colors group cursor-pointer">
                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-gray-700">{comments_count}</span>
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
        </div>
    )
}
