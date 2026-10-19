import React, { useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Camera, ImageIcon, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../pages/Auth/getUser'
import toast from 'react-hot-toast'

export const CreatePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [pageData, setPageData] = useState({
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        category: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setPageData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setPageData((prev: any) => ({ ...prev, [e.target.name]: reader.result }));
            }
        };

        reader.readAsDataURL(file);

        e.target.value = "";
    }


    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!pageData.name || !pageData.category) return null;
        try {
            const res = await axios.post(`${api_url}/pages/create`, pageData, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message || 'Page created successfully');
                setTimeout(() => {
                    navigate('/pages');
                }, 1000);
            } else {
                toast.error(res.data.message || 'Something went wrong');
                console.error(res.data.message);
                setError(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Create page</title>
            </Helmet>

            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600 cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <PlusCircle className="w-7 h-7 text-[var(--special-purple)]" />
                        Create New Page
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Cover Photo</label>
                        <div className="relative h-40 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center hover:border-[var(--special-purple)] transition">
                            {pageData?.banner_url ? (
                                <img src={typeof pageData.banner_url === 'object' ? URL.createObjectURL(pageData.banner_url) : pageData.banner_url} alt="Cover Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400 flex flex-col items-center gap-1">
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-xs">Click to upload cover photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                name='banner_url'
                                onChange={handleFile}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Page Avatar</label>
                        <div className="relative w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center hover:border-[var(--special-purple)] transition">
                            {pageData?.logo_url ? (
                                <img src={typeof pageData.logo_url === 'object' ? URL.createObjectURL(pageData.logo_url) : pageData.logo_url} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="w-6 h-6 text-gray-400" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                name='logo_url'
                                onChange={handleFile}
                                // onChange={handleAvatarChange} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Page Name *</label>
                        <input
                            type="text"
                            // value={name} 
                            // onChange={(e) => setName(e.target.value)}
                            name='name'
                            value={pageData?.name}
                            onChange={handleChange}
                            placeholder="e.g. WallGo Tech, Photographie..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                        <select
                            // value={category} 
                            // onChange={(e) => setCategory(e.target.value)} 
                            name='category'
                            value={pageData?.category}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition cursor-pointer"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="technology">Technology</option>
                            <option value="photography">Photography</option>
                            <option value="business">Business</option>
                            <option value="education">Education</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="personal_blog">Personal Blog</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            // value={description} 
                            // onChange={(e) => setDescription(e.target.value)} 
                            name='description'
                            value={pageData?.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Tell people what your page is about..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        // disabled={loading}
                        className="w-full bg-[var(--special-purple)] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        {/* {loading ? 'Creating Page...' : 'Create Page'} */}
                        Create
                    </button>
                </form>
            </div>
        </MainLayout>
    )
}
