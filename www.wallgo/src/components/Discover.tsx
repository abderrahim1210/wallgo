import React, { useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Heart, MessageCircle, Search, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PostGrid } from '../templates/PostGrid';
import { FaBookmark, FaCompass } from 'react-icons/fa';

export const Discover = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const explorePosts = [
        {
            id: 1,
            content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
            likesCount: 1000,
            commentsCount: 43,
            // author: { name: 'Abderrahim Khali Ali', username: 'abderrahim', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
        },
        {
            id: 2,
            content: 'Beautiful sunset captured during my evening walk. Photography is pure therapy! 📸✨',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            likesCount: 154,
            commentsCount: 35,
            // author: { name: 'Sara Miller', username: 'saramiller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
        },
        {
            id: 3,
            content: 'Clean code and dark mode. The ultimate developer setup.',
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
            likesCount: 850,
            commentsCount: 23,
            // author: { name: 'Tech Insider', username: 'techinsider', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80' },
        },
        {
            id: 4,
            content: 'Building fullstack apps with Laravel and React is such a smooth experience.',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
            likesCount: 200,
            commentsCount: 64,
            // author: { name: 'Code Master', username: 'coder', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
        },
        {
            id: 5,
            content: 'Late night gaming session setup. RGB lights everywhere!',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
            likesCount: 940,
            commentsCount: 31,
            // author: { name: 'Game Zone', username: 'gamerz', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=100&q=80' },
        },
        {
            id: 6,
            content: 'Lost in the mountains. Fresh air and wonderful landscapes.',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
            likesCount: 500,
            commentsCount: 210,
            // author: { name: 'Nature Lover', username: 'nature', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
        }
    ];

    const posts = explorePosts.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
        // ||
        // post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Discover</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-10">
                <div className="max-w-7xl mx-auto pt-6 px-4">
                    <div className='flex justify-start items-center mb-3'>
                        <h1 className='font-bold text-3xl flex items-center gap-2'><FaCompass className='w-8 h-8 text-[var(--special-purple)]' /> Discover <span className='text-[var(--special-purple)]'>({posts.length})</span></h1>
                    </div>
                    <div className="relative mb-6">

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts, tags, or creators..."
                            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--special-purple)] transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-gray-400 hover:text-gray-600"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <PostGrid posts={posts} />

                </div>
            </div>

            {selectedPost && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-150">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image side */}
                        <div className="md:w-1/2 bg-black flex items-center justify-center">
                            <img src={selectedPost.image} alt="Detail" className="max-h-[400px] w-full object-contain" />
                        </div>

                        {/* Info side */}
                        <div className="md:w-1/2 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                                    <img src={selectedPost.author.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900">{selectedPost.author.name}</h4>
                                        <p className="text-xs text-gray-500">@{selectedPost.author.username}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed mb-4">{selectedPost.content}</p>
                            </div>

                            <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                                <span className="flex items-center space-x-1 text-red-500">❤️ {selectedPost.likes} Likes</span>
                                <span className="flex items-center space-x-1 text-purple-500">💬 {selectedPost.comments} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
