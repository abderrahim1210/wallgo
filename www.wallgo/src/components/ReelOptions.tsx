import { BookmarkPlus, Copy, Edit3, Eye, EyeOff, Flag, Heart, Trash2, MessageCircle } from 'lucide-react';
import React, { useState, type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast';
import { useModal } from '../hooks/ModalProvider';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useNavigate } from 'react-router-dom';
import { BiComment } from 'react-icons/bi';
import { useAuth } from '../hooks/AuthProvider';

interface ReelOptionsProps {
    reel_id: number;
    is_owner: boolean;
    is_saved: boolean;
    reel_views: number;
    likes_count: number;
    comments_count: number;
    setOpenReport: (isopen: boolean) => void;
    saved: boolean;
    setSaved: Dispatch<SetStateAction<boolean>>;
    handleSavePost: () => void;
    handleDeleteReel: () => void;
    reelable: {
        id: number;
        name: string;
        owner_id: number;
    }
}

export const ReelOptions: React.FC<ReelOptionsProps> = ({ reel_id, setOpenReport, saved, reel_views, likes_count, comments_count, setSaved, handleSavePost, is_owner, is_saved, handleDeleteReel, reelable }) => {
    const { closeModal } = useModal()!;
    const navigate = useNavigate();
    const { user } = useAuth()!;
    const isAuthorGroup = user?.id === reelable?.owner_id;
    return (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 w-full border border-gray-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 px-3 border-b border-gray-100">
                <h3 className="font-bold text-[20px] text-gray-900 tracking-wide">Reel Options</h3>
                <div className="flex items-center justify-between px-4 py-3 gap-5 border-b border-gray-100 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span>{reel_views || 0} Views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span>{likes_count || 0} Likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        <span>{comments_count || 0} Comments</span>
                    </div>
                </div>
            </div>

            <div className="py-2 space-y-1">
                {
                    is_owner && (
                        <button
                            onClick={() => {
                                navigate(`/reel/${reel_id}/edit`);
                                closeModal?.();
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[var(--special-purple)] transition-all cursor-pointer group"
                        >
                            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-purple-100 transition-colors">
                                <Edit3 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span>Edit Reel</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/reel/${reel_id}`);
                        toast.success('Link copied successfully!');
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[var(--special-purple)] transition-all cursor-pointer group"
                >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-purple-100 transition-colors">
                        <Copy className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Copy link</span>
                </button>

                <button
                    onClick={handleSavePost}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[var(--special-purple)] transition-all cursor-pointer group"
                >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-purple-100 transition-colors">
                        <BookmarkPlus className="w-4 h-4 text-amber-500" />
                    </div>
                    <span>{saved ? 'Unsaved' : 'Save'} Reel</span>
                </button>

                <button
                    onClick={() => {
                        toast.success("We'll show fewer reels like this");
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer group"
                >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-200 transition-colors">
                        <EyeOff className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>Not interested</span>
                </button>

                {
                    !is_owner && (
                        <button
                            onClick={() => {
                                closeModal?.();
                                setOpenReport(true);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer group"
                        >
                            <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                                <Flag className="w-4 h-4 text-red-500" />
                            </div>
                            <span>Report Reel</span>
                        </button>
                    )
                }

                {
                    (is_owner || isAuthorGroup) && (
                        <button
                            onClick={handleDeleteReel}
                            className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-purple-50 hover:text-[var(--special-purple)] transition-all cursor-pointer group"
                        >
                            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-purple-100 transition-colors">
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                            <span>Delete Reel</span>
                        </button>
                    )
                }
            </div>
        </div>
    )
}
