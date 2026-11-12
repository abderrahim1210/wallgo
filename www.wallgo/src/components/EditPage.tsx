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
import LoadingButton from '../Icons/LoadingButton'
import { useTranslation } from 'react-i18next'


export const EditPage = () => {
    const { t } = useTranslation();
    const { id, type } = useParams<{ id: string, type: 'pages' | 'groups' }>();
    const navigate = useNavigate();
    const entity = t(type === 'pages' ? 'common.page' : 'common.group');
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
                toast.success(res.data.message || t('pageForm.updateSuccess', { entity }));
                setTimeout(() => {
                    navigate(`/${type}/${id}`);
                }, 1000);
            } else {
                setLoading(false);
                toast.error(res.data.message || t('pageForm.updateFailed', { entity }));
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    return (
        <MainLayout>
            <Helmet>
                <title>{t('pageForm.editTitle', { entity })}</title>
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
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('pageForm.editTitle', { entity })}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('pageForm.editDescription', { entity })}</p>
                            </div>
                            <Link
                                to={`/${type}`}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition"
                            >
                                <FaTimes className="w-4 h-4" /> {t('common.cancel')}
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">

                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('pageForm.bannerAndLogo', { entity })}</label>

                                <div className={`relative h-40 md:h-52 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group`}>
                                    <img src={bannerPreview || formData?.banner_url || '/backgrounds/users_banner.svg'} alt={t('pageForm.bannerAlt')} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                        <button onClick={() => bannerRef.current?.click()} className="flex items-center gap-2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                                            <FaCamera className="w-4 h-4" /> {t('pageForm.changeBanner')}
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
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 dark:bg-gray-800 group shrink-0">
                                        <img src={logoPreview || formData?.logo_url || '/icons/users.svg'} alt={t('pageForm.logoAlt')} className="w-full h-full object-cover" />
                                        <div onClick={() => logoRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                            <FaCamera className="text-white w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => logoRef.current?.click()} className="text-sm font-medium text-[var(--special-purple)] hover:underline">
                                            {t('pageForm.uploadLogo')}
                                        </button>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('pageForm.imageRequirements')}</p>
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

                            <hr className="border-gray-100 dark:border-gray-800" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div className='md:col-span-2'>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('pageForm.name')}</label>
                                    <input
                                        type="text"
                                        value={formData?.name}
                                        onChange={handleChange}
                                        name='name'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 dark:bg-gray-800/50"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('pageForm.description')}</label>
                                    <textarea
                                        rows={3}
                                        value={formData?.description}
                                        onChange={handleChange}
                                        name='description'
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 dark:bg-gray-800/50 resize-none"
                                    />
                                </div>

                                {
                                    formData?.category && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('pageForm.category')}</label>
                                            <select
                                                value={formData?.category}
                                                onChange={handleChange}
                                                name='category'
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 dark:bg-gray-800/50 capitalize"
                                            >
                                                <option value="">{t('pageForm.chooseCategory')}</option>
                                                <option value="technology">{t('pageForm.categories.technology')}</option>
                                                <option value="education">{t('pageForm.categories.education')}</option>
                                                <option value="entertainment">{t('pageForm.categories.entertainment')}</option>
                                                <option value="photography">{t('pageForm.categories.photography')}</option>
                                                <option value="business">{t('pageForm.categories.business')}</option>
                                                <option value="personal_blog">{t('pageForm.categories.personalBlog')}</option>
                                            </select>
                                        </div>
                                    )
                                }

                                {
                                    formData?.visibility && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('pageForm.visibility')}</label>
                                            <select
                                                value={formData?.visibility}
                                                onChange={handleChange}
                                                name='visibility'
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 dark:bg-gray-800/50 capitalize"
                                            >
                                                <option value="">{t('pageForm.selectVisibility')}</option>
                                                <option value="public">{t('pageForm.public')}</option>
                                                <option value="private">{t('pageForm.private')}</option>
                                            </select>
                                        </div>
                                    )
                                }

                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Link
                                    to="/account/profile"
                                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition"
                                >
                                    {t('common.cancel')}
                                </Link>
                                <LoadingButton loading={loading} type='button' onClick={handleSubmit} className='flex items-center gap-2 px-6 py-3 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500'>
                                    <FaSave className="w-4 h-4" /> {t('pageForm.saveChanges')}
                                </LoadingButton>
                            </div>

                        </div>

                    </div>
                )
            }
        </MainLayout>
    )
}
