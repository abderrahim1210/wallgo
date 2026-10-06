import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';
import { Globe, Image, Lock, Send, Smile, Sparkles, Video, X } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { Helmet } from 'react-helmet-async';

const CreatePost = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2500);
    };

    const emojis = ['😊', '🚀', '🔥', '👍', '❤️', '💡', '😎', '💻', '✨', '⭐', '🎉', '👏'];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            showNotify('Image attached successfully');
        }
    };

    const addEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !selectedImage) {
            showNotify('Please add some text or an image to post');
            return;
        }

        showNotify('Post created successfully! 🚀');
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };
    return (
        <>
            <Helmet>
                <title>WallGo : Create Post</title>
            </Helmet>
            <Navbar />

            <div className="min-h-[calc(100vh-95px)] bg-gray-50 flex justify-center items-start p-4 pb-24 md:pb-8 relative">
                {notification && (
                    <div className="absolute top-6 z-50 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg transition-all animate-bounce">
                        {notification}
                    </div>
                )}

                <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-4">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-gray-900 font-bold text-base flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <span>Create New Post</span>
                        </h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-4 flex items-center space-x-3">
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                                alt="User Avatar"
                                className="w-11 h-11 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">Abderrahim Khali Ali</h4>
                                <div className="flex items-center space-x-1 mt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setPrivacy(privacy === 'public' ? 'private' : 'public')}
                                        className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                    >
                                        {privacy === 'public' ? (
                                            <>
                                                <Globe className="w-3 h-3 text-blue-600" />
                                                <span>Public</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-3 h-3 text-gray-600" />
                                                <span>Only me</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 pb-2">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind, Abderrahim?"
                                rows={4}
                                className="w-full text-gray-900 text-xs md:text-sm placeholder-gray-400 focus:outline-none resize-none"
                            ></textarea>
                        </div>

                        {selectedImage && (
                            <div className="px-4 pb-3 relative">
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-h-72 flex justify-center">
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover max-h-72" />
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-2 right-2 p-1.5 bg-gray-900/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                                        title="Remove image"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="relative px-4">
                            {showEmojiPicker && (
                                <div className="absolute bottom-2 left-4 bg-white border border-gray-200 p-2.5 rounded-xl shadow-lg grid grid-cols-6 gap-2 z-20">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => addEmoji(emoji)}
                                            className="text-lg hover:scale-125 transition-transform cursor-pointer"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 mx-4 mb-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500 pl-1">Add to your post</span>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="Photo/Video"
                                >
                                    <Image className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => showNotify('Video upload feature coming soon!')}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                    title="Video"
                                >
                                    <Video className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                    title="Feeling/Activity"
                                >
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-end">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>Post</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <MobileCellNavbar />
        </>
    )
}

export default CreatePost