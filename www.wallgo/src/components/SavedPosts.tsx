import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../MainLayout';
import { PostGrid } from '../templates/PostGrid';
import { FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from '../templates/Skeleton';
import { ErrorPage } from './ErrorPage';
import { useState } from 'react';
import PostsGrid from '../templates/PostsGrid';
import { useTranslation } from 'react-i18next';

const SavedPosts = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'reels' | 'posts'>('posts');
    const fetchPosts = async ({ pageParam = 1 }) => {
        try {
            const res = await axios.get(`${api_url}/posts/saved?page=${pageParam}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                if (activeTab === 'posts') {
                    return res.data.posts;
                }
                if (activeTab === 'reels') {
                    return res.data.reels;
                }
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: ps, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['posts_saved', activeTab],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    const posts = ps?.pages.flatMap((page: any) => page?.data || []) || [];
    return (
        <MainLayout>
            <Helmet>
                <title>{t('profile.saved_posts')}</title>
            </Helmet>


            {
                isLoading ? (
                    <Skeleton type='bookmark' />
                ) : isError ? (
                    <div className='mt-10'>
                        <ErrorPage codeP='500' />
                    </div>
                ) : (
                    <div className='max-w-2xl mx-auto px-4 py-6'>
                        <div className='flex justify-start items-center'>
                            <h1 className='font-bold text-3xl flex items-center gap-2'><FaBookmark className='w-8 h-8 text-[var(--special-purple)]' /> {t('profile.saved_posts')} <span className='text-[var(--special-purple)]'>({posts.length})</span></h1>
                        </div>
                        <div className='flex space-x-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-3 mt-3'>
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-bold transition ${activeTab === 'posts' ? 'bg-[var(--special-purple)] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {t('feed.posts')}
                            </button>
                            <button
                                onClick={() => setActiveTab('reels')}
                                className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-bold transition ${activeTab === 'reels' ? 'bg-[var(--special-purple)] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {t('common.reels')}
                            </button>
                        </div>
                        <div className='mt-3'>
                            {
                                activeTab === 'posts' ? (
                                    <PostGrid posts={posts} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} isLoading={isLoading} />
                                ) : (
                                    <PostsGrid data={posts} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} isLoading={isLoading} />
                                )
                            }
                        </div>
                    </div>
                )
            }

        </MainLayout>
    )
}

export default SavedPosts