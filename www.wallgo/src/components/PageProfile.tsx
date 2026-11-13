import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../MainLayout';
import { PostGrid, type Post } from '../templates/PostGrid';
import { Check, Clapperboard, Flag, MoreHorizontal, Pencil, PlusIcon, PlusSquare, Settings, Share2, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { EmptyContent } from './EmptyContent';
import { FaRegNewspaper } from 'react-icons/fa';
import { useAuth } from '../hooks/AuthProvider';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import { PageSettings } from './PageSettings';
import { useFollowPG } from './useFollowPG';
import { Skeleton } from '../templates/Skeleton';
import { ErrorPage } from './ErrorPage';
import { DropdownMenu, type DropdownItem } from '../templates/DropdownMenu';
import ShareDropdown from './ShareDropdown';
import { Report } from './Report';
import { useTranslation } from 'react-i18next';
import type { Reel } from './CreateReel';
import PostsGrid from '../templates/PostsGrid';

export interface Page {
    id: number;
    owner_id: number;
    owner: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    }
    name: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    created_at: string;
    followers_count: number;
    is_followed: boolean;
    posts: Post[]
}

export const PageProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    if (!id) return <p>{t('profile.page_not_found')}</p>;

    const fetchPage = async () => {
        try {
            const res = await axios.get(`${api_url}/pages/${id}`, { withCredentials: true });
            if (res.data.success) return res.data.page;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const fetchPosts = async ({ pageParam = 1 }) => {
        try {
            const res = await axios.get(`${api_url}/pages/${id}/posts?page=${pageParam}`, { withCredentials: true });
            if (res.data.success) return res.data.posts;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const fetchReels = async ({ pageParam = 1 }) => {
        try {
            const res = await axios.get(`${api_url}/pages/${id}/reels?page=${pageParam}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.reels;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: page, isLoading: pageLoading, isError: pageError, } = useQuery({
        queryKey: ['page', id],
        queryFn: fetchPage,
    });

    const { data: ps, isLoading: postsLoading, isError: postsErrors, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['posts_pages', id],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage: any) => {
            if (lastPage?.current_page < lastPage?.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const { data: rls, isLoading: reelsLoading, isError: reelsError, isFetchingNextPage: isFetchingNextPageReels, hasNextPage: hasNextPageReels, fetchNextPage: fetchNextPageReels } = useInfiniteQuery({
        queryKey: ['reels_pages', id],
        queryFn: fetchReels,
        getNextPageParam: (lastPage: any) => {
            if (lastPage?.current_page < lastPage?.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const posts: Post[] = ps?.pages.flatMap((page: any) => page?.data || []) || [];
    const reels: Reel[] = rls?.pages.flatMap((page: any) => page?.data || []) || [];
    const videos = posts?.filter(p => p?.media_url?.includes('video')) || [];

    const [followed, setFollowed] = useState<boolean>(false);

    useEffect(() => {
        if (page?.is_followed) {
            setFollowed(page.is_followed);
        }
    }, [page?.id]);

    const { user } = useAuth()!;

    const { handleFollow } = useFollowPG();

    const follow = () => {
        handleFollow(page?.id, 'page');
        setFollowed(prev => !prev);
    }

    const { show, openModal, closeModal } = useModal()!;
    const postMenuItems: DropdownItem[] = [
        {
            label: t('profile.share_page'),
            icon: <Share2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
            onClick: () => openModal(`share-${page?.id}`),
        },

        {
            label: t('profile.report_page'),
            icon: <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />,
            danger: true,
            onClick: () => openModal(`report-${page?.id}`),
        },
    ];

    const createOptions = [
        {
            label: t('profile.create_post_for_page'),
            icon: <PlusIcon className="w-4 h-4 text-[var(--special-purple)]" />,
            onClick: () => { navigate('/create_post', { state: { pageId: page?.id, contentGroup: '', pageName: page?.name } }) },
        },
        {
            label: t('profile.create_reel_for_page'),
            icon: <Clapperboard className="w-4 h-4 text-[var(--special-purple)]" />,
            onClick: () => { navigate('/create_reel', { state: { pageId: page?.id, pageName: page?.name } }) },
        },
    ];

    const [activeTab, setActiveTab] = useState<'posts' | 'videos' | 'reels' | 'about'>('posts');
    return (
        <MainLayout>
            <Helmet>
                <title>{t('common.pages')}</title>
            </Helmet>

            {
                show === 'pages' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <PageSettings page_id={page?.id} type='Page' />
                    </ModalTemplate>
                )
            }

            {
                show === `share-${page?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ShareDropdown url={window.location.href} />
                    </ModalTemplate>
                )
            }

            {
                show === `report-${page?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={page?.id} type='page' />
                    </ModalTemplate>
                )
            }

            {
                pageLoading ? (
                    <Skeleton type='profile' />
                ) : pageError ? (
                    <div className='mt-10'>
                        <ErrorPage codeP='500' />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 relative">
                                <img
                                    src={page?.banner_url ?? '/backgrounds/users_banner.svg'}
                                    alt={page?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="px-6 pb-6 relative">
                                <div className="flex justify-between items-end -mt-12 mb-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white dark:bg-gray-900">
                                        <img
                                            src={page?.logo_url ?? "/icons/users.svg"}
                                            alt={page?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {
                                        user?.id === page?.owner.id ? (
                                            <div className='gap-1 flex  '>
                                                <DropdownMenu
                                                    trigger={
                                                        <button
                                                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                            title={t('profile.create_post_for_group')}
                                                        >
                                                            <PlusSquare className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                                        </button>
                                                    }
                                                    items={createOptions}
                                                />
                                                <button
                                                    onClick={() => openModal('pages')}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.settings')}
                                                >
                                                    <Settings className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/pages/${page?.id}/edit`)}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.edit_page')}
                                                >
                                                    <Pencil className='w-5 h-5 text-[var(--special-purple)]' />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-3'>
                                                <button
                                                    onClick={follow}
                                                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer flex items-center gap-2 ${followed
                                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        : 'bg-[var(--special-purple)] text-white hover:opacity-90'
                                                        }`}
                                                >
                                                    {followed ? <><Check className="w-4 h-4" /> {t('profile.following')}</> : t('profile.follow_page')}
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
                                        )
                                    }
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{page?.name}</h1>
                                    <p className="text-sm capitalize text-gray-500 dark:text-gray-400">{page?.category}</p>
                                </div>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Users className="w-4 h-4 text-[var(--special-purple)]" />
                                        {page?.followers_count} {t('profile.followers')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className='flex space-x-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-3 mt-3'>
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-bold transition ${activeTab === 'posts' ? 'bg-[var(--special-purple)] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    {t('profile.posts')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('reels')}
                                    className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-bold transition ${activeTab === 'reels' ? 'bg-[var(--special-purple)] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    {t('profile.reels')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('videos')}
                                    className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-bold transition ${activeTab === 'videos' ? 'bg-[var(--special-purple)] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    {t('profile.videos')}
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 capitalize">{activeTab}</h2>

                            <div className="space-y-4">
                                {
                                    activeTab === 'posts' && (
                                        <div className="space-y-6">
                                            {posts?.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">{t('discover.filters.posts')}</h3>
                                                    <PostGrid posts={posts} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isLoading={postsLoading} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                {
                                    activeTab === 'reels' && (
                                        <div className='space-y-6'>
                                            {reels?.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">{t('discover.filters.reels')}</h3>
                                                    <PostsGrid data={reels} isFetchingNextPage={isFetchingNextPageReels} hasNextPage={hasNextPageReels} fetchNextPage={fetchNextPageReels} isLoading={reelsLoading} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                {
                                    activeTab === 'videos' && (
                                        <div className="space-y-6">
                                            {posts?.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">{t('discover.filters.videos')}</h3>
                                                    <PostGrid posts={videos} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isLoading={postsLoading} />
                                                </div>
                                            )}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </MainLayout>
    )
}
