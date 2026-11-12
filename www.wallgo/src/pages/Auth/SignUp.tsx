import { ArrowLeft, ArrowRight, AtSign, Lock, Mail, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Footer } from '../../layouts/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingButton from '../../Icons/LoadingButton';
import { useTranslation } from 'react-i18next';

export const SignUp = () => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        day: '',
        month: '',
        year: '',
    });
    const [error, setError] = useState("");
    const url = 'https://api.wallgo.test';
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.name) {
            console.log("Email,password,name is obligatory");
        }
        setLoading(true);
        try {
            await axios.get(`${url}/sanctum/csrf-cookie`, { withCredentials: true, withXSRFToken: true });
            await axios.post(`${url}/register`, formData, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (!res.data.success) {
                    setLoading(false);
                    setError(res.data.message);
                    console.log(res.data.message);
                } else {
                    setLoading(false);
                    navigate('/');
                }

            });
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response?.data?.message);
            setError(err?.response?.data?.message);
        }
    }
    const slogans: string[] = [
        t('auth.joinCommunity'),
        t('auth.connectWithPeople'),
        t('auth.shareYourStory'),
        t('auth.discoverYourNetwork'),
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % slogans.length);
                setFade(true);
            }, 300);
        }, 5000);
        return () => clearInterval(interval);
    }, [slogans.length]);

    return (
        <div className='signup_page min-h-screen flex flex-col justify-between'>
            <Helmet>
                <title>{t('common.signUp')}</title>
            </Helmet>
            <div className='flex-grow flex items-center justify-center p-4 py-10'>
                <div className='w-full max-w-lg  border rounded-3xl shadow-2xl p-10'>
                    <div className='relative flex items-center justify-center'>
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute left-0 -top-2 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center space-x-1.5 text-xs font-medium group cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span>{t('auth.back')}</span>
                        </button>
                        <img src="/icons/logos/mix_logo.webp" width={150} className='img-fluid' alt="" />
                    </div>
                    <div className='h-8 flex items-center justify-center mt-2 mb-5 overflow-hidden'>
                        <p className={`text-gray-300 dark:text-gray-400 text-sm text-center typewriter-text transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                            {slogans[currentIndex]}
                        </p>
                    </div>
                    <form className='space-y-5' onSubmit={handleSubmit}>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.fullName')}</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500'>
                                    <User className='w-5 h-5' />
                                </span>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t('auth.fullNamePlaceholder')}
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.username')}</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500'>
                                    <AtSign className='w-5 h-5' />
                                </span>
                                <input
                                    type='text'
                                    name='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder={t('auth.usernamePlaceholder')}
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.birthday')}</label>
                            <div className='grid grid-cols-3 gap-3'>
                                <select
                                    name='day'
                                    value={formData.day}
                                    onChange={handleChange}
                                    className='w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all cursor-pointer'
                                >
                                    <option value='' className='bg-[#0f172a] text-gray-400 dark:text-gray-500'>{t('auth.day')}</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1} className='bg-[#0f172a] text-white'>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name='month'
                                    value={formData.month}
                                    onChange={handleChange}
                                    className='w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all cursor-pointer'
                                >
                                    <option value='' className='bg-[#0f172a] text-gray-400 dark:text-gray-500'>{t('auth.month')}</option>
                                    {Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat(i18n.language, { month: 'short' }).format(new Date(2026, index, 1))).map((m, index) => (
                                        <option key={index + 1} value={index + 1} className='bg-[#0f172a] text-white'>
                                            {m}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name='year'
                                    value={formData.year}
                                    onChange={handleChange}
                                    className='w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all cursor-pointer'
                                >
                                    <option value='' className='bg-[#0f172a] text-gray-400 dark:text-gray-500'>{t('auth.year')}</option>
                                    {Array.from({ length: 80 }, (_, i) => {
                                        const year = 2026 - i;
                                        return (
                                            <option key={year} value={year} className='bg-[#0f172a] text-white'>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.emailAddress')}</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500'>
                                    <Mail className='w-5 h-5' />
                                </span>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('auth.emailPlaceholder')}
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.password')}</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500'>
                                    <Lock className='w-5 h-5' />
                                </span>
                                <input
                                    type='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='••••••••'
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>
                        {
                            error && (
                                <div className='bg-[var(--special-red)] font-semibold rounded p-4 text-white'>
                                    <p>{error}</p>
                                </div>
                            )
                        }
                        <div className='text-xm text-semibold text-gray-400 dark:text-gray-500 space-y-3 font-semibold leading-relaxed'>
                            <p>
                                {t('auth.contactInfoNotice')} <Link to='#' className='text-[var(--special-purple)] hover:underline'>{t('auth.learnMore')}</Link>.
                            </p>
                            <p>
                                {t('auth.termsAgreement')} <Link to='#' className='text-[var(--special-purple)] hover:underline'>{t('auth.terms')}</Link>, <Link to='#' className='text-[var(--special-purple)] hover:underline'>{t('auth.privacyPolicy')}</Link> {t('auth.and')} <Link to='#' className='text-[var(--special-purple)] hover:underline'>{t('auth.cookiesPolicy')}</Link>.
                            </p>
                        </div>

                        <LoadingButton
                            loading={loading}
                            type='submit'
                            className='w-full mt-2 py-3 px-4 bg-[var(--special-purple)] hover:bg-opacity-95 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer'
                        >
                            <span>{t('auth.createAccount')}</span>
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </LoadingButton>
                    </form>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/account/login')}
                            className="w-full py-3 px-4 bg-[#1a1a24]/60 hover:bg-[#1a1a24] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                        >
                            {t('auth.alreadyHaveAccount')}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
