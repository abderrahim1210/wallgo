import React, { useEffect, useRef, useState } from 'react'
import type { Reel } from './CreateReel';
import { Bookmark, Eye, Heart, MessageCircle, MoreVertical, Music, Pause, Send, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFollow } from './useFollow';
import { useAuth } from '../hooks/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import { CommentSection } from './CommentSection';
import { Report } from './Report';
import ShareDropdown from './ShareDropdown';
import { ReelOptions } from './ReelOptions';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

interface ReelCardProps {
    reel: Reel;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
    const { t } = useTranslation();
    const [isMuted, setIsMuted] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState<number | null>(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = videoRef.current;
                    const audio = audioRef.current;
                    if (!video) return;

                    if (entry.isIntersecting) {
                        setPlayingVideoId(reel.id);
                        setIsPlaying(true);
                        video.play().catch(() => { });
                        if (audio) {
                            audio.currentTime = 0;
                            audio.play().catch(() => { });
                        }
                    } else {
                        video.pause();
                        if (audio) audio.pause();
                        setIsPlaying(false);
                    }
                });
            },
            { root: null, rootMargin: '0px', threshold: 0.6 }
        );

        const container = videoRef.current?.closest('.reel-container') || videoRef.current?.parentElement;
        if (container) observer.observe(container);

        return () => observer.disconnect();
    }, [reel.id]);

    const togglePlayPause = () => {
        const video = videoRef.current;
        const audio = audioRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            audio?.pause();
            setIsPlaying(false);
        } else {
            video.play();
            audio?.play().catch(() => { });
            setIsPlaying(true);
        }
    };
    const navigate = useNavigate();
    const [followed, setFollowed] = useState(reel?.is_followed);
    const { add_follow } = useFollow();
    const handleFollow = () => {
        setFollowed(prev => !prev);
        add_follow(reel?.user?.id);
    }
    const [liked, setLiked] = useState(reel?.is_liked);
    const queryClient = useQueryClient();
    const handleLike = async () => {
        try {
            const res = await axios.post(`${api_url}/add_like`, { type: 'reel', reel_id: reel?.id, owner_id: reel?.user.id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLiked(prev => !prev);
                queryClient.invalidateQueries({ queryKey: ['reels'] });
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { show, openModal, closeModal } = useModal()!;
    const [openReport, setOpenReport] = useState(false);
    const [openReportReel, setOpenReportReel] = useState(false);
    const [commentId, setCommentId] = useState<number | null>(null);
    const [saved, setSaved] = useState<boolean>(Boolean(reel?.is_saved));
    const handleSavePost = async () => {
        if (!reel?.id) return null;
        setSaved(prev => !prev);
        try {
            await axios.post(`${api_url}/post/save`, { reel_id: reel.id, type: 'reel' }, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success) {
                    toast.success(saved ? t('reelCard.removedFromSaved') : t('reelCard.saved'));
                }
            });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { user } = useAuth()!;
    const isAuthorGroup = user?.id === reel?.reelable?.owner_id;

    const handleDelete = async () => {
        if (!reel?.id) return null;
        Swal.fire({
            title: t('reelCard.deleteTitle'),
            text: t('reelCard.deleteConfirmation'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('reelCard.confirmDelete'),
            confirmButtonColor: '#7371FC',
            cancelButtonText: t('feed.cancel')
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const url = isAuthorGroup ? `${api_url}/groups/delete_reel/${reel?.reelable.id}/${reel?.id}` : `${api_url}/reels/${reel?.id}`;
                    const res = await axios.delete(url, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success(t('reelCard.deleted'));
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        toast.error(t('reelCard.deleteFailed'));
                        console.log(res.data.message);
                    }
                } catch (err: any) {
                    console.error(err?.response.data);
                }
            }
        })
    }

    const handleVideoPlay = async () => {
        try {
            await axios.post(`${api_url}/reels/${reel?.id}/view`, {}, { withCredentials: true, withXSRFToken: true });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return (
        <div
            key={reel.id}
            data-reel-id={reel.id}
            className="relative w-full max-w-sm h-full snap-start snap-always bg-black rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end shrink-0 border-0 md:border border-gray-800"
        >
            <video
                ref={videoRef}
                src={reel.video_url}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                loop
                muted={isMuted}
                onPlay={handleVideoPlay}
                playsInline
                onClick={togglePlayPause}
                onTimeUpdate={() => {
                    if (videoRef.current && audioRef.current) {
                        if (videoRef.current.currentTime < 0.3 && audioRef.current.currentTime > 1) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play().catch(() => { });
                        }
                    }
                }}

            />
            {!isPlaying && playingVideoId === reel.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
                    <div className="p-4 bg-black/60 backdrop-blur-md rounded-full text-white animate-pulse">
                        <Pause className="w-10 h-10" />
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

            <button
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? t('reelCard.unmute') : t('reelCard.mute')}
                title={isMuted ? t('reelCard.unmute') : t('reelCard.mute')}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors cursor-pointer"
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="absolute right-4 bottom-20 z-30 flex flex-col items-center space-y-5 text-white">
                <button aria-label={t('feed.like')} className="flex flex-col items-center space-y-1 group cursor-pointer" onClick={handleLike}>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-colors">
                        <Heart className={`w-6 h-6 ${liked ? 'text-red-500 fill-red-500' : 'text-white'} hover:text-red-500 transition-colors`} />
                    </div>
                    <span className="text-xs font-semibold">{reel.likes_count}</span>
                </button>

                <button aria-label={t('feed.comments', { count: reel.comments_count })} className="flex flex-col items-center space-y-1 group cursor-pointer" onClick={() => openModal(`comments-reel-${reel?.id}`)}>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-colors">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold">{reel.comments_count}</span>
                </button>

                <button aria-label={t('feed.share')} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors cursor-pointer" onClick={() => openModal(`share-${reel?.id}`)}>
                    <Send className="w-6 h-6 text-white" />
                </button>
                <button aria-label={saved ? t('reelCard.removeSaved') : t('reelCard.save')} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors cursor-pointer" onClick={handleSavePost}>
                    <Bookmark className={`w-6 h-6 text-white ${saved ? 'fill-white' : ''}`} />
                </button>

                <button aria-label={t('reelCard.options')} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors cursor-pointer" onClick={() => openModal(`options-reel-${reel?.id}`)}>
                    <MoreVertical className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="relative z-20 p-4 text-white space-y-2.5 pb-6">
                <div className="flex items-center space-x-3">
                    <img src={reel?.reelable?.logo_url || reel?.user?.avatar_url} alt={t('feed.userAvatar')} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                    <div>
                        <h4 className="font-semibold text-sm cursor-pointer hover:underline w-[150px]" onClick={() => navigate(`${reel?.is_owner ? '/account/profile' : `/profile/${reel.user.id}/${reel.user.username}`}`)}>{reel?.reelable?.name ? t('feed.postedInGroup', { username: reel?.user?.name, group: reel?.reelable?.name }) : reel.user.name}</h4>
                        <p className="text-xs text-gray-300">@{reel.user.username}</p>
                    </div>
                    {
                        !reel.is_owner && (
                            <button className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-xs font-semibold rounded-full transition-colors cursor-pointer" onClick={handleFollow}>
                                {followed ? t('profile.followed') : t('profile.follow')}
                            </button>
                        )
                    }
                </div>

                <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                    {reel.caption}
                </p>

                {reel.audio_url && (
                    <audio
                        ref={audioRef}
                        src={reel.audio_url}
                        muted={isMuted}
                        preload="auto"
                    />
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <Music className="w-3.5 h-3.5 animate-spin" />
                    <span className="truncate">{reel.audio_name}</span>
                </div>
            </div>

            {
                show === `comments-reel-${reel?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <CommentSection postId={reel?.id} type='reel' setOpenModal={setOpenReport} setCommentId={setCommentId} />
                    </ModalTemplate>
                )
            }

            {
                (openReport && commentId) && (
                    <ModalTemplate show={openReport} closeModal={() => setOpenReport(false)}>
                        <Report id={commentId} type='comment' onClose={() => setOpenReport(false)} />
                    </ModalTemplate>
                )
            }

            {
                show === `share-${reel?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ShareDropdown url={`https://www.wallgo.test/reel/${reel.id}`} />
                    </ModalTemplate>
                )
            }

            {
                show === `options-reel-${reel?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ReelOptions setOpenReport={setOpenReportReel} reel_id={reel?.id} is_owner={reel?.is_owner} is_saved={reel?.is_saved} setSaved={setSaved} saved={saved} handleSavePost={handleSavePost} handleDeleteReel={handleDelete} reel_views={reel?.views_count} likes_count={reel?.likes_count} comments_count={reel?.comments_count} reelable={reel?.reelable} />
                    </ModalTemplate>
                )
            }

            {
                openReportReel && (
                    <ModalTemplate show={openReportReel} closeModal={() => setOpenReportReel(false)}>
                        <Report id={reel?.id} type='reel' onClose={() => setOpenReportReel(false)} />
                    </ModalTemplate>
                )
            }

        </div>
    )
}
