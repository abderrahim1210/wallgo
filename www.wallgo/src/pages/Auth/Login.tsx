import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react';
import React, { useState, type ChangeEvent } from 'react'
import { Footer } from '../../layouts/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingButton from '../../Icons/LoadingButton';
import { useTranslation } from 'react-i18next';

export const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const api_url = import.meta.env.VITE_API_URL || 'https://api.wallgo.test';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            console.log("Email and password is obligatory");
        }
        setError('');
        setLoading(true);
        try {
            await axios.post(`${api_url}/login`, formData, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (!res.data.success) {
                    setLoading(false);
                    setError(res.data.message);
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
    return (
        <div className='signup_page min-h-screen flex flex-col justify-between'>
            <Helmet>
                <title>{t('auth.signIn')}</title>
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
                        <p className={`text-gray-300 dark:text-gray-400 text-sm text-center typewriter-text`}>
                            {t('auth.welcomeBack')}
                        </p>
                    </div>
                    <form className='space-y-5' onSubmit={handleSubmit}>

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

                        <LoadingButton
                            loading={loading}
                            type='submit'
                            className='w-full mt-2 py-3 px-4 bg-[var(--special-purple)] hover:bg-opacity-95'
                        >
                            <span>{t('auth.login')}</span>
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </LoadingButton>
                    </form>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/account/signup')}
                            className="w-full py-3 px-4 bg-[#1a1a24]/60 hover:bg-[#1a1a24] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                        >
                            {t('auth.noAccount')}
                        </button>
                    </div>
                    
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot_password')}
                            className="w-full py-3 px-4 bg-[#1a1a24]/60 hover:bg-[#1a1a24] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                        >
                            {t('auth.forgotPassword')}
                        </button>
                    </div>

                   
                </div>
            </div>
            <Footer />
        </div>
    )
}
