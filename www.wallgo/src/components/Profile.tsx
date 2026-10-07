import React from 'react'
import { MainLayout } from '../MainLayout'
import { FaCalendarAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone, FaUserEdit, FaVenusMars } from 'react-icons/fa'
import { PostGrid } from '../templates/PostGrid'
import { Helmet } from 'react-helmet-async'

export const Profile = () => {
    const profile = {
        id: 1,
        name: 'Abderrahim',
        username: 'abdou_12',
        email: 'abderrahim12@gmail.com',
        bio: 'Anything',
        avatar_url: 'https://images.pexels.com/photos/15482284/pexels-photo-15482284.jpeg',
        banner_url: 'https://images.pexels.com/photos/33210184/pexels-photo-33210184.jpeg',
        phone: '0654341243',
        type: 'public',
        birth: '2006-04-12',
        gender: 'male',
        location: 'Bouskoura'
    }

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
            id: 2,
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
            id: 3,
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
            id: 4,
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
            id: 5,
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
            id: 6,
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
                <title>WallGo : Profile</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 py-8 pb-20">

                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">

                    <div className="h-48 md:h-64 w-full relative bg-gray-200">
                        <img
                            src={profile.banner_url}
                            alt="Profile Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col sm:flex-row justify-between shrink-0 items-start md:items-end -mt-16 md:-mt-20 mb-4 gap-4">
                            <div className="flex items-end gap-4">
                                <img
                                    src={profile.avatar_url}
                                    alt="Avatar"
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
                                />
                                <div className="md:mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        {profile.name}
                                    </h1>
                                    <p className="text-sm font-medium text-gray-500">@{profile.username}</p>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer shrink-0">
                                <FaUserEdit className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>

                        <p className="text-gray-600 text-sm max-w-2xl mb-6">
                            {profile.bio}
                        </p>

                        <div className="flex items-center gap-6 py-4 border-y border-gray-100 mb-6 text-sm">
                            <div>
                                <span className="font-bold text-gray-900 text-base">45</span> <span className="text-gray-500">Posts</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 text-base">342</span> <span className="text-gray-500">Followers</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 text-base">180</span> <span className="text-gray-500">Following</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FaEnvelope className="text-[var(--special-purple)] w-4 h-4" />
                                <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FaPhone className="text-[var(--special-purple)] w-4 h-4" />
                                <span>{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FaCalendarAlt className="text-[var(--special-purple)] w-4 h-4" />
                                <span>Born on {profile.birth}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FaVenusMars className="text-[var(--special-purple)] w-4 h-4" />
                                <span className="capitalize">{profile.gender}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FaGlobe className="text-[var(--special-purple)] w-4 h-4" />
                                <span className="capitalize">Account: {profile.type}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <FaMapMarkerAlt className="text-[var(--special-purple)] w-4 h-4" />
                                <span>{profile.location}</span>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <PostGrid posts={posts} />
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    )
}
