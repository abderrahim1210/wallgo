import { BookmarkPlus, Copy, Edit3, Eye, EyeOff, Flag, Heart, Trash2, MessageCircle } from 'lucide-react';
import React, { type Dispatch, type SetStateAction } from 'react'
import toast from 'react-hot-toast';
import { useModal } from '../hooks/ModalProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';
import { useTranslation } from 'react-i18next';

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

export const ReelOptions: React.FC<ReelOptionsProps> = ({ reel_id, setOpenReport, saved, reel_views, likes_count, comments_count, handleSavePost, is_owner, handleDeleteReel, reelable }) => {
    const { closeModal } = useModal()!;
    const navigate = useNavigate();
    const { user } = useAuth()!;
    const { t } = useTranslation();
    const isAuthorGroup = user?.id === reelable?.owner_id;
    return (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 w-full border border-gray-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 px-3 border-b border-gray-100">
                <h3 className="font-bold text-[20px] text-gray-900 tracking-wide">{t('reelOptions.title')}</h3>
                <div className="flex items-center justify-between px-4 py-3 gap-5 border-b border-gray-100 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span>{t('reelOptions.views', { count: reel_views || 0 })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span>{t('reelOptions.likes', { count: likes_count || 0 })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-gray-500" />
                        <span>{t('reelOptions.comments', { count: comments_count || 0 })}</span>
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
                            <span>{t('reelOptions.edit')}</span>
                        </button>
                    )
                }
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/reel/${reel_id}`);
                        toast.success(t('feed.linkCopied'));
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[var(--special-purple)] transition-all cursor-pointer group"
                >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-purple-100 transition-colors">
                        <Copy className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>{t('feed.copyLink')}</span>
                </button>

                <button
                    onClick={handleSavePost}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[var(--special-purple)] transition-all cursor-pointer group"
                >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-purple-100 transition-colors">
                        <BookmarkPlus className="w-4 h-4 text-amber-500" />
                    </div>
                    <span>{saved ? t('reelOptions.removeSaved') : t('reelOptions.save')} {t('common.reels')}</span>
                </button>

                <button
                    onClick={() => {
                        toast.success(t('reelOptions.lessLikeThis'));
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer group"
                >
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gray-200 transition-colors">
                        <EyeOff className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>{t('reelOptions.notInterested')}</span>
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
                            <span>{t('reelOptions.report')}</span>
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
                            <span>{t('reelOptions.delete')}</span>
                        </button>
                    )
                }
            </div>
        </div>
    )
}
