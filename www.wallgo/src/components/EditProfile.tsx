import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../MainLayout';
import { Helmet } from 'react-helmet-async';
import { FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useModal } from '../hooks/ModalProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '../templates/Skeleton';
import { ErrorPage } from './ErrorPage';
import toast from 'react-hot-toast';
import LoadingButton from '../Icons/LoadingButton';

export const EditProfile = () => {
    const api_url = 'https://api.wallgo.test';
    const [loading, setLoading] = useState(false);
    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${api_url}/get_user`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.user;
        } catch (err: any) {
            console.log(err?.response?.data);
        }
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user_edit'],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const user = data || {};

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        birth: '',
        avatar_url: '',
        banner_url: '',
        phone: '',
        gender: '',
        status: '',
        bio: '',
        location: ''
    });
    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                username: data.username || '',
                email: data.email || '',
                phone: data.phone || '',
                birth: data.birth || '',
                gender: data.gender || '',
                status: data.status || '',
                bio: data.bio || '',
                location: data.location || '',
                avatar_url: data.avatar_url || '',
                banner_url: data.banner_url || '',
            });
        }
    }, [data?.id]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>, fn: (path: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                fn(reader.result);
                setFormData((prev: any) => ({ ...prev, [e.target.name]: reader.result }));
            }
        };

        reader.readAsDataURL(file);

        e.target.value = "";
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${api_url}/edit_profile`, formData, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || 'Profile updated successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setLoading(false);
                toast.error(res.data.message || 'Failed to edit profile');
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.log(err?.response?.data);
        }
    }

    const bannerRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Edit Profile</title>
            </Helmet>
            {
                isLoading ? (
                    <Skeleton type='edit_profile' />
                ) : isError ? (
                    <div className='mt-10'>
                        <ErrorPage codeP='500' />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                                <p className="text-sm text-gray-500">Update your personal information and profile appearance</p>
                            </div>
                            <Link
                                to="/account/profile"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
                            >
                                <FaTimes className="w-4 h-4" /> Cancel
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700">Profile Banner & Avatar</label>

                                <div className={`relative h-40 md:h-52 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group`}>
                                    <img src={bannerPreview || user?.banner_url || '/backgrounds/user_banner.svg'} alt="Banner" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                        <button onClick={() => bannerRef.current?.click()} className="flex items-center gap-2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                                            <FaCamera className="w-4 h-4" /> Change Banner
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        ref={bannerRef}
                                        accept="image/*"
                                        className="hidden"
                                        id="banner-upload"
                                        name='banner_url'
                                        onChange={(e) => handleFile(e, setBannerPreview)}
                                    />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 group shrink-0">
                                        <img src={user?.avatar_url || avatarPreview || '/icons/avatar1.svg'} alt="Avatar" className="w-full h-full object-cover" />
                                        <div onClick={() => avatarRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                            <FaCamera className="text-white w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => avatarRef.current?.click()} className="text-sm font-medium text-[var(--special-purple)] hover:underline">
                                            Upload new avatar
                                        </button>
                                        <p className="text-xs text-gray-400 mt-0.5">Recommended: Square JPG, PNG. Max 2MB.</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={avatarRef}
                                        accept="image/*"
                                        className="hidden"
                                        id="avatar-upload"
                                        name='avatar_url'
                                        onChange={(e) => handleFile(e, setAvatarPreview)}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData?.name}
                                        onChange={handleChange}
                                        name='name'
                                        placeholder='Type name ...'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                                    <input
                                        type="text"
                                        value={formData?.username}
                                        onChange={handleChange}
                                        name='username'
                                        placeholder='Type username ...'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData?.email}
                                        onChange={handleChange}
                                        name='email'
                                        placeholder='Type email ...'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData?.phone}
                                        onChange={handleChange}
                                        name='phone'
                                        placeholder='Type phone number ...'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Date</label>
                                    <input
                                        type="date"
                                        value={formData?.birth}
                                        onChange={handleChange}
                                        name='birth'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                                    <select
                                        value={formData?.gender}
                                        onChange={handleChange}
                                        name='gender'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 capitalize"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>


                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        value={formData?.location}
                                        onChange={handleChange}
                                        name='location'
                                        placeholder='Type location ...'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                    <select
                                        value={formData?.status}
                                        onChange={handleChange}
                                        name='status'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 capitalize"
                                    >
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="engaged">Engaged</option>
                                        <option value="divorced">Divorded</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={formData?.bio}
                                        onChange={handleChange}
                                        name='bio'
                                        placeholder='Type bio ...'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 resize-none"
                                    ></textarea>
                                </div>

                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    to="/account/profile"
                                    className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                                >
                                    Cancel
                                </Link>

                                <LoadingButton loading={loading} type='button' onClick={handleSubmit} className='flex items-center gap-2 px-6 py-3 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500'>
                                    <FaSave className="w-4 h-4" /> Save Changes
                                </LoadingButton>
                            </div>

                        </div>

                    </div>
                )
            }
        </MainLayout>
    )
}
