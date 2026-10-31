import React, { useEffect, useRef, useState } from 'react'
import type { Reel } from './CreateReel';
import { Heart, MessageCircle, MoreVertical, Music, Pause, Send, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReelCardProps {
    reel: Reel;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState<number | null>(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // useEffect(() => {
    //     const observerOptions = {
    //         root: null,
    //         rootMargin: '0px',
    //         threshold: 0.6,
    //     };

    //     const handleIntersect: IntersectionObserverCallback = (entries) => {
    //         entries.forEach((entry) => {
    //             if (entry.isIntersecting) {
    //                 setPlayingVideoId(reel.id);
    //                 setIsPlaying(true);

    //                 if (videoRef.current) {
    //                     videoRef.current.play().catch(() => { });
    //                 }
    //                 if (audioRef.current) {
    //                     audioRef.current.play().catch(() => { });
    //                 }
    //             } else {
    //                 if (videoRef.current) {
    //                     videoRef.current.pause();
    //                 }
    //                 if (audioRef.current) {
    //                     audioRef.current.pause();
    //                 }
    //             }
    //         });
    //     };

    //     const observer = new IntersectionObserver(handleIntersect, observerOptions);
    //     const container = videoRef.current?.closest('.reel-container') || videoRef.current?.parentElement;

    //     if (container) {
    //         observer.observe(container);
    //     }

    //     return () => observer.disconnect();
    // }, [reel.id]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = videoRef.current;
                    if (!video) return;

                    if (entry.isIntersecting) {
                        setPlayingVideoId(reel.id);
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            { root: null, rootMargin: '0px', threshold: 0.6 }
        );

        const container =
            videoRef.current?.closest('.reel-container') || videoRef.current?.parentElement;
        if (container) observer.observe(container);

        return () => observer.disconnect();
    }, [reel.id]);

    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;
        if (!video || !audio) return;

        const onPlay = () => {
            audio.currentTime = video.currentTime;
            audio.play().catch(() => { });
            setIsPlaying(true);
        };
        const onPause = () => {
            audio.pause();
            setIsPlaying(false);
        };
        const onSeeked = () => {
            audio.currentTime = video.currentTime;
        };
        const onTimeUpdate = () => {
            // Ila video 3awd mn l'bdaya (loop) wla f drift kbir, 3awd sync
            if (Math.abs(audio.currentTime - video.currentTime) > 0.3) {
                audio.currentTime = video.currentTime;
            }
        };
        const onWaiting = () => audio.pause();
        const onPlaying = () => {
            if (!video.paused) audio.play().catch(() => { });
        };

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('seeked', onSeeked);
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('playing', onPlaying);

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('playing', onPlaying);
        };
    }, [reel.audio_url])


    const togglePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            audioRef.current?.play().catch(() => { });
            setIsPlaying(true);
        }
    };
    const navigate = useNavigate();
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
                muted={isMuted || !!reel.audio_url}
                playsInline
                onClick={togglePlayPause}
                
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
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors cursor-pointer"
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center space-y-5 text-white">
                <button className="flex flex-col items-center space-y-1 group cursor-pointer">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-colors">
                        <Heart className="w-6 h-6 text-white hover:text-red-500 transition-colors" />
                    </div>
                    <span className="text-xs font-semibold">{reel.likes_count}</span>
                </button>

                <button className="flex flex-col items-center space-y-1 group cursor-pointer">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-colors">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold">{reel.comments_count}</span>
                </button>

                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                    <Send className="w-6 h-6 text-white" />
                </button>

                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors cursor-pointer">
                    <MoreVertical className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="relative z-20 p-4 text-white space-y-2.5 pb-6">
                <div className="flex items-center space-x-3">
                    <img src={reel.user.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-white/20" />
                    <div>
                        <h4 className="font-semibold text-sm cursor-pointer hover:underline" onClick={() => navigate(`${reel?.is_owner ? '/account/profile' : `/profile/${reel.user.id}/${reel.user.username}`}`)}>{reel.user.name}</h4>
                        <p className="text-xs text-gray-300">@{reel.user.username}</p>
                    </div>
                    {
                        !reel.is_owner && (
                            <button className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-xs font-semibold rounded-full transition-colors cursor-pointer">
                                Follow
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
                        onEnded={() => {
                            if (audioRef.current) {
                                audioRef.current.pause();
                            }
                        }}
                    />
                )}

                <div className="flex items-center space-x-2 text-xs text-gray-300">
                    <Music className="w-3.5 h-3.5 animate-spin" />
                    <span className="truncate">{reel.audio_name}</span>
                </div>
            </div>

        </div>
    )
}
