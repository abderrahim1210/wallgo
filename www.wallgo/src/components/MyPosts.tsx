import React, { useState } from 'react'
import { MainLayout } from '../MainLayout'
import { PostGrid } from '../templates/PostGrid';
import { Helmet } from 'react-helmet-async';
import { FaBookmark } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';

export const MyPosts = () => {
    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${api_url}/my_posts`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.posts;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: posts = [] } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts
    });

    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : My Posts</title>
            </Helmet>
            <div className='px-4 py-6 max-w-4xl mx-auto'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2 mb-3'><FaPencil className='w-8 h-8 text-[var(--special-purple)]' /> My Posts <span className='text-[var(--special-purple)]'>({posts.length})</span></h1>
                </div>
                <PostGrid posts={posts} />
            </div>
        </MainLayout>
    )
}
