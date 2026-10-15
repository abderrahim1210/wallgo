import React, { useEffect, useState, type FC } from 'react'
import { MainLayout } from '../MainLayout'
import { FaCalendarAlt, FaCamera, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone, FaUserEdit, FaUsers, FaVenusMars } from 'react-icons/fa'
import { PostGrid } from '../templates/PostGrid'
import { Helmet } from 'react-helmet-async'
import { FiCalendar, FiHeart, FiMapPin } from 'react-icons/fi'
import { Users, VenusAndMars } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ModalTemplate from '../templates/ModalTemplate'
import { useModal } from '../hooks/ModalProvider'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EmptyContent } from './EmptyContent'
import { useAuth } from '../hooks/AuthProvider'
import toast from 'react-hot-toast'

interface User {
    id: number;
    name: string;
    username: string;
    bio?: string;
    email?: string;
    birth?: string;
    avatar_url?: string;
    banner_url?: string;
    phone?: number;
    status?: string;
    gender?: string;
    location?: string;
}



export const Profile = () => {
    const { id } = useParams();
    const api_url = 'https://api.wallgo.test';
    const navigate = useNavigate();
    const { show, openModal, closeModal } = useModal()!;
    const { user } = useAuth()!;
    const [follow, setFollow] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (id) {
            axios.get(`${api_url}/check_follow/${id}`, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success) setFollow(Boolean(res.data.is_followed));
            });
        }
    }, [id]);

    const fetchInfos = async () => {
        try {
            const url = id ? `${api_url}/get_user/${id}` : `${api_url}/get_user`;
            const res = await axios.get(url, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.log(err?.response?.message);
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['user_data'],
        queryFn: fetchInfos,
    });


    const profile: User = data?.user || null;
    const stats = data?.stats || [];
    const followers = data?.followers_list || [];
    const followings = data?.followings_list || [];
    const posts_list = data?.posts_list || [];

    // if (!profile) return <Navigate to="/account/login" replace />;
    if (isLoading) return <p>Loading ...</p>;
    // if (error) {
    //     console.log(error);
    //     return <p>Something went wrong.</p>;
    // }

    const add_follow = async (following_id: number) => {
        try {
            const res = await axios.post(`${api_url}/add_follow`, { following_id: following_id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setFollow(prev => !prev);
                queryClient.invalidateQueries({ queryKey: ['user_data', id] });
            }
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Profile</title>
            </Helmet>
            {
                show === 'followers' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        {
                            followers.length > 0 ? (<p>Followers</p>) : (<EmptyContent icon={<FaUsers />} text='No followers yet.' />)
                        }
                    </ModalTemplate>
                )
            }
            {
                show === 'followings' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        {
                            followings.length > 0 ? (<p>Followings</p>) : (<EmptyContent icon={<FaUsers />} text='No followings yet.' />)
                        }
                    </ModalTemplate>
                )
            }
            <div className="max-w-4xl mx-auto px-4 py-8 pb-20">

                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">

                    {
                        profile?.banner_url ? (
                            <div className="h-48 md:h-60 w-full rounded-xl overflow-hidden relative bg-gray-200">
                                <img
                                    src={profile?.banner_url}
                                    alt="Profile Banner"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        ) : (
                            <div className="h-48 md:h-60 w-full rounded-xl overflow-hidden relative bg-gray-500 flex justify-center items-center">
                                <FaCamera className='w-10 h-10 text-white' />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        )
                    }

                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col sm:flex-row justify-between shrink-0 items-start sm:items-end -mt-16 md:-mt-20 mb-4 gap-4">
                            <div className="flex items-end gap-4">
                                <img
                                    src={profile?.avatar_url ?? '/icons/avatar1.svg'}
                                    alt="Avatar"
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-md bg-white"
                                />
                                <div className="">
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        {profile?.name}
                                    </h1>
                                    <p className="text-sm font-medium text-gray-500">@{profile?.username}</p>
                                </div>
                            </div>
                            {
                                profile?.id === user?.id ? (
                                    <button onClick={() => navigate('/account/edit')} className="flex items-center font-semibold gap-2 px-5 py-2.5 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer shrink-0">
                                        <FaUserEdit className="w-4 h-4" /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => add_follow(Number(id))} className={`flex items-center justify-center gap-2 px-6 py-2.5 ${follow ? 'bg-fuchsia-50 border border-[var(--special-purple)] text-[var(--special-purple)]' : 'bg-[var(--special-purple)] text-white'} hover:opacity-90  rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer shrink-0`}>
                                            <span>{follow ? 'Followed' : 'Follow'}</span>
                                        </button>

                                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer shrink-0">
                                            <span>Message</span>
                                        </button>
                                    </div>
                                )
                            }

                        </div>

                        <p className="text-gray-600 text-sm max-w-2xl mb-6">
                            {profile?.bio}
                        </p>

                        <div className="flex items-center gap-6 py-4 border-y border-gray-100 mb-6 text-sm">
                            <div>
                                <span className="font-bold text-gray-900 text-base">{posts_list.length}</span> <span className="text-gray-500">Posts</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 text-base cursor-pointer" onClick={() => openModal('followers')}>{stats?.followers_count} </span><span className="text-gray-500">Followers </span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 text-base cursor-pointer" onClick={() => openModal('followings')}>{stats?.followings_count} </span> <span className="text-gray-500">Following</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            {
                                profile?.location && (
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <FiMapPin className="text-[var(--special-purple)] w-5 h-5" />
                                        <span>{profile.location}</span>
                                    </div>
                                )
                            }

                            {
                                profile?.birth && (
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <FiCalendar className="text-[var(--special-purple)] w-5 h-5" />
                                        <span>Born on {profile.birth}</span>
                                    </div>
                                )
                            }

                            {
                                profile?.status && (
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <FiHeart className="text-[var(--special-purple)] w-5 h-5" />
                                        <span className='capitalize'>{profile.status}</span>
                                    </div>
                                )
                            }
                            {
                                profile?.gender && (
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <FaVenusMars className="text-[var(--special-purple)] w-5 h-5" />
                                        <span className="capitalize">{profile.gender}</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <PostGrid posts={posts_list} />
                </div>

            </div>
        </MainLayout>
    )
}
