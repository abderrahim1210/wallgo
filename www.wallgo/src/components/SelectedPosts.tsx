import { Edit3, Flag, Heart, Link, MessageCircle, MoreHorizontal, Trash2, X } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react'
import { useAuth } from '../hooks/AuthProvider';
import { DropdownMenu, type DropdownItem } from '../templates/DropdownMenu';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Post {
    id: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string
    };
    content: string;
    media_url: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
}

interface SelectedPostsProps {
    post: Post;
    onClose: () => void;
    onDelete:(id:number) => void;
};

export const SelectedPosts: React.FC<SelectedPostsProps> = ({ post, onClose ,onDelete}) => {
    const navigate = useNavigate();
    const { user } = useAuth()!;
    const isOwner = user?.id === post?.user.id;
    const postMenuItems: DropdownItem[] = [
        {
            label: 'Copy link',
            icon: <Link className="w-4 h-4 text-blue-500" />,
            onClick: () => toast.success('Link copied !'),
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
                onClick: () => console.log('Report clicked'),
            },
        ] : [])
    ];
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-150">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="absolute top-3 right-12 z-20">
                    <DropdownMenu
                        trigger={
                            <button className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer flex items-center justify-center">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        }
                        items={postMenuItems}
                    />
                </div>
                <div className="md:w-1/2 bg-black flex items-center justify-center rounded-2xl">
                    <img src={post?.media_url} alt="Detail" className="max-h-[400px] rounded-2xl w-full object-contain" />
                </div>

                <div className="md:w-1/2 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 pr-8">
                            <div className='flex items-center space-x-3'>
                                <img src={post?.user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900">{post?.user.name}</h4>
                                    <p className="text-xs text-gray-500">@{post?.user.username}</p>
                                    <p className="text-xs text-gray-500">{moment(post?.created_at).fromNow()}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-800 leading-relaxed mb-4">{post?.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1 text-red-500"><Heart className='w-4 h-4' /> {post?.likes_count} Likes</span>
                        <span className="flex items-center gap-1 text-purple-500"><MessageCircle className='w-4 h-4' /> {post?.comments_count} Comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
