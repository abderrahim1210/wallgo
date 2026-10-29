import React, { useState } from 'react'
import { MainLayout } from '../MainLayout'
import { FileText, Globe, Hash, Search, User, Users, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PostGrid, type Post } from '../templates/PostGrid';
import { api_url } from '../pages/Auth/getUser';
import Spinner from '../templates/Spinner';
import { ErrorPage } from './ErrorPage';
import { EmptyContent } from './EmptyContent';
import { FollowUser } from './FollowUser';
import { useFollow } from './useFollow';
import { PostCard } from '../pages/Post/PostCard';
import FollowUserCard from './FollowUserCard';
import type { Page } from './PageProfile';
import { PageCard } from './PageCard';
import type { Group } from './Groups';
import { GroupCard } from './GroupCard';

type User = {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
    followers_count?: number;
}

export const Discover = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [activeFilter, setActiveFilter] = useState('all');


    const fetchData = async () => {
        try {
            const res = await axios.get(`${api_url}/search`, { params: { type: activeFilter, term: searchQuery }, withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                return res.data;
            };
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    const { data: dt, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['searchs_posts', activeFilter, searchQuery],
        queryFn: fetchData,
        enabled: activeFilter.trim().length > 0,
        getNextPageParam: (lastPage: any) => {
            if (lastPage?.current_page < lastPage?.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const firstPage = dt?.pages?.[0] || {};

    const items = activeFilter === 'all'
        ? firstPage
        : (firstPage[activeFilter]?.data || firstPage[activeFilter] || []);

    const filters = [
        { id: 'all', label: 'All', icon: <Globe className="w-4 h-4" /> },
        { id: 'posts', label: 'Posts', icon: <FileText className="w-4 h-4" /> },
        { id: 'users', label: 'Users', icon: <User className="w-4 h-4" /> },
        { id: 'groups', label: 'Groups', icon: <Users className="w-4 h-4" /> },
        { id: 'pages', label: 'Pages', icon: <Users className="w-4 h-4" /> },
        { id: 'tags', label: 'Hashtags', icon: <Hash className="w-4 h-4" /> },
    ];
    const { add_follow } = useFollow()!;
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Discover</title>
            </Helmet>
            <div className="pb-20 md:pb-10">
                <div className="max-w-xl mx-auto mt-20 px-4">
                    <div className='flex justify-center flex-col items-center mb-3'>
                        <h1 className='font-bold text-4xl flex items-center gap-2'><Search className='w-8 h-8 text-[var(--special-purple)] transition hover:scale-110 hover:-rotate-6' /> Search Wallgo</h1>
                        <p className="text-sm text-gray-500 mt-1">Find posts, creators, groups, and hashtags</p>
                    </div>
                    <div className="relative">

                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts, tags, or creators..."
                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--special-purple)] transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-gray-400 hover:text-gray-600"
                            >
                                <X />
                            </button>
                        )}


                    </div>

                    <div className="flex items-center gap-2 mt-3 flex-wrap md:flex-nowrap justify-center pb-3 mb-6 scrollbar-none">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeFilter === filter.id
                                    ? 'bg-[var(--special-purple)] text-white shadow-sm'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.icon}
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {!searchQuery.trim() ? (
                        <EmptyContent text='Type to search' icon={<Search />} />
                    ) : isLoading ? (
                        <Spinner type='mini' text={`Fetching ${activeFilter} ...`} />
                    ) : isError ? (
                        <ErrorPage codeP='500' />
                    ) : items.length === 0 ? (
                        <EmptyContent text={`No ${activeFilter} found!`} icon={<Search />} />
                    ) : (
                        <div className="space-y-4">
                            {
                                activeFilter === 'posts' && <PostGrid posts={items as Post[]} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} isLoading={isLoading} />
                            }

                            {
                                activeFilter === 'users' && items?.map((u: User, index: number) => <FollowUser user={u} key={index} onFollow={add_follow} />)
                            }
                            {
                                activeFilter === 'pages' && items?.map((p: Page, index: number) => <PageCard page={p} key={index} />)
                            }
                            {
                                activeFilter === 'groups' && items?.map((g: Group, index: number) => <GroupCard group={g} key={index} />)
                            }
                            {
                                activeFilter === 'tags' && items?.map((tag: any) => (
                                    <div
                                        key={tag.id}
                                        onClick={() => {
                                            setSearchQuery(tag.term);
                                            setActiveFilter('posts');
                                        }}
                                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer shadow-xs"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[var(--special-purple)] font-bold">
                                                <Hash className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-800">#{tag.term}</h4>
                                                <p className="text-xs text-gray-400">{tag.searchs_count} searches</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-[var(--special-purple)]">Explore</span>
                                    </div>
                                ))
                            }
                            {
                                activeFilter === 'all' && (
                                    <div className="space-y-6">
                                        {items?.users?.data?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Users</h3>
                                                <div className="space-y-2">
                                                    {items?.users?.data.map((u: User) => <FollowUser user={u} key={u.id} onFollow={add_follow} />)}
                                                </div>
                                            </div>
                                        )}

                                        {items?.posts?.data?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Posts</h3>
                                                <PostGrid posts={items?.posts?.data} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isLoading={isLoading} />
                                            </div>
                                        )}

                                        {items?.pages?.data?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Pages</h3>
                                                {
                                                    items?.pages?.data?.map((p: Page, index: number) => <PageCard page={p} key={index} />)
                                                }
                                            </div>
                                        )}

                                        {items?.groups?.data?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Groups</h3>
                                                {
                                                    items?.groups?.data?.map((g: Group, index: number) => <GroupCard group={g} key={index} />)
                                                }
                                            </div>
                                        )}

                                        {(!items?.users?.data?.length && !items?.posts?.data?.length && !items?.pages?.data?.length && !items?.groups?.data?.length) && (
                                            <EmptyContent text={`No results found for "${searchQuery}"`} icon={<Search />} />
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>

            {selectedPost && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-150">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="md:w-1/2 bg-black flex items-center justify-center">
                            <img src={selectedPost.image} alt="Detail" className="max-h-[400px] w-full object-contain" />
                        </div>

                        <div className="md:w-1/2 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                                    <img src={selectedPost.author.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900">{selectedPost.author.name}</h4>
                                        <p className="text-xs text-gray-500">@{selectedPost.author.username}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed mb-4">{selectedPost.content}</p>
                            </div>

                            <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                                <span className="flex items-center space-x-1 text-red-500">❤️ {selectedPost.likes} Likes</span>
                                <span className="flex items-center space-x-1 text-purple-500">💬 {selectedPost.comments} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}
