import { Heart, MessageCircle, X } from 'lucide-react';
import moment from 'moment';
import React, { useState } from 'react'

interface Post {
    id: number;
    user: {
        name: string;
        username: string;
        avatar_url: string
    };
    content: string;
    media_url: string;
    likes_count: number;
    comments_count: number;
    created_at:string;
}

interface SelectedPostsProps {
    post: Post;
    onClose: () => void;
};

export const SelectedPosts: React.FC<SelectedPostsProps> = ({ post, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-150">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="md:w-1/2 bg-black flex items-center justify-center">
                    <img src={post?.media_url} alt="Detail" className="max-h-[400px] w-full object-contain" />
                </div>

                <div className="md:w-1/2 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                            <img src={post?.user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900">{post?.user.name}</h4>
                                <p className="text-xs text-gray-500">@{post?.user.username}</p>
                                <p className="text-xs text-gray-500">{moment(post?.created_at).fromNow()}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed mb-4">{post?.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                        <span className="flex items-center space-x-1 text-red-500"><Heart className='w-4 h-4' /> {post?.likes_count} Likes</span>
                        <span className="flex items-center space-x-1 text-purple-500"><MessageCircle className='w-4 h-4' /> {post?.comments_count} Comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
