import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';
import { Clock, Globe, Image, Lock, Send, Smile, Sparkles, Video, X } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface Post {
    content: string,
    post_type: 'regular' | 'time_capsule',
    schedule_time?: string,
    expires_at?: string,
    unlock_time?: string,
    capsule_status?: string,
    media_url?: string
}

interface CreatePostProps {
    postToEdit?: Post;
    id?: number;
}

const CreatePost: React.FC<CreatePostProps> = ({ postToEdit }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [privacy, setPrivacy] = useState<'regular' | 'time_capsule'>('regular');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth()!;
    const [post, setPost] = useState<Post>({
        content: '',
        post_type: privacy,
        schedule_time: '',
        expires_at: '',
        unlock_time: '',
        capsule_status: '',
        media_url: ''
    });
    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2500);
    };

    const emojis = ['😊', '🚀', '🔥', '👍', '❤️', '💡', '😎', '💻', '✨', '⭐', '🎉', '👏'];
    const api_url = 'https://api.wallgo.test';
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedImage(base64String);
                setPost(prev => ({ ...prev, media_url: base64String }));
                showNotify('Image attached successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchPostToEdit = async () => {
        try {
            if (id) {
                const res = await axios.get(`${api_url}/post/${id}`, { withCredentials: true, withXSRFToken: true });
                if (res.data.success) return res.data;
            } else {
                return null;
            }
        } catch (err: any) {
            console.log(err?.response?.data);
        }
    }

    const { data } = useQuery({
        queryKey: ['posts_edits'],
        queryFn: fetchPostToEdit,
        // staleTime: 1000 * 60 * 5,
        enabled: isEditMode,
        // refetchOnWindowFocus: false
    });

    // const postEdit = data?.post || {};

    useEffect(() => {
        if (data?.post) {
            setPost({
                content: data.post.content || '',
                post_type: data.post.post_type || 'regular',
                schedule_time: data.post.schedule_time || '',
                expires_at: data.post.expires_at || '',
                unlock_time: data.post.unlock_time || '',
                capsule_status: data.post.capsule_status || '',
                media_url: data.post.media_url || ''
            });
            setPrivacy(data.post.post_type || 'regular');
            if (data.post.media_url) {
                setSelectedImage(data.post.media_url);
            }
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPost(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const addEmoji = (emoji: string) => {
        setContent(prev => prev + emoji);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post.content.trim() && !selectedImage) {
            showNotify('Please add some text or an image to post');
            return;
        }
        try {
            const url = isEditMode ? `${api_url}/posts/${id}/update` : `${api_url}/posts/create`;
            const method = isEditMode ? 'put' : 'post';
            await axios[method](url, post, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success) {
                    toast.success(res.data.message || 'Post uploaded successfully');
                    setTimeout(() => {
                        navigate('/account/profile')
                    }, 1000);
                } else {
                    toast.error(res.data.message || 'Upload failed');
                    console.log(res.data.message);
                }
            })
        } catch (err: any) {
            console.error(err?.response?.data);
        }
        if (!content.trim() && !selectedImage) {
            showNotify('Please add some text or an image to post');
            return;
        }

        showNotify('Post created successfully! 🚀');
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    const [showCapsuleOptions, setShowCapsuleOptions] = useState(false);
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
                                src={user?.avatar_url || '/icons/avatar1.svg'}
                                alt="User Avatar"
                                className="w-11 h-11 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">{user?.username}</h4>
                                <div className="flex items-center space-x-1 mt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setPrivacy(privacy === 'regular' ? 'time_capsule' : 'regular')}
                                        className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                    >
                                        {privacy === 'regular' ? (
                                            <>
                                                <Globe className="w-3 h-3 text-blue-600" />
                                                <span>Regular</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3 text-gray-600" />
                                                <span>Time Capsule</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 pb-2">
                            <textarea
                                value={post?.content}
                                onChange={handleChange}
                                name='content'
                                placeholder={`What's on your mind, ${user?.name ?? ''}?`}
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

                        {
                            privacy === "time_capsule" && (
                                <button
                                    type="button"
                                    onClick={() => setShowCapsuleOptions(!showCapsuleOptions)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${showCapsuleOptions ? 'bg-purple-100 text-[var(--special-purple)]' : 'hover:bg-gray-100'}`}
                                >
                                    <Clock className="w-4 h-4" /> Time Capsule
                                </button>
                            )
                        }

                        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-end">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>Post</span>
                            </button>
                        </div>

                        {
                            privacy === "time_capsule" && showCapsuleOptions && (
                                <div className="mt-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Unlock Time</label>
                                            <input onChange={handleChange} value={post?.unlock_time} type="datetime-local" name="unlock_time" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Expires At</label>
                                            <input onChange={handleChange} value={post?.expires_at} type="datetime-local" name="expires_at" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white outline-none" />
                                        </div>
                                    </div>
                                </div>
                            )}
                    </form>
                </div>
            </div>

            <MobileCellNavbar />
        </>
    )
}

export default CreatePost