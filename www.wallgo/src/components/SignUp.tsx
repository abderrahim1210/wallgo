import { ArrowRight, AtSign, Lock, Mail, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Footer } from '../layouts/Footer';
import { Link } from 'react-router-dom';

export const SignUp = () => {
    const [formData,setFormData] = useState({
        name:'',
        username:'',
        email:'',
        day:'',
        month:'',
        year:'',
        
    });
    const slogans : string[] = [
        "Sign up to start exploring amazing art.",
        "Discover breathtaking digital photography.",
        "Where every pixel tells a unique story.",
        "Share your creative vision with the world.",
    ];

    const [currentIndex,setCurrentIndex] = useState(0);
    const [fade,setFade] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % slogans.length);
                setFade(true);
            },300);
        },5000);
        return () => clearInterval(interval);
    },[slogans.length]);
    return (
        <div className='signup_page min-h-screen flex flex-col justify-between'>
            <div className='flex-grow flex items-center justify-center p-4 py-10'>
                <div className='w-full max-w-lg  border rounded-3xl shadow-2xl p-10'>
                    <div className='flex items-center justify-center'>
                        <img src="/icons/logo_global.png" width={150} className='img-fluid' alt="" />
                    </div>
                    <div className='h-8 flex items-center justify-center mt-2 mb-5 overflow-hidden'>
                        <p className={`text-gray-300 text-sm text-center typewriter-text transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                            {slogans[currentIndex]}
                        </p>
                    </div>
                    <form className='space-y-5'>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>Full Name</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
                                    <User className='w-5 h-5' />
                                </span>
                                <input
                                    type='text'
                                    name='name'
                                    // value={formData.name}
                                    // onChange={handleChange}
                                    placeholder='Your full name'
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>User Name</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
                                    <AtSign className='w-5 h-5' />
                                </span>
                                <input
                                    type='text'
                                    name='username'
                                    // value={formData.name}
                                    // onChange={handleChange}
                                    placeholder='Username'
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>Birthday</label>
                            <div className='grid grid-cols-3 gap-3'>
                                <select
                                    name='day'
                                    className='w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all cursor-pointer'
                                >
                                    <option value='' className='bg-[#0f172a] text-gray-400'>Day</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1} className='bg-[#0f172a] text-white'>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name='month'
                                    className='w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all cursor-pointer'
                                >
                                    <option value='' className='bg-[#0f172a] text-gray-400'>Month</option>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, index) => (
                                        <option key={index + 1} value={index + 1} className='bg-[#0f172a] text-white'>
                                            {m}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name='year'
                                    className='w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all cursor-pointer'
                                >
                                    <option value='' className='bg-[#0f172a] text-gray-400'>Year</option>
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
                            <label className='block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider'>Email Address</label>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400'>
                                    <Mail className='w-5 h-5' />
                                </span>
                                <input
                                    type='email'
                                    name='email'
                                    // value={formData.email}
                                    // onChange={handleChange}
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
                                    // value={formData.password}
                                    // onChange={handleChange}
                                    placeholder='••••••••'
                                    required
                                    className='w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--special-purple)] focus:ring-1 focus:ring-[var(--special-purple)] transition-all text-sm'
                                />
                            </div>
                        </div>
                        {/* Terms & Info Text (Instagram Style) */}
                        <div className='text-xm text-semibold text-gray-400 space-y-3 font-semibold leading-relaxed'>
                            <p>
                                People who use our service may have uploaded your contact information to WallGo. <Link to='#' className='text-[var(--special-purple)] hover:underline'>Learn more</Link>.
                            </p>
                            <p>
                                By tapping Create Account, you agree to our <Link to='#' className='text-[var(--special-purple)] hover:underline'>Terms</Link>, <Link to='#' className='text-[var(--special-purple)] hover:underline'>Privacy Policy</Link> and <Link to='#' className='text-[var(--special-purple)] hover:underline'>Cookies Policy</Link>.
                            </p>
                        </div>

                        <button
                            type='submit'
                            className='w-full mt-2 py-3 px-4 bg-[var(--special-purple)] hover:bg-opacity-95 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer'
                        >
                            <span>Create Account</span>
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}
