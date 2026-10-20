import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../MainLayout';
import { PostGrid, type Post } from '../templates/PostGrid';
import { Check, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useQuery } from '@tanstack/react-query';
import { EmptyContent } from './EmptyContent';
import { FaRegNewspaper } from 'react-icons/fa';
import { useAuth } from '../hooks/AuthProvider';

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
    if (!id) return <p>Id not found</p>;

    const fetchPage = async () => {
        try {
            const res = await axios.get(`${api_url}/pages/${id}`, { withCredentials: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data } = useQuery({
        queryKey: ['page', id],
        queryFn: fetchPage
    });

    const page = data?.page || null;

    const [followed, setFollowed] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setFollowed(data?.page?.is_followed);
        }
    }, [data]);

    const { user } = useAuth()!;

    const handleFollow = async () => {
        try {
            const res = await axios.post(`${api_url}/pages/follow`, { type: 'page', page_id: page?.id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setFollowed(prev => !prev);
            } else {
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Page</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="h-48 w-full bg-gray-200 relative">
                        <img
                            src={page?.banner_url ?? '/backgrounds/users_banner.svg'}
                            alt={page?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="px-6 pb-6 relative">
                        <div className="flex justify-between items-end -mt-12 mb-4">
                            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                                <img
                                    src={page?.logo_url ?? "/icons/avatar1.svg"}
                                    alt={page?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {
                                user?.id === page?.owner.id ? (
                                    <button
                                        onClick={() => navigate(`/pages/${page?.id}/edit`)}
                                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer flex items-center gap-2 ${page?.is_followed
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-[var(--special-purple)] text-white hover:opacity-90'
                                            }`}
                                    >
                                        Edit Page
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer flex items-center gap-2 ${followed
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-[var(--special-purple)] text-white hover:opacity-90'
                                            }`}
                                    >
                                        {followed ? <><Check className="w-4 h-4" /> Following</> : 'Follow Page'}
                                    </button>
                                )
                            }
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{page?.name}</h1>
                            <p className="text-sm capitalize text-gray-500">{page?.category}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Users className="w-4 h-4 text-[var(--special-purple)]" />
                                {page?.followers_count} Followers
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Page Posts</h2>
                    {page?.posts && page.posts.length > 0 ? (
                        <PostGrid posts={page.posts} />
                    ) : (
                        <EmptyContent text=" This page hasn't posted anything yet." icon={<FaRegNewspaper />} />
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
