import { Album, FileText, Heart, MessageSquare } from 'lucide-react';
import React, { useState } from 'react'
import { SelectedPosts } from '../components/SelectedPosts';
import { EmptyContent } from '../components/EmptyContent';
import { PostCard } from '../pages/Post/PostCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface Post {
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
    comments_count: number;
    created_at: string;
};

interface PostGridProps {
    posts: Post[];
    // onPostClick: (post: Post) => void;
};

export const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
    if (posts?.length === 0) {
        return (
            <EmptyContent text='No posts found it - try again later !' icon={<Album />} />
        )
    }

    const api_url = 'https://api.wallgo.test';
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const navigate = useNavigate();
    return (
        <div className="gap-1 md:gap-2">
            {posts?.map((post) => (
                post.media_url ? (
                    <section className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5'>
                        <div
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="relative group aspect-square bg-gray-900 rounded overflow-hidden cursor-pointer"
                        >
                            <img
                                src={post.media_url}
                                alt="Post media"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-6 text-white font-semibold">
                                <div className="flex items-center gap-1.5">
                                    <Heart size={20} className="fill-white" />
                                    <span>{post.likes_count}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageSquare size={20} className="fill-white" />
                                    <span>{post.comments_count}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section>
                        <PostCard key={post.id} {...post} />
                    </section>
                )
            ))}
            {selectedPost && (
                <SelectedPosts post={selectedPost} onClose={() => setSelectedPost(null)} />
            )}
        </div>
    )
}
