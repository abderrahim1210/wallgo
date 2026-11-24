import React, { useEffect, useRef, useState, type FC } from 'react'
import { MainLayout } from '../layouts/MainLayout'
import { FaCalendarAlt, FaCamera, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone, FaUserEdit, FaUsers, FaVenusMars } from 'react-icons/fa'
import { PostGrid } from '../templates/PostGrid'
import type { Post } from '../types'
import { Helmet } from 'react-helmet-async'
import { FiCalendar, FiHeart, FiMapPin } from 'react-icons/fi'
import { Edit3, FileText, Flag, Link, Lock, MoreHorizontal, Pencil, PlusSquare, Settings, Share, Share2, Trash2, Users, VenusAndMars } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ModalTemplate from '../templates/ModalTemplate'
import { useModal } from '../hooks/ModalProvider'
import axios from 'axios'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmptyContent } from '../components/EmptyContent'
import { useAuth } from '../hooks/AuthProvider'
import toast from 'react-hot-toast'
import { FollowUser } from '../components/FollowUser'
import { useFollow } from '../hooks/useFollow'
import Spinner from '../templates/Spinner'
import { Skeleton } from '../templates/Skeleton'
import { ErrorPage } from '../components/ErrorPage'
import { DropdownMenu, type DropdownItem } from '../templates/DropdownMenu'
import ShareDropdown from '../components/ShareDropdown'
import { Report } from '../components/Report'
import { useTranslation } from 'react-i18next'
import Gallery from '../templates/Gallery'

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
    is_following?: boolean;
    visibility: string;
    views_count: number;
}

