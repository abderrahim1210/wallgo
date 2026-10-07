import React, { useState } from 'react'
import { MainLayout } from '../MainLayout'
import { PostGrid } from '../templates/PostGrid';
import { Helmet } from 'react-helmet-async';
import { FaBookmark } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

export const MyPosts = () => {
    const posts = [
        {
            id: 1,
            author: {
                name: 'Abderrahim Khali Ali',
                username: 'abderrahim',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            timestamp: '2h ago',
            likesCount: 24,
            commentsCount: 5,
        },
        {
            id: 1,
            author: {
                name: 'Abderrahim Khali Ali',
                username: 'abderrahim',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            timestamp: '2h ago',
            likesCount: 24,
            commentsCount: 5,
        },
        {
            id: 1,
            author: {
                name: 'Abderrahim Khali Ali',
                username: 'abderrahim',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            timestamp: '2h ago',
            likesCount: 24,
            commentsCount: 5,
        },
        {
            id: 1,
            author: {
                name: 'Abderrahim Khali Ali',
                username: 'abderrahim',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            timestamp: '2h ago',
            likesCount: 24,
            commentsCount: 5,
        },
        {
            id: 1,
            author: {
                name: 'Abderrahim Khali Ali',
                username: 'abderrahim',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            timestamp: '2h ago',
            likesCount: 24,
            commentsCount: 5,
        },
        {
            id: 2,
            author: {
                name: 'Sara Miller',
                username: 'saramiller',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
            },
            content: 'Beautiful sunset captured during my evening walk. Photography is pure therapy! 📸✨',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            timestamp: '5h ago',
            likesCount: 142,
            commentsCount: 18,
        },
    ];

    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : My Posts</title>
            </Helmet>
            <div className='px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaPencil className='w-8 h-8 text-[var(--special-purple)]' /> My Posts <span className='text-[var(--special-purple)]'>({posts.length})</span></h1>
                    
                </div>
                <div className='mt-3'>
                    <PostGrid posts={posts} />
                </div>
            </div>
        </MainLayout>
    )
}
