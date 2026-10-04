import { ArrowRight, Lock, Mail } from 'lucide-react';
import React, { useState, type ChangeEvent } from 'react'
import { Footer } from '../../layouts/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const api_url = import.meta.env.VITE_API_URL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            console.log("Email and password is obligatory");
        }

        try {
            await axios.post(api_url).then(res => {
                if (!res.data.success) {
                    setError(res.data.message);
                }
            });
        } catch (err) {
            console.log(error);
        }
    }
    return (
        <div className='signup_page min-h-screen flex flex-col justify-between'>
            <div className='flex-grow flex items-center justify-center p-4 py-10'>
                <div className='w-full max-w-lg  border rounded-3xl shadow-2xl p-10'>
                    <div className='flex items-center justify-center'>
                        <img src="/icons/logo_global.png" width={150} className='img-fluid' alt="" />
                    </div>
                    <div className='h-8 flex items-center justify-center mt-2 mb-5 overflow-hidden'>
                        <p className={`text-gray-300 text-sm text-center typewriter-text`}>
                            Welcome back. Jump back into the feed
                        </p>
                    </div>
                    <form className='space-y-5' onSubmit={handleSubmit}>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>Email Address</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
                                    <Mail className='w-5 h-5' />
                                </span>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='name@example.com'
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>Password</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
                                    <Lock className='w-5 h-5' />
                                </span>
                                <input
                                    type='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder='••••••••'
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='w-full mt-2 py-3 px-4 bg-[var(--special-purple)] hover:bg-opacity-95 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer'
                        >
                            <span>Log In</span>
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </button>
                    </form>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="w-full py-3 px-4 bg-[#1a1a24]/60 hover:bg-[#1a1a24] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
                        >
                            Don't have an account ?
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
