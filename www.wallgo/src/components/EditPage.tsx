import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { FaCamera, FaSave, FaTimes } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../pages/Auth/getUser'
import { useQuery } from '@tanstack/react-query'
import type { Page } from './PageProfile'


export const EditPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        category: ''
    });


    const fetchPage = async () => {
        try {
            const res = await axios.get(`${api_url}/pages/${id}`, { withCredentials: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data } = useQuery({
        queryKey: ['page', id],
        queryFn: fetchPage
    });

    const page = data?.page || null;

    useEffect(() => {
        if (data) {
            setFormData({
                name: page.name || '',
                description: page.description || '',
                logo_url: page.logo_url || '',
                banner_url: page.banner_url || '',
                category: page.category || ''
            });
        }
    }, [id]);

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const bannerRef = useRef<HTMLInputElement>(null);
    const logoRef = useRef<HTMLInputElement>(null);

    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Edit Page</title>
            </Helmet>

            <div className="max-w-3xl mx-auto px-4 py-8 pb-24">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
                        <p className="text-sm text-gray-500">Update your page information</p>
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
                            <img src={bannerPreview || page?.banner_url || '/backgrounds/users_banner.svg'} alt="Banner" className="w-full h-full object-cover" />
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
                            // onChange={(e) => handleFile(e, setBannerPreview)}
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 group shrink-0">
                                <img src={'/icons/users.svg'} alt="Avatar" className="w-full h-full object-cover" />
                                <div /* onClick={() => avatarRef.current?.click()} */ className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                    <FaCamera className="text-white w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <button type="button" /* onClick={() => avatarRef.current?.click()} */ className="text-sm font-medium text-[var(--special-purple)] hover:underline">
                                    Upload new logo
                                </button>
                                <p className="text-xs text-gray-400 mt-0.5">Recommended: Square JPG, PNG. Max 2MB.</p>
                            </div>
                            <input
                                type="file"
                                // ref={avatarRef}
                                accept="image/*"
                                className="hidden"
                                id="avatar-upload"
                                name='avatar_url'
                            // onChange={(e) => handleFile(e, setAvatarPreview)}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                            <input
                                type="text"
                                value={formData?.name}
                                // onChange={handleChange}
                                name='name'
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                rows={3}
                                value={formData?.description}
                                // onChange={handleChange}
                                name='description'
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 resize-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                value={formData?.category}
                                // onChange={handleChange}
                                name='category'
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 capitalize"
                            >
                                <option value="">Choose category</option>
                                <option value="technology">Technology</option>
                                <option value="education">Education</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="photography">Photography</option>
                                <option value="business">Business</option>
                                <option value="personal_blog">Personal Blog</option>
                            </select>
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <Link
                            to="/account/profile"
                            className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            // disabled={!formData && !avatarPreview && !bannerPreview}
                            // onClick={handleSubmit}
                            className={`flex items-center gap-2 px-6 py-3 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500`}
                        >
                            <FaSave className="w-4 h-4" /> Save Changes
                        </button>
                    </div>

                </div>

            </div>
        </MainLayout>
    )
}
