import React, { useEffect, useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Camera, ImageIcon, PlusCircle } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../pages/Auth/getUser'
import toast from 'react-hot-toast'
import LoadingButton from '../Icons/LoadingButton'
import { useTranslation } from 'react-i18next'

export const CreatePage = () => {
    const { t } = useTranslation();
    const { branch } = useParams<{ branch: 'page' | 'group' }>();
    const navigate = useNavigate();
    const currentBranch: 'Page' | 'Group' = branch === 'page' ? 'Page' : 'Group';
    const entity = t(currentBranch === 'Page' ? 'common.page' : 'common.group');
    const [error, setError] = useState('');
    const [data, setData] = useState({
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        category: '',
        visibility: '',
        question:'',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setData((prev: any) => ({ ...prev, [e.target.name]: reader.result }));
            }
        };

        reader.readAsDataURL(file);

        e.target.value = "";
    }

    const [loading, setLoading] = useState(false);

    if (branch !== 'page' && branch !== 'group') {
        return <Navigate to={'/error'} replace />
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.name) return null;
        setLoading(true);
        try {
            const url = `${api_url}/${currentBranch === 'Page' ? 'pages' : 'groups'}/create`;
            const res = await axios.post(url, data, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || t('pageForm.createSuccess', { entity }));
                setTimeout(() => {
                    if (currentBranch === 'Page') {
                        navigate('/pages');
                    } else {
                        navigate('/groups');
                    }
                }, 1000);
            } else {
                setLoading(false);
                toast.error(res.data.message || t('pageForm.createFailed'));
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
                <title>{t('pageForm.createTitle', { entity })}</title>
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
                        {t('pageForm.createTitle', { entity })}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">{t('pageForm.coverPhoto')}</label>
                        <div className="relative h-40 w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center hover:border-[var(--special-purple)] transition">
                            {data?.banner_url ? (
                                <img src={typeof data.banner_url === 'object' ? URL.createObjectURL(data.banner_url) : data.banner_url} alt={t('pageForm.coverAlt')} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400 flex flex-col items-center gap-1">
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-xs">{t('pageForm.clickToUploadCover')}</span>
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
                        <label className="block text-xs font-semibold text-gray-700 mb-2">{t('pageForm.pageAvatar')}</label>
                        <div className="relative w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center hover:border-[var(--special-purple)] transition">
                            {data?.logo_url ? (
                                <img src={typeof data.logo_url === 'object' ? URL.createObjectURL(data.logo_url) : data.logo_url} alt={t('pageForm.avatarAlt')} className="w-full h-full object-cover" />
                            ) : (
                                <Camera className="w-6 h-6 text-gray-400" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                name='logo_url'
                                onChange={handleFile}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{t('pageForm.nameRequired', { entity })}</label>
                        <input
                            type="text"
                            name='name'
                            value={data?.name}
                            onChange={handleChange}
                            placeholder={t('pageForm.namePlaceholder')}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition"
                            required
                        />
                    </div>

                    {
                        currentBranch === 'Page' ? (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('pageForm.category')} *</label>
                                <select
                                    name='category'
                                    value={data?.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition cursor-pointer"
                                    required
                                >
                                    <option value="">{t('pageForm.chooseCategory')}</option>
                                    <option value="technology">{t('pageForm.categories.technology')}</option>
                                    <option value="photography">{t('pageForm.categories.photography')}</option>
                                    <option value="business">{t('pageForm.categories.business')}</option>
                                    <option value="education">{t('pageForm.categories.education')}</option>
                                    <option value="entertainment">{t('pageForm.categories.entertainment')}</option>
                                    <option value="personal_blog">{t('pageForm.categories.personalBlog')}</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('pageForm.type')}</label>
                                <select
                                    name='visibility'
                                    value={data?.visibility}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition cursor-pointer"
                                    required
                                >
                                    <option value="">{t('pageForm.selectType')}</option>
                                    <option value="public">{t('pageForm.public')}</option>
                                    <option value="private">{t('pageForm.private')}</option>
                                </select>
                            </div>
                        )
                    }

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{t('pageForm.descriptionOptional')}</label>
                        <textarea
                            name='description'
                            value={data?.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder={t('pageForm.descriptionPlaceholder', { entity })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition resize-none"
                        />
                    </div>

                    {
                        currentBranch === 'Group' && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('pageForm.question')}</label>
                                <textarea
                                    name='question'
                                    value={data?.question}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder={t('pageForm.questionPlaceholder')}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[var(--special-purple)] focus:bg-white transition resize-none"
                                />
                            </div>
                        )
                    }
                    <LoadingButton loading={loading} className="w-full bg-[var(--special-purple)] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-sm cursor-pointer disabled:opacity-50">
                        {t('pageForm.create')}
                    </LoadingButton>
                </form>
            </div>
        </MainLayout>
    )
}
