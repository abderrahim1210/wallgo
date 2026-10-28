import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api_url } from '../pages/Auth/getUser';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/AuthProvider';
import { MainLayout } from '../MainLayout';
import { Helmet } from 'react-helmet-async';
import { PostGrid, type Post } from '../templates/PostGrid';
import { EmptyContent } from './EmptyContent';
import { Check, Flag, MoreHorizontal, Pencil, PlusSquare, Settings, Share2, Users } from 'lucide-react';
import { FaGlobe, FaLock, FaRegNewspaper } from 'react-icons/fa';
import { useFollowPG } from './useFollowPG';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import { PageSettings } from './PageSettings';
import { DropdownMenu, type DropdownItem } from '../templates/DropdownMenu';
import ShareDropdown from './ShareDropdown';
import { Report } from './Report';
import { Skeleton } from '../templates/Skeleton';
import { ErrorPage } from './ErrorPage';

export const GroupeProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) return <p>Id not found</p>

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`${api_url}/groups/${id}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${api_url}/groups/${id}/posts`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.posts;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['groups', id],
        queryFn: fetchGroup
    });


    const { data: ps, isLoading: postsLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['groups_posts', id],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const group = data?.group || null;
    const posts: Post[] = ps?.pages.flatMap((page: any) => page?.data || []) || [];

    const [followed, setFollowed] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setFollowed(data?.group?.is_followed);
        }
    }, [data]);

    const { user } = useAuth()!;

    const { handleFollow } = useFollowPG();
    const follow = () => {
        handleFollow(group?.id, 'group');
        setFollowed(prev => !prev);
    }

    const { show, openModal, closeModal } = useModal()!;

    const postMenuItems: DropdownItem[] = [
        {
            label: 'Share group',
            icon: <Share2 className="w-4 h-4 text-blue-500" />,
            onClick: () => openModal(`share-${group?.id}`),
        },

        {
            label: 'Report group',
            icon: <Flag className="w-4 h-4 text-red-500" />,
            danger: true,
            onClick: () => openModal(`report-${group?.id}`),
        },
    ]
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Group</title>
            </Helmet>

            {
                show === 'groups' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <PageSettings group_id={group?.id} type='Group' />
                    </ModalTemplate>
                )
            }

            {
                show === `share-${group?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ShareDropdown url={window.location.href} />
                    </ModalTemplate>
                )
            }

            {
                show === `report-${group?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={group?.id} type='group' />
                    </ModalTemplate>
                )
            }

            {
                isLoading ? (
                    <Skeleton type='profile' />
                ) : isError ? (
                    <ErrorPage codeP='500' />
                ) : (
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="h-48 w-full bg-gray-200 relative">
                                <img
                                    src={group?.banner_url ?? '/backgrounds/users_banner.svg'}
                                    alt={group?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="px-6 pb-6 relative">
                                <div className="flex justify-between items-end -mt-12 mb-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                                        <img
                                            src={group?.logo_url ?? "/icons/users.svg"}
                                            alt={group?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {
                                        user?.id === group?.owner.id ? (
                                            <div className='gap-1 flex  '>
                                                <button
                                                    onClick={() => navigate('/create_post')}
                                                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title='Create post for this page'
                                                >
                                                    <PlusSquare className='w-5 h-5 text-indigo-600' />
                                                </button>
                                                <button
                                                    onClick={() => openModal('groups')}
                                                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title='Create post for this page'
                                                >
                                                    <Settings className='w-5 h-5 text-indigo-600' />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/groups/${group?.id}/edit`)}
                                                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title='Create post for this page'
                                                >
                                                    <Pencil className='w-5 h-5 text-[var(--special-purple)]' />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-3'>
                                                <button
                                                    onClick={follow}
                                                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer flex items-center gap-2 ${followed
                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        : 'bg-[var(--special-purple)] text-white hover:opacity-90'
                                                        }`}
                                                >
                                                    {followed ? <><Check className="w-4 h-4" /> Joined</> : 'Join Group'}
                                                </button>
                                                <DropdownMenu
                                                    trigger={
                                                        <button className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition shadow-sm cursor-pointer flex items-center justify-center">
                                                            <MoreHorizontal className="w-5 h-5 text-indigo-600" />
                                                        </button>
                                                    }
                                                    items={postMenuItems}
                                                />
                                            </div>
                                        )
                                    }
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{group?.name}</h1>
                                    <div className='flex items-center gap-2 mt-1 mb-1'>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${group?.visibility === 'private'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                            }`}>
                                            {group?.visibility === 'private' ? <FaLock className="w-3 h-3" /> : <FaGlobe className="w-3 h-3" />}
                                            {group?.visibility} Group
                                        </span>
                                    </div>
                                    <p className='text-gray-500'>{group?.description}</p>
                                </div>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Users className="w-4 h-4 text-[var(--special-purple)]" />
                                        {group?.followers_count} Followers
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Group Posts</h2>
                            {posts && posts.length > 0 ? (
                                <PostGrid posts={posts} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} isLoading={isLoading} fetchNextPage={fetchNextPage} />
                            ) : (
                                <EmptyContent text=" This group hasn't posted anything yet." icon={<FaRegNewspaper />} />
                            )}
                        </div>
                    </div>
                )
            }
        </MainLayout>
    )
}
