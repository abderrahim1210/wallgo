import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom'
import LoadingButton from '../Icons/LoadingButton';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        password_confirmation: '',
        token: searchParams.get('token') || '',
        email: searchParams.get('email') || ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.password || !formData.password_confirmation || !formData.email || !formData.token) return null;
        setLoading(true);
        try {
            const res = await axios.post(`${api_url}/reset_password`, formData, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                setStatus('success');

                setTimeout(() => {
                    navigate('/account/login');
                }, 1000);
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response.data);
            setError(err?.response.data.message);
        }
    }

    return (
        <div className='signup_page min-h-screen flex flex-col justify-between'>
            <Helmet>
                <title>{t('auth.resetPassword')}</title>
            </Helmet>

            <div className='flex-grow flex items-center justify-center p-4 py-10'>
                {
                    status === 'success' ? (
                        <div className="success-container animate-in text-center py-4">
                            <div className="w-16 h-16 bg-purple-600/20 dark:bg-purple-400/20 border border-purple-500/30 text-[var(--special-purple)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight mb-2 text-gray-100">{t('auth.resetSuccess')}</h2>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                                {t('auth.passwordUpdated')} <strong className="text-white">{t('auth.redirectingToLogin')}</strong>
                            </p>
                        </div>
                    ) : (

                        <div className='w-full max-w-lg  border rounded-3xl shadow-2xl p-10'>
                            <div className='relative flex items-center justify-center'>
                                <button
                                    onClick={() => navigate('/account/signup')}
                                    className="absolute left-0 -top-2 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center space-x-1.5 text-xs font-medium group cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    <span>{t('auth.back')}</span>
                                </button>
                                <img src="/icons/logos/mix_logo.webp" width={150} className='img-fluid' alt="" />
                            </div>
                            <div className='h-8 flex items-center justify-center mt-2 mb-5 overflow-hidden'>
                                <p className={`text-gray-300 dark:text-gray-400 text-sm text-center typewriter-text`}>
                                    {t('auth.resetInstructions')}
                                </p>
                            </div>
                            <form className='space-y-5' onSubmit={handleSubmit}>

                                <div>
                                    <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.newPassword')}</label>
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
                                <div>
                                    <label className='block text-xs font-medium text-gray-300 dark:text-gray-400 mb-1.5 uppercase tracking-wider'>{t('auth.confirmPassword')}</label>
                                    <div className='relative'>
                                        <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500'>
                                            <Lock className='w-5 h-5' />
                                        </span>
                                        <input
                                            type='password'
                                            name='password_confirmation'
                                            value={formData.password_confirmation}
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
                                    <span>{t('auth.updatePassword')}</span>
                                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                                </LoadingButton>
                            </form>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ResetPassword