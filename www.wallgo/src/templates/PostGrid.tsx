import { Album, FileText, Heart, MessageSquare, PaperBag } from 'lucide-react';
import React, { useState } from 'react'
import { SelectedPosts } from '../components/SelectedPosts';
import { EmptyContent } from '../components/EmptyContent';
import { PostCard } from '../pages/Post/PostCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from './Skeleton';
import { useFollow } from '../components/useFollow';
import FollowUserCard from '../components/FollowUserCard';

interface User {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
}
export interface Post {
    id: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    content: string;
    media_url: string;
    schedule_time: string,
    unlock_time: string;
    expires_at: string;
    likes_count: number;
    is_liked: boolean;
    comments_count: number;
    created_at: string;
    is_owner?: boolean;
    postable?: {
        id?: number;
        name?: string;
        logo_url?: string;
    };
    postable_type: string;
    is_saved: boolean;
    visibility:'private'|'public'
};

interface PostGridProps {
    posts: Post[];
    suggested_follow?: User[];
};

export const PostGrid: React.FC<PostGridProps> = ({ posts, suggested_follow }) => {
    if (posts?.length === 0) {
        return (
            <EmptyContent text='No posts found it - try again later !' icon={<Album />} />
        )
    }

    const isLoading = false;

    return (
        <div className="gap-1 md:gap-2">
            {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton type='post' key={i} />) : posts.length > 0 ? posts.map((post, index) => (
                <React.Fragment key={index}>
                    <PostCard key={post.id} post={post} />
                    {(index + 1) % 6 === 0 && suggested_follow && suggested_follow.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm my-2 lg:hidden">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                                Suggested for you
                            </h3>

                            <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar snap-x">
                                {suggested_follow.map((user, index: number) => (
                                    <FollowUserCard user={user} key={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </React.Fragment>

            )) : (
                <EmptyContent text='No photos yet ' icon={<PaperBag />} />
            )}
        </div>
    )
}
