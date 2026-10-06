import React, { useState } from 'react'
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';
import { Bookmark, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../MainLayout';

const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
            title: 'Nature Landscape View',
            author: 'Sara Miller',
            likes: 142,
            comments: 24,
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
            title: 'Adventure in the Mountains',
            author: 'Abderrahim Khali Ali',
            likes: 89,
            comments: 12,
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
            title: 'Green Forest Morning',
            author: 'John Doe',
            likes: 230,
            comments: 45,
        },
    ]);

    const [notification, setNotification] = useState<string | null>(null);
    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2500);
    };
    const handleRemoveSaved = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSavedPosts(savedPosts.filter(post => post.id !== id));
        showNotify('Removed from saved posts');
    };
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Saved Posts</title>
            </Helmet>
            
            
            <div className="min-h-[calc(100vh-95px)] bg-gray-50 flex justify-center p-4 pb-24 md:pb-8 relative">
                {notification && (
                    <div className="absolute top-6 z-50 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg transition-all animate-bounce">
                        {notification}
                    </div>
                )}

                <div className="w-full max-w-4xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <Bookmark className="w-6 h-6 text-blue-600 fill-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">Saved Posts</h1>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full font-medium">
                            {savedPosts.length} saved items
                        </span>
                    </div>

                    {savedPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
                            <Bookmark className="w-12 h-12 text-gray-300 mb-2" />
                            <h3 className="text-sm font-semibold text-gray-700">No saved posts yet</h3>
                            <p className="text-xs text-gray-400 mt-1">Posts you save will appear here for easy access later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {savedPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group cursor-pointer relative"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <button
                                            onClick={(e) => handleRemoveSaved(post.id, e)}
                                            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-red-600 hover:text-white text-gray-700 rounded-full backdrop-blur-sm transition-colors shadow-sm cursor-pointer"
                                            title="Remove from saved"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-3.5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900 truncate">{post.title}</h4>
                                            <p className="text-[11px] text-gray-500 mt-0.5">By {post.author}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            
        </MainLayout>
    )
}

export default SavedPosts