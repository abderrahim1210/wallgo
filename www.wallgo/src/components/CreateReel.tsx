import { Clapperboard, Disc, Eye, EyeClosed, Loader2, Music, Sparkles, Upload, Video, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { ReelIcon } from '../Icons/ReelIcon';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../MainLayout';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';

export type Reel = {
    id: number;
    user_id: number;
    video_url: string;
    caption: string;
    audio_name: string;
    audio_url: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    is_owner: boolean;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    }
}

export const CreateReel = () => {
    const [reel, setReel] = useState({
        video_url: '',
        caption: '',
        audio_name: '',
        audio_url: '',
        visibility: ''
    });
    const [loading, setLoading] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setReel(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const navigate = useNavigate();
    const sampleTracks = [
        { id: 1, title: 'Coding Beats - LoFi', artist: 'Lofi Records', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 2, title: 'Summer Vibes', artist: 'Audio Library', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 3, title: 'Energetic Workout', artist: 'BeatMaker', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ];

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<{ title: string; artist: string; url: string } | null>(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);


    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const f = reader.result as string;
                setVideoPreview(f);
                setReel(prev => ({ ...prev, video_url: f }));
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!videoFile || !reel.video_url) return null;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('caption', reel.caption);
            formData.append('audio_name', reel.audio_name);
            formData.append('audio_url', reel.audio_url);
            formData.append('visibility', reel.visibility);
            const res = await axios.post(`${api_url}/reels/create`, formData, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || 'Reel created successfully');
                setTimeout(() => {
                    navigate('/reels');
                }, 1000);
            } else {
                setLoading(false);
                toast.error(res.data.message || 'Failed to create a reel');
                console.log(res.data.message);
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response.data);
        }
    }

    useEffect(() => {
        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
            }
        };
    }, [audioElement]);
    return (
        <MainLayout>
            <div className="flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden border border-gray-300 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 text-[var(--special-purple)]">
                            <Clapperboard className='w-5 h-5' />
                            <h3 className="font-bold text-gray-800 text-xl">Create New Reel</h3>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:text-red-500 cursor-pointer transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">

                        {!videoPreview ? (
                            <label className="border-2 border-dashed border-gray-200 hover:border-[var(--special-purple)] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-50/50 hover:bg-purple-50/20 transition group">
                                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-[var(--special-purple)] group-hover:scale-110 transition duration-200">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-700">Click to upload your reel video</p>
                                    <p className="text-xs text-gray-400 mt-1">MP4, MOV, or WebM (Max 50MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={handleVideoChange}
                                />
                            </label>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[400px] flex items-center justify-center border border-gray-200">
                                <video
                                    src={videoPreview}
                                    className="h-full object-contain"
                                    controls
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReel(prev => ({ ...prev, video_url: '' }));
                                        setVideoPreview(null);
                                    }}
                                    className="absolute top-3 right-3 cursor-pointer bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-xs transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Caption</label>
                            <textarea
                                name='caption'
                                value={reel.caption}
                                onChange={handleChange}
                                placeholder="Write something about your reel... #explore"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] outline-none text-sm text-gray-800 resize-none transition"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Audio Track Name</label>

                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="relative flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] bg-white cursor-pointer transition shadow-xs hover:border-[var(--special-purple)]"
                            >
                                <div className="flex items-center gap-2">
                                    <Music className="w-3.5 h-3.5 text-[var(--special-purple)] animate-pulse" />
                                    <span className="text-xs text-gray-800 font-medium">
                                        {selectedTrack ? `${selectedTrack.title} - ${selectedTrack.artist}` : 'Select an audio track...'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">▼</span>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-gray-50">
                                    {sampleTracks.map((track) => (
                                        <div
                                            key={track.id}
                                            onClick={() => {
                                                setSelectedTrack(track);
                                                setReel(prev => ({ ...prev, audio_url: track.url, audio_name: `${track.title} - ${track.artist}` }))
                                                setIsDropdownOpen(false);

                                                if (audioElement) audioElement.pause();
                                                const audio = new Audio(track.url);
                                                setAudioElement(audio);
                                                audio.play();
                                                setIsPlayingPreview(true);
                                                audio.onended = () => setIsPlayingPreview(false);
                                            }}
                                            className="px-4 py-2.5 hover:bg-purple-50/50 cursor-pointer flex items-center justify-between text-xs transition"
                                        >
                                            <div>
                                                <p className="font-bold text-gray-800">{track.title}</p>
                                                <p className="text-gray-400 text-[10px]">{track.artist}</p>
                                            </div>
                                            <Music className="w-3.5 h-3.5 text-[var(--special-purple)]" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedTrack && (
                                <div className="mt-2.5 p-2.5 bg-purple-50/60 border border-purple-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[var(--special-purple)] text-white flex items-center justify-center shadow-md animate-spin-slow flex-shrink-0">
                                            <Disc className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">{selectedTrack.title}</p>
                                            <p className="text-[10px] text-gray-500">{selectedTrack.artist} • <span className="text-[var(--special-purple)] font-semibold">Ready</span></p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (audioElement) {
                                                audioElement.pause();
                                                setIsPlayingPreview(false);
                                            }
                                            setSelectedTrack(null);
                                            setReel(prev => ({ ...prev, audio_name: '' }));
                                        }}
                                        className="text-gray-400 hover:text-red-500 text-xs font-semibold px-2 py-1 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Visibility</label>
                            <div className="relative flex items-center">
                                {
                                    reel?.visibility === 'private' ? (
                                        <EyeClosed className='absolute left-3.5 w-4 h-4 text-gray-400' />
                                    ) : (
                                        <Eye className="absolute left-3.5 w-4 h-4 text-gray-400" />
                                    )
                                }
                                <select
                                    name='visibility'
                                    value={reel.visibility}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] outline-none text-sm text-gray-800 transition"
                                >
                                    <option value="">Select visibility</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 cursor-pointer rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!reel.video_url || !reel.caption}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--special-purple)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20 transition"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Posting Reel...</span>
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-4 h-4" />
                                        <span>Share Reel</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </MainLayout>
    )
}
