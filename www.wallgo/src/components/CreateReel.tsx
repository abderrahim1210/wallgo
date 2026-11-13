import { Clapperboard, Disc, Eye, EyeClosed, Loader2, Music, Play, Sparkles, Upload, Video, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { ReelIcon } from '../Icons/ReelIcon';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../MainLayout';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
    is_followed: boolean;
    is_liked: boolean;
    is_saved: boolean;
    public_id: number;
    views_count: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    reelable: {
        id: number;
        name: string;
        owner_id: number;
        logo_url: string;
    }
    reelable_type:string;
}

export const cloudName = "dhysaozog";

export const CreateReel = () => {
    const { t } = useTranslation();
    const { reel_id } = useParams();
    const location = useLocation();
    const groupId = location.state?.groupId;
    const groupName = location.state?.groupName;
    const pageId = location.state?.pageId;
    const pageName = location.state?.pageName;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<{ title: string; artist: string; url: string } | null>(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [edit, setEdit] = useState(false);

    const [reel, setReel] = useState({
        video_url: '',
        caption: '',
        audio_name: '',
        audio_url: '',
        visibility: '',
        public_id: '',
        reelable_id: '',
        reelable_type: ''
    });

    useEffect(() => {
        if (groupId) {
            setReel(prev => ({ ...prev, reelable_id: groupId, reelable_type: 'group' }));
        }
    }, [groupId]);

    useEffect(() => {
        if (pageId) {
            setReel(prev => ({ ...prev, reelable_id: pageId, reelable_type: 'page' }));
        }
    }, [pageId]);

    useEffect(() => {
        if (reel_id) {
            setEdit(true);
            axios.get(`${api_url}/reels/${reel_id}`, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success) {
                    const fetchedReel = res.data.reel;
                    setReel({
                        video_url: fetchedReel.video_url || '',
                        caption: fetchedReel.caption || '',
                        audio_name: fetchedReel.audio_name || '',
                        audio_url: fetchedReel.audio_url || '',
                        visibility: fetchedReel.visibility || '',
                        public_id: fetchedReel.public_id || '',
                        reelable_id: fetchedReel.reelable_id || '',
                        reelable_type: fetchedReel.reelable_type || ''
                    });
                    setVideoPreview(fetchedReel?.video_url || null);
                    if (fetchedReel.audio_name && fetchedReel.audio_url) {
                        setSelectedTrack({
                            title: fetchedReel.audio_name.split(' - ')[0] || fetchedReel.audio_name,
                            artist: fetchedReel.audio_name.split(' - ')[1] || t('reelCreation.unknownArtist'),
                            url: fetchedReel.audio_url
                        });
                    }
                }
            }).catch((err: any) => {
                console.error(err?.response.data);
            });
        } else {
            setEdit(false);
            setReel({
                video_url: '',
                caption: '',
                audio_name: '',
                audio_url: '',
                visibility: '',
                public_id: '',
                reelable_id: '',
                reelable_type: ''
            });
            setVideoPreview(null);
            setSelectedTrack(null);
        }
    }, [reel_id, t]);

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
        if (!videoFile && !edit) return null;
        setLoading(true);
        try {
            let video_url = reel.video_url;
            let public_id = reel.public_id || '';
            if (videoFile) {
                const cloudinaryFormData = new FormData();
                cloudinaryFormData.append('file', videoFile);
                cloudinaryFormData.append('upload_preset', 'wallgo_reel_presets');
                cloudinaryFormData.append('resource_type', 'video');

                const resCloud = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                    cloudinaryFormData
                );

                video_url = resCloud.data.secure_url;
                public_id = resCloud.data.public_id;
            }

            const method = edit ? 'put' : 'post';
            const url = edit ? `${api_url}/reels/${reel_id}/edit` : `${api_url}/reels/create`;
            const formData = new FormData();
            if (edit) {
                formData.append('_method', 'PUT');
            }
            formData.append('video', video_url);
            formData.append('public_id', public_id);
            formData.append('caption', reel.caption);
            formData.append('audio_name', reel.audio_name);
            formData.append('audio_url', reel.audio_url);
            formData.append('visibility', reel.visibility);
            formData.append('type', groupId ? 'group' : 'page');
            const rel_id = groupId ?? pageId;
            formData.append('reelable_id', rel_id);
            formData.append('reelable_type', 'group');
            const res = await axios[method](url, formData, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(edit ? t('reelCreation.updated') : t('reelCreation.created'));
                setTimeout(() => {
                    navigate('/reels');
                }, 1000);
            } else {
                setLoading(false);
                toast.error(edit ? t('reelCreation.updateFailed') : t('reelCreation.createFailed'));
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

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    return (
        <MainLayout>
            <div className="flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-xl overflow-hidden border border-gray-300 dark:border-gray-600 border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">

                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-[var(--special-purple)]">
                            <Clapperboard className='w-5 h-5' />
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-xl">{groupName ? t('reelCreation.titleForGroup', { groupName }) : pageName ? t('reelCreation.titleForPage', { pageName }) : edit ? t('reelCreation.editTitle') : t('reelCreation.title')}</h3>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            aria-label={t('common.close')}
                            title={t('common.close')}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 p-1.5 rounded-full hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">

                        {!videoPreview ? (
                            <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[var(--special-purple)] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-50/50 dark:bg-gray-800/50 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition group">
                                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-[var(--special-purple)] group-hover:scale-110 transition duration-200">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('reelCreation.uploadPrompt')}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('reelCreation.videoRequirements')}</p>
                                </div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={handleVideoChange}
                                />
                            </label>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[400px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                <video
                                    src={videoPreview}
                                    className="h-full object-contain"
                                    loop
                                    autoPlay
                                    playsInline
                                    onClick={togglePlay}
                                />
                                {!isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
                                        <div className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white">
                                            <Play className="w-6 h-6" />
                                        </div>
                                    </div>
                                )}
                                {
                                    !edit && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReel(prev => ({ ...prev, video_url: '' }));
                                                setVideoPreview(null);
                                            }}
                                            aria-label={t('reelCreation.removeVideo')}
                                            title={t('reelCreation.removeVideo')}
                                            className="absolute top-3 right-3 cursor-pointer bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-xs transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )
                                }
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">{t('reelCreation.caption')}</label>
                            <textarea
                                name='caption'
                                value={reel.caption}
                                onChange={handleChange}
                                placeholder={t('reelCreation.captionPlaceholder')}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] outline-none text-sm text-gray-800 dark:text-gray-200 resize-none transition"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{t('reelCreation.audioTrackName')}</label>

                            <div
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="relative flex items-center justify-between px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] bg-white dark:bg-gray-900 cursor-pointer transition shadow-xs hover:border-[var(--special-purple)]"
                            >
                                <div className="flex items-center gap-2">
                                    <Music className="w-3.5 h-3.5 text-[var(--special-purple)] animate-pulse" />
                                    <span className="text-xs text-gray-800 dark:text-gray-200 font-medium">
                                        {selectedTrack ? `${selectedTrack.title} - ${selectedTrack.artist}` : t('reelCreation.selectTrack')}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500">▼</span>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
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
                                            className="px-4 py-2.5 hover:bg-purple-50/50 dark:hover:bg-purple-950/35 cursor-pointer flex items-center justify-between text-xs transition"
                                        >
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-200">{track.title}</p>
                                                <p className="text-gray-400 dark:text-gray-500 text-[10px]">{track.artist}</p>
                                            </div>
                                            <Music className="w-3.5 h-3.5 text-[var(--special-purple)]" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedTrack && (
                                <div className="mt-2.5 p-2.5 bg-purple-50/60 dark:bg-purple-950/35 border border-purple-100 dark:border-purple-900/60 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[var(--special-purple)] text-white flex items-center justify-center shadow-md animate-spin-slow flex-shrink-0">
                                            <Disc className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{selectedTrack.title}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">{selectedTrack.artist} • <span className="text-[var(--special-purple)] font-semibold">{t('reelCreation.ready')}</span></p>
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
                                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-xs font-semibold px-2 py-1 transition"
                                    >
                                        {t('reelCreation.remove')}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">{t('reelCreation.visibility')}</label>
                            <div className="relative flex items-center">
                                {
                                    reel?.visibility === 'private' ? (
                                        <EyeClosed className='absolute left-3.5 w-4 h-4 text-gray-400 dark:text-gray-500' />
                                    ) : (
                                        <Eye className="absolute left-3.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    )
                                }
                                <select
                                    name='visibility'
                                    value={reel.visibility}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] outline-none text-sm text-gray-800 dark:text-gray-200 transition"
                                >
                                    <option value="">{t('reelCreation.selectVisibility')}</option>
                                    <option value="public">{t('feed.public')}</option>
                                    <option value="private">{t('feed.private')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 cursor-pointer rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                {t('feed.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={!reel.video_url || !reel.caption}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--special-purple)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20 transition"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{edit ? t('reelCreation.updating') : t('reelCreation.posting')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Video className="w-4 h-4" />
                                        <span>{edit ? t('reelCreation.editReel') : t('reelCreation.shareReel')}</span>
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
