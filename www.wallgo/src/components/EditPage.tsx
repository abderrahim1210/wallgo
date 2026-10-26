import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { FaCamera, FaSave, FaTimes } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../pages/Auth/getUser'
import { useQuery } from '@tanstack/react-query'
import type { Page } from './PageProfile'
import toast from 'react-hot-toast'
import { Skeleton } from '../templates/Skeleton'
import { ErrorPage } from './ErrorPage'
import ButtonSpinner from '../Icons/ButtonSpinner'
import LoadingButton from '../Icons/LoadingButton'


export const EditPage = () => {
    const { id, type } = useParams<{ id: string, type: 'pages' | 'groups' }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        category: '',
        type: '',
        visibility: ''
    });


    const fetchData = async () => {
        try {
            const res = await axios.get(`${api_url}/${type}/${Number(id)}`, { withCredentials: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: [type, id],
        queryFn: fetchData,
        staleTime: 1000 * 60 * 5
    });

    useEffect(() => {
        if (data) {
            if (data?.page) {
                setFormData({
                    name: data.page.name || '',
                    description: data.page.description || '',
                    logo_url: data.page.logo_url || '',
                    banner_url: data.page.banner_url || '',
                    category: data.page.category || '',
                    visibility: '',
                    type: String(type)
                });
            }
            if (data?.group) {
                setFormData({
                    name: data.group.name || '',
                    description: data.group.description || '',
                    logo_url: data.group.logo_url || '',
                    banner_url: data.group.banner_url || '',
                    category: '',
                    visibility: data.group.visibility || '',
                    type: String(type)
                });
            }
        }
    }, [data]);

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

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const bannerRef = useRef<HTMLInputElement>(null);
    const logoRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.put(`${api_url}/${type}/${id}`, formData, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || 'Page updated successfully');
                setTimeout(() => {
                    navigate(`/${type}/${id}`);
                }, 1000);
            } else {
                setLoading(false);
                toast.error(res.data.message || 'Failed to update page');
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Edit Page</title>
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
                                <h1 className="text-2xl font-bold text-gray-900">Edit {type === 'pages' ? 'Page' : 'Group'}</h1>
                                <p className="text-sm text-gray-500">Update your page information</p>
                            </div>
                            <Link
                                to={`/${type}`}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
                            >
                                <FaTimes className="w-4 h-4" /> Cancel
                            </Link>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700">{type === 'pages' ? 'Page' : 'Group'} Banner & Logo</label>

                                <div className={`relative h-40 md:h-52 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group`}>
                                    <img src={bannerPreview || formData?.banner_url || '/backgrounds/users_banner.svg'} alt="Banner" className="w-full h-full object-cover" />
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
                                        <img src={logoPreview || formData?.logo_url || '/icons/users.svg'} alt="Avatar" className="w-full h-full object-cover" />
                                        <div onClick={() => logoRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                            <FaCamera className="text-white w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => logoRef.current?.click()} className="text-sm font-medium text-[var(--special-purple)] hover:underline">
                                            Upload new logo
                                        </button>
                                        <p className="text-xs text-gray-400 mt-0.5">Recommended: Square JPG, PNG. Max 2MB.</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={logoRef}
                                        accept="image/*"
                                        className="hidden"
                                        id="avatar-upload"
                                        name='logo_url'
                                        onChange={(e) => handleFile(e, setLogoPreview)}
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
                                        onChange={handleChange}
                                        name='name'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData?.description}
                                        onChange={handleChange}
                                        name='description'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 resize-none"
                                    />
                                </div>

                                {
                                    formData?.category && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                            <select
                                                value={formData?.category}
                                                onChange={handleChange}
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
                                    )
                                }

                                {
                                    formData?.visibility && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Visibility</label>
                                            <select
                                                value={formData?.visibility}
                                                onChange={handleChange}
                                                name='visibility'
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 capitalize"
                                            >
                                                <option value="">Select visibility ... </option>
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                    )
                                }

                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <Link
                                    to="/account/profile"
                                    className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                                >
                                    Cancel
                                </Link>
                                {/* <button
                                    type="button"
                                    disabled={!formData && !logoPreview && !bannerPreview}
                                    onClick={handleSubmit}
                                    className={`flex items-center gap-2 px-6 py-3 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500`}
                                >
                                    {loading ? (<><ButtonSpinner /> <p>Loading</p></>) : (<><FaSave className="w-4 h-4" /><p>Save Changes</p></>)}
                                </button> */}
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
