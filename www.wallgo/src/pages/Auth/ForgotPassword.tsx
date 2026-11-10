import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Footer } from '../../layouts/Footer';
import LoadingButton from '../../Icons/LoadingButton';
import { ArrowLeft, ArrowRight, Lock, Mail, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { api_url } from './getUser';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const sendLinkEmail = async () => {
        if (!email) return null;
        setLoading(true);
        try {
            const res = await axios.post(`${api_url}/send_link_email`, { email: email }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                setSent(true);
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setLoading(false);
            setError(err?.response.data.message);
            console.error(err?.response.data);
        }
    }

    return (
        <div className='signup_page min-h-screen flex flex-col justify-between'>
            <Helmet>
                <title>WallGo : Reset Password</title>
            </Helmet>
            <div className='flex-grow flex items-center justify-center p-4 py-10'>
                {
                    !sent ? (
                        <div className='w-full max-w-lg  border rounded-3xl shadow-2xl p-10'>
                            <div className='relative flex items-center justify-center'>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="absolute left-0 -top-2 text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center space-x-1.5 text-xs font-medium group cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    <span>Back</span>
                                </button>
                                <img src="/icons/logos/mix_logo.webp" width={150} className='img-fluid' alt="" />
                            </div>
                            <div className='h-8 flex items-center justify-center mt-2 mb-5 overflow-hidden'>
                                <p className={`text-gray-300 text-sm text-center typewriter-text`}>
                                    No worries, we'll send you reset instructions.
                                </p>
                            </div>
                            <form className='space-y-5' onSubmit={sendLinkEmail}>

                                <div>
                                    <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>Email Address</label>
                                    <div className='relative'>
                                        <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
                                            <Mail className='w-5 h-5' />
                                        </span>
                                        <input
                                            type='email'
                                            name='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='name@example.com'
                                            required
                                            className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
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
                                    <span>Reset Password</span>
                                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                                </LoadingButton>
                            </form>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/account/login')}
                                    className="w-full py-3 px-4 bg-[#1a1a24]/60 hover:bg-[#1a1a24] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                                >
                                    Remember password ?
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="success-container animate-in text-center py-4">
                            <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 text-[var(--special-purple)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Send size={32} />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight mb-2 text-gray-100">Check your email</h2>
                            <p className="text-sm text-gray-400 mb-8">
                                We've sent a password reset link to <strong className="text-white">{email}</strong>
                            </p>

                            <button
                                className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-xl transition-all text-sm cursor-pointer"
                                onClick={() => setSent(false)}
                            >
                                Try another email
                            </button>
                        </div>
                    )
                }

            </div>
            <Footer />
        </div>
    )
}

export default ForgotPassword