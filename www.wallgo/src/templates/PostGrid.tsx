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
    const api_url = 'https://api.wallgo.test';
    const navigate = useNavigate();
    const [follow, setFollow] = useState<boolean>(false);
    const { add_follow } = useFollow();

    const addFollow = (user_id: number) => {
        add_follow(user_id);
        setFollow(prev => !prev);
    }

    const deletePost = async (id: number) => {
        if (!id) return toast.error('Post ID not found');
        try {
            Swal.fire({
                icon: "question",
                title: "Delete post",
                text: "Are you sure to delete this post ?",
                confirmButtonColor: "#DB5461",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                showConfirmButton: true,
                showCancelButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await axios.delete(`${api_url}/posts/${id}`, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success('Post deleted !');
                        setTimeout(() => {
                            navigate('/account/profile');
                        }, 1000);
                    } else {
                        toast.error('Failed to delete post');
                        console.log(res.data.message);
                    }
                }
            })
        } catch (err: any) {
            console.log(err?.response?.data);
        }
    }

    return (
        <div className="gap-1 md:gap-2">
            {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} />) : posts.length > 0 ? posts.map((post, index) => (
                <React.Fragment key={index}>
                    <PostCard key={post.id} post={post} onDelete={deletePost} />
                    {(index + 1) % 6 === 0 && suggested_follow && suggested_follow.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm my-2 lg:hidden">
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                                Suggested for you
                            </h3>

                            <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar snap-x">
                                {suggested_follow.map((user) => (
                                    <div
                                        key={user.id}
                                        className="min-w-[150px] sm:min-w-[170px] md:max-w-[160px] bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col items-center text-center snap-start shrink-0"
                                    >
                                        <img
                                            src={user.avatar_url || 'https://via.placeholder.com/150'}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover mb-2 border border-white shadow-sm"
                                        />
                                        <h4 className="text-xs font-bold text-gray-800 truncate w-full">{user.name}</h4>
                                        <span className="text-[10px] text-gray-400 truncate w-full mb-3">@{user.username}</span>

                                        <button
                                            onClick={() => addFollow(user?.id)}
                                            className={`w-full py-1.5 ${follow ? 'bg-[var(--special-white)] border border-[var(--special-gray)] text-[var(--special-gray)]' : 'bg-[var(--special-purple)] text-white'} text-[11px] font-semibold rounded-lg shadow-sm transition`}
                                        >
                                            Follow
                                        </button>
                                    </div>
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
