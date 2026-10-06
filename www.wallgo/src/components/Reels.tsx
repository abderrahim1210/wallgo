import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../MainLayout';
import { Heart, MessageCircle, MoreVertical, Music, Pause, Send, Volume2, VolumeX } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';
import { Helmet } from 'react-helmet-async';

export const Reels = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState<number | null>(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
    const reels = [
        {
            id: 1,
            videoUrl: 'https://www.pexels.com/download/video/39657557/',
            caption: 'Testing the new WallGo Reels architecture! Clean UI and smooth playback. 🚀✨ #WallGo #Dev',
            likes: '14.2k',
            comments: '382',
            author: {
                name: 'Abderrahim Khali Ali',
                username: 'abderrahim',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            },
            audioName: 'Original Audio - WallGo Official',
        },
        {
            id: 2,
            videoUrl: 'https://www.pexels.com/download/video/39654276/',
            caption: 'Exploring modern fullstack features with React and Tailwind CSS. 💻🔥',
            likes: '28.5k',
            comments: '941',
            author: {
                name: 'Sara Miller',
                username: 'saramiller',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
            },
            audioName: 'Coding Beats - LoFi',
        },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6,
        };

        const handleIntersect: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                const id = Number(entry.target.getAttribute('data-reel-id'));
                const videoElement = videoRefs.current[id];

                if (entry.isIntersecting) {
                    setPlayingVideoId(id);
                    setIsPlaying(true);
                    if (videoElement) {
                        videoElement.play().catch(() => { });
                    }
                } else {
                    if (videoElement) {
                        videoElement.pause();
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        Object.values(videoRefs.current).forEach((video) => {
            if (video) {
                const container = video.closest('.reel-container');
                if (container) observer.observe(container);
            }
        });

        return () => observer.disconnect();
    }, []);


    const togglePlayPause = (id: number) => {
        const videoElement = videoRefs.current[id];
        if (!videoElement) return;

        if (isPlaying) {
            videoElement.pause();
            setIsPlaying(false);
        } else {
            videoElement.play();
            setIsPlaying(true);
        }
    };
    return (
        <>
            <Helmet>
                <title>WallGo : Reels</title>
            </Helmet>
            <Navbar />
            <div className="h-[calc(100vh-55px)] bg-gray-950 overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center">

                {reels.map((reel) => (
                    <div
                        key={reel.id}
                        data-reel-id={reel.id}
                        className="relative w-full max-w-sm h-full snap-start snap-always bg-black rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end shrink-0 border-0 md:border border-gray-800"
                    >
                        <video
                            ref={(el: HTMLVideoElement | null) => {
                                videoRefs.current[reel.id] = el;
                            }}
                            src={reel.videoUrl}
                            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                            loop
                            muted={isMuted}
                            playsInline
                            onClick={() => togglePlayPause(reel.id)}
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
                                <span className="text-xs font-semibold">{reel.likes}</span>
                            </button>

                            <button className="flex flex-col items-center space-y-1 group cursor-pointer">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full group-hover:bg-white/20 transition-colors">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-semibold">{reel.comments}</span>
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
                                <img src={reel.author.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-white/20" />
                                <div>
                                    <h4 className="font-semibold text-sm">{reel.author.name}</h4>
                                    <p className="text-xs text-gray-300">@{reel.author.username}</p>
                                </div>
                                <button className="ml-2 px-3 py-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-xs font-semibold rounded-full transition-colors cursor-pointer">
                                    Follow
                                </button>
                            </div>

                            <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">
                                {reel.caption}
                            </p>

                            <div className="flex items-center space-x-2 text-xs text-gray-300">
                                <Music className="w-3.5 h-3.5 animate-spin" />
                                <span className="truncate">{reel.audioName}</span>
                            </div>
                        </div>

                    </div>
                ))}

            </div>
        </>
    )
}