export const Profile = () => {
    const { id } = useParams();
    const api_url = 'https://api.wallgo.test';
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { show, openModal, closeModal } = useModal()!;
    const { user } = useAuth()!;
    const [follow, setFollow] = useState(false);



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

    const fetchPosts = async () => {
        try {
            const url = id ? `${api_url}/get_posts/${id}` : `${api_url}/get_posts`;
            const res = await axios.get(url, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.posts;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['user_data', id],
        queryFn: fetchInfos,
    });

    const { data: ps, isLoading: postsLoading, isError: postsError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });
    const posts_list: Post[] = ps?.pages.flatMap((page: any) => page?.data || []) || [];



    const profile: User = data?.user;
    const stats = data?.stats || [];
    const followers = data?.followers_list || [];
    const followings = data?.followings_list || [];

    const { add_follow } = useFollow();
    const set_follow = (following_id: number) => {
        add_follow(following_id);
        setFollow(prev => !prev);
    }

    const postMenuItems: DropdownItem[] = [
        {
            label: t('profile.share_profile'),
            icon: <Share2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
            onClick: () => openModal(`share-${profile?.id}`),
        },

        {
            label: t('profile.report_profile'),
            icon: <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />,
            danger: true,
            onClick: () => openModal(`report-${profile?.id}`),
        },
    ];

    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const timer = setTimeout(() => {
                        incrementView(profile.id);
                        observer.disconnect();
                    }, 1500);

                    return () => clearTimeout(timer);
                }
            },
            { threshold: 0.5 }
        );

        if (profileRef.current) {
            observer.observe(profileRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [profile?.id]);

    const incrementView = async (profileId: number) => {
        try {
            await axios.post(`${api_url}/profiles/${profileId}/view`, {}, {
                withCredentials: true,
                withXSRFToken: true
            });
        } catch (err) {
            console.error("Failed to increment view", err);
        }
    }

    return (
        <MainLayout>
            <Helmet>
                <title>{t('common.profile')}</title>
            </Helmet>

            {
                show === 'followers' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        {
                            followers.length > 0 ? (
                                followers?.map((u: User) => (
                                    <FollowUser user={u} onFollow={add_follow} closeModal={closeModal} />
                                ))
                            ) : (<EmptyContent icon={<FaUsers />} text={t('profile.no_followers')} />)
                        }
                    </ModalTemplate>
                )
            }
            {
                show === `share-${profile?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ShareDropdown url={window.location.href} />
                    </ModalTemplate>
                )
            }

            {
                show === `report-${profile?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={profile?.id} type='user' />
                    </ModalTemplate>
                )
            }
            {
                show === 'followings' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        {
                            followings.length > 0 ? (
                                followings?.map((u: User) => (
                                    <FollowUser user={u} onFollow={add_follow} closeModal={closeModal} />
                                ))
                            ) : (<EmptyContent icon={<FaUsers />} text={t('profile.no_followings')} />)
                        }
                    </ModalTemplate>
                )
            }
            {
                isLoading ? (
                    <Skeleton type='profile' />
                ) : isError ? (
                    <div className='mt-10'>
                        <ErrorPage codeP='500' />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 py-8 pb-20" ref={profileRef}>
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                            {
                                <div className="h-48 md:h-60 w-full rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-700">
                                    <Gallery items={[{ src: profile?.banner_url ?? '/backgrounds/user_banner.svg', alt: t('common.profileBanner') }]}>
                                        {(openMedia) => (
                                            <button type="button" onClick={() => openMedia(0)} className="h-full w-full cursor-zoom-in" aria-label={t('common.profileBanner')}>
                                                <img src={profile?.banner_url ?? '/backgrounds/user_banner.svg'} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        )}
                                    </Gallery>
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            }
                            <div className="px-6 pb-6 relative">
                                <div className="flex flex-col sm:flex-row justify-between shrink-0 items-start sm:items-end -mt-16 md:-mt-20 mb-4 gap-4">
                                    <div className="flex items-end gap-4">
                                        <Gallery items={[{ src: profile?.avatar_url ?? '/icons/avatar1.svg', alt: t('common.avatar') }]}>
                                            {(openMedia) => (
                                                <button type="button" onClick={() => openMedia(0)} className="cursor-zoom-in rounded-full" aria-label={t('common.avatar')}>
                                                    <img src={profile?.avatar_url ?? '/icons/avatar1.svg'} alt="" className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-md dark:bg-gray-900 md:h-36 md:w-36" />
                                                </button>
                                            )}
                                        </Gallery>
                                        <div className="">
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                {profile?.name}
                                            </h1>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">@{profile?.username}</p>
                                        </div>
                                    </div>
                                    {
                                        user?.id === profile?.id ? (
                                            <div className='gap-1 flex  '>
                                                <button
                                                    onClick={() => navigate('/account/edit')}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.edit_account')}
                                                >
                                                    <Pencil className='w-5 h-5 text-[var(--special-purple)]' />
                                                </button>
                                                <button
                                                    onClick={() => navigate('/create_post')}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.create_post_for_profile')}
                                                >
                                                    <PlusSquare className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        openModal('pages')
                                                        navigate('/settings');
                                                    }}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.settings')}
                                                >
                                                    <Settings className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => set_follow(Number(id))} className={`flex items-center justify-center gap-2 px-6 py-2.5 ${follow ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-[var(--special-purple)] text-[var(--special-purple)]' : 'bg-[var(--special-purple)] text-white'} hover:opacity-90  rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer shrink-0`}>
                                                    <span>{follow ? t('profile.followed') : t('profile.follow')}</span>
                                                </button>

                                                <button type="button" onClick={() => profile?.id && navigate(`/messenger/${profile.id}`, { state: { id: profile.id } })} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer shrink-0">
                                                    <span>{t('profile.message')}</span>
                                                </button>
                                                <DropdownMenu
                                                    trigger={
                                                        <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center">
                                                            <MoreHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                        </button>
                                                    }
                                                    items={postMenuItems}
                                                />
                                            </div>
                                        )}

                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl mb-6">
                                    {profile?.bio}
                                </p>

                                <div className="flex items-center gap-6 py-4 border-y border-gray-100 dark:border-gray-800 mb-6 text-sm">
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{posts_list.length}</span> <span className="text-gray-500 dark:text-gray-400">{t('profile.posts')}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-base cursor-pointer" onClick={() => openModal('followers')}>{stats?.followers_count} </span><span className="text-gray-500 dark:text-gray-400">{t('profile.followers')}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-base cursor-pointer" onClick={() => openModal('followings')}>{stats?.followings_count} </span> <span className="text-gray-500 dark:text-gray-400">{t('profile.following')}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{profile?.views_count} </span> <span className="text-gray-500 dark:text-gray-400">{t('profile.visitors')}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    {
                                        profile?.location && (
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <FiMapPin className="text-[var(--special-purple)] w-5 h-5" />
                                                <span>{profile.location}</span>
                                            </div>
                                        )
                                    }

                                    {
                                        profile?.birth && (
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <FiCalendar className="text-[var(--special-purple)] w-5 h-5" />
                                                <span>{t('profile.born_on', { date: profile.birth })}</span>
                                            </div>
                                        )
                                    }

                                    {
                                        profile?.status && (
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <FiHeart className="text-[var(--special-purple)] w-5 h-5" />
                                                <span className='capitalize'>{t(`editProfile.${profile.status}`)}</span>
                                            </div>
                                        )
                                    }
                                    {
                                        profile?.gender && (
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                <FaVenusMars className="text-[var(--special-purple)] w-5 h-5" />
                                                <span className="capitalize">{t(`editProfile.${profile.gender}`)}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            {
                                !posts_list ? (
                                    <Spinner text={t('profile.wait_for_posts')} type='mini' />
                                ) : (
                                    posts_list?.length > 0 ? (
                                        <PostGrid isLoading={postsLoading} posts={posts_list} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
                                    ) : (profile?.visibility === 'private' && user?.id !== profile?.id) ? (
                                        <EmptyContent icon={<Lock />} text={t('auth.account_private')} />
                                    ) : (
                                        <EmptyContent icon={<FileText />} text={t('feed.noPostsYet')} />
                                    )
                                )
                            }
                        </div>

                    </div>

                )
            }
        </MainLayout>
    )
}
