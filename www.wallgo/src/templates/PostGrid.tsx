import { Album, FileText, Heart, MessageSquare } from 'lucide-react';
import React, { useState } from 'react'
import { SelectedPosts } from '../components/SelectedPosts';
import { EmptyContent } from '../components/EmptyContent';
import { PostCard } from '../pages/Post/PostCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

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
    comments_count: number;
    created_at: string;
};

interface PostGridProps {
    posts: Post[];
};

export const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
    if (posts?.length === 0) {
        return (
            <EmptyContent text='No posts found it - try again later !' icon={<Album />} />
        )
    }

    const api_url = 'https://api.wallgo.test';
    const navigate = useNavigate();
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

            {posts?.map((post) => (
                <PostCard key={post.id} post={post} onDelete={deletePost} />
            ))}

        </div>
    )
}
