import { BookmarkPlus, Copy, Edit3, EyeOff, Flag, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useModal } from '../hooks/ModalProvider';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';

interface ReelOptionsProps {
    reel_id: number;
    is_owner: boolean;
    is_saved: boolean;
    setOpenReport: (isopen: boolean) => void;
}

export const ReelOptions: React.FC<ReelOptionsProps> = ({ setOpenReport, reel_id, is_owner, is_saved }) => {
    const { closeModal } = useModal()!;
    const [saved, setSaved] = useState<boolean>(Boolean(is_saved));
    const handleSavePost = async () => {
        if (!reel_id) return null;
        setSaved(prev => !prev);
        try {
            await axios.post(`${api_url}/post/save`, { reel_id: reel_id, type: 'reel' }, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success) {
                    toast.success(res.data.message);
                }
            });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 w-full border border-gray-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 px-3 border-b border-gray-100">
                <h3 className="font-bold text-[20px] text-gray-900 tracking-wide">Reel Options</h3>
            </div>

            <div className="py-2 space-y-1">
                {
                    is_owner && (
                        <button
                            onClick={() => {
                                // navigate(`/reel/${reel?.id}/edit`, { state: { reelToEdit: reel } });
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
                        navigator.clipboard.writeText(`${window.location.origin}/reels`); // Wla l-link li bghiti
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
            </div>
        </div>
    )
}
