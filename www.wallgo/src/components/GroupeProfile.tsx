import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { api_url } from '../pages/Auth/getUser';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/AuthProvider';
import { MainLayout } from '../MainLayout';
import { Helmet } from 'react-helmet-async';
import { PostGrid, type Post } from '../templates/PostGrid';
import { EmptyContent } from './EmptyContent';
import { Check, Clapperboard, Flag, Lock, MoreHorizontal, Pencil, PlusIcon, PlusSquare, Settings, Share2, Timer, User, Users, X } from 'lucide-react';
import { FaGlobe, FaLock, FaRegNewspaper } from 'react-icons/fa';
import { useFollowPG } from './useFollowPG';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import { PageSettings } from './PageSettings';
import { DropdownMenu, type DropdownItem } from '../templates/DropdownMenu';
import ShareDropdown from './ShareDropdown';
import { Report } from './Report';
import { Skeleton } from '../templates/Skeleton';
import { useTranslation } from 'react-i18next';
import { ErrorPage } from './ErrorPage';
import toast from 'react-hot-toast';
import LoadingButton from '../Icons/LoadingButton';
import FollowUserCard from './FollowUserCard';
import { FollowUser } from './FollowUser';
import { ReelGrid } from '../templates/ReelGrid';
import type { Reel } from './CreateReel';
import PostsGrid from '../templates/PostsGrid';
// import type { User } from './Home';

export const GroupeProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
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

    const fetchReels = async () => {
        try {
            const res = await axios.get(`${api_url}/groups/${id}/reels`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.reels;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['group', id],
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
    
    const { data: rls, isLoading:reelsLoading, hasNextPage:hasNextPageReels, fetchNextPage:fetchNextPageReels, isFetchingNextPage:isFetchingNextPageReels } = useInfiniteQuery({
        queryKey: ['groups_reels', id],
        queryFn: fetchReels,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const group = data?.group || null;
    const question = data?.question?.question || '';
    const isJoined = data?.is_joined;
    const posts: Post[] = ps?.pages.flatMap((page: any) => page?.data || []) || [];
    const reels: Reel[] = rls?.pages.flatMap((page: any) => page?.data || []) || [];

    const [followed, setFollowed] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setFollowed(data?.group?.is_followed);
        }
    }, [data]);

    const { user } = useAuth()!;

    const [answer, setAnswer] = useState('');
    const { handleFollow } = useFollowPG();

    const send_request = async () => {
        if (answer === '') return null;
        try {
            const res = await axios.post(`${api_url}/send_request`, { answer: answer, group_id: group?.id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                queryClient.invalidateQueries({ queryKey: ['status_group', group?.id] });
                toast.success(res.data.message || t('profile.request_sent_successfully'));
                setTimeout(() => {
                    closeModal?.();
                }, 1000);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { show, openModal, closeModal } = useModal()!;

    const postMenuItems: DropdownItem[] = [
        {
            label: t('profile.share_group'),
            icon: <Share2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
            onClick: () => openModal(`share-${group?.id}`),
        },

        {
            label: t('profile.report_group'),
            icon: <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />,
            danger: true,
            onClick: () => openModal(`report-${group?.id}`),
        },
    ]

    const [write, isWrite] = useState(false);
    const [content, setContent] = useState('');

    const checkWrite = (e: React.ChangeEvent<HTMLInputElement>) => {
        isWrite(e.target.value.trim().length > 0);
        setContent(e.target.value);
    }

    const [loading, setLoading] = useState(false);

    const follow = () => {
        handleFollow(group?.id, 'group');
        queryClient.invalidateQueries({ queryKey: ['group', id] });
        setFollowed(prev => !prev);
    }

    const fetchStatus = async () => {
        try {
            const res = await axios.get(`${api_url}/check_follow_group`, { params: { group_id: group?.id }, withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.status;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: status } = useQuery({
        queryKey: ['status_group', group?.id],
        queryFn: fetchStatus
    });

    const fetchFollowers = async () => {
        try {
            const res = await axios.get(`${api_url}/groups/${group?.id}/followers`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.followers;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: followersList } = useQuery({
        queryKey: ['groups-followers', group?.id],
        queryFn: fetchFollowers
    });

    const removeMember = async (id: number) => {
        if (!id) return null;
        setLoading(true);
        try {
            const res = await axios.delete(`${api_url}/groups/${group?.id}/remove_member/${id}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || t('profile.member_removed_successfully'));
                queryClient.invalidateQueries({ queryKey: ['groups-followers', group?.id] });
            } else {
                setLoading(false);
                toast.error(res.data.message || t('profile.something_went_wrong'));
                console.log(res.data.message);
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response.data);
        }
    }

    const createOptions = [
        {
            label: t('profile.create_post_for_group'),
            icon: <PlusIcon className="w-4 h-4 text-[var(--special-purple)]" />,
            onClick: () => { navigate('/create_post', { state: { groupId: group?.id, contentGroup: '', groupName:group?.name } }) },
        },
        {
            label: t('profile.create_reel_for_group'),
            icon: <Clapperboard className="w-4 h-4 text-[var(--special-purple)]" />,
            onClick: () => { navigate('/create_reel', { state: { groupId: group?.id, groupName: group?.name } }) },
        },
    ];
    const [activeTab, setActiveTab] = useState('posts');
    return (
        <MainLayout>
            <Helmet>
                <title>{t('profile.group_title', { name: group?.name ?? '' })}</title>
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
                show === `join-${group?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <div className='mt-5 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='px-2.5 py-1 text-xs font-semibold text-[var(--special-purple)] bg-indigo-50 dark:bg-indigo-950/40 rounded-lg'>
                                    {t('profile.group_question')}
                                </span>
                            </div>

                            <h4 className='font-semibold text-gray-900 dark:text-gray-100 text-[18px] mb-1'>
                                {t('profile.answer_join_question', { name: group?.name ?? '' })}
                            </h4>
                            <p className='text-gray-600 dark:text-gray-400 text-sm mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-800'>
                                {question}
                            </p>

                            <div className='space-y-3 mb-5'>
                                <label className='flex items-center justify-between p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all cursor-pointer group'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-[var(--special-purple)] flex items-center justify-center transition-colors'>
                                            <input
                                                name='answer'
                                                type="radio"
                                                value="Yes"
                                                onChange={(e) => setAnswer(e.target.value)}
                                                className='peer sr-only'
                                            />
                                            <div className='w-2.5 h-2.5 rounded-full bg-[var(--special-purple)] opacity-0 peer-checked:opacity-100 transition-opacity'></div>
                                        </div>
                                        <span className='font-medium text-gray-800 dark:text-gray-200 text-sm'>{t('profile.yes_i_agree')}</span>
                                    </div>
                                </label>

                                <label className='flex items-center justify-between p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-[var(--special-purple)] hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all cursor-pointer group'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-[var(--special-purple)] flex items-center justify-center transition-colors'>
                                            <input
                                                name='answer'
                                                type="radio"
                                                value="No"
                                                onChange={(e) => setAnswer(e.target.value)}
                                                className='peer sr-only'
                                            />
                                            <div className='w-2.5 h-2.5 rounded-full bg-indigo-600 opacity-0 peer-checked:opacity-100 transition-opacity'></div>
                                        </div>
                                        <span className='font-medium text-gray-800 dark:text-gray-200 text-sm'>{t('profile.no')}</span>
                                    </div>
                                </label>
                            </div>

                            <div className='flex justify-end gap-3'>
                                <LoadingButton
                                    type="button"
                                    onClick={() => {
                                        send_request();
                                        setTimeout(() => {
                                            closeModal?.();
                                        }, 1000);
                                    }}
                                    className='px-5 py-2.5 rounded-xl font-semibold text-sm bg-[var(--sepcial-purple)] text-white shadow-sm shadow-indigo-200 transition-all active:scale-95'
                                >
                                    {t('profile.submit_answer_join')}
                                </LoadingButton>
                            </div>
                        </div>
                    </ModalTemplate>
                )
            }

            {
                show === `followers-group-${group?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <div>
                            {
                                followersList?.length > 0 ? followersList.map((user: { id: number; username: string; name: string; avatar_url: string; }) => (
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={user?.avatar_url || '/icons/avatar1.svg'}
                                                alt={user?.name}
                                                className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-800 flex-shrink-0"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate hover:underline cursor-pointer" onClick={() => null}>
                                                    {user?.name}
                                                </h4>
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    @{user?.username}
                                                </span>
                                            </div>
                                        </div>

                                        {
                                            user?.id !== group?.owner_id && (
                                                <button
                                                    disabled={loading}
                                                    onClick={() => removeMember(user.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    {loading ? t('profile.removing_member') : t('profile.remove_member')}
                                                </button>
                                            )
                                        }
                                    </div>
                                )) : (
                                    <EmptyContent text={t('profile.no_followers_group')} icon={<User />} />
                                )
                            }
                        </div>
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
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 relative">
                                <img
                                    src={group?.banner_url ?? '/backgrounds/users_banner.svg'}
                                    alt={group?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="px-6 pb-6 relative">
                                <div className="flex justify-between items-end -mt-12 mb-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white dark:bg-gray-900">
                                        <img
                                            src={group?.logo_url ?? "/icons/users.svg"}
                                            alt={group?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {
                                        user?.id === group?.owner.id ? (
                                            <div className='gap-1 flex'>
                                                <button
                                                    onClick={() => navigate('/create_post')}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.create_post_for_group')}
                                                >
                                                    <PlusSquare className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                                </button>
                                                <button
                                                    onClick={() => openModal('groups')}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.settings')}
                                                >
                                                    <Settings className='w-5 h-5 text-indigo-600 dark:text-indigo-400' />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/groups/${group?.id}/edit`)}
                                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition shadow-sm cursor-pointer flex items-center justify-center"
                                                    title={t('profile.edit_group')}
                                                >
                                                    <Pencil className='w-5 h-5 text-[var(--special-purple)]' />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-3'>
                                                {
                                                    isJoined && (
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
                                                    )
                                                }
                                                {
                                                    (status && status !== 'accepted') ? (
                                                        <button
                                                            onClick={() => {
                                                                if (!status) {
                                                                    openModal(`join-${group?.id}`)
                                                                }
                                                            }}
                                                            className={`px-6 py-2.5 rounded-xl font-semibold capitalize text-sm transition shadow-sm cursor-pointer flex items-center gap-2 ${status === 'pending' ? 'bg-amber-300 dark:bg-amber-700' : status === 'accepted' ? 'bg-green-300 dark:bg-green-700' : 'bg-red-400 dark:bg-red-700'}`}
                                                        >
                                                            {status === 'pending' ? <Timer className="w-4 h-4" /> : <X className='w-4 h-4' />} {t('profile.request_status', { status: t(`profile.status.${status}`) })}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                if (isJoined) {
                                                                    follow();
                                                                } else {
                                                                    openModal(`join-${group?.id}`)
                                                                }
                                                            }}
                                                            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm cursor-pointer flex items-center gap-2 ${followed
                                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                                : 'bg-[var(--special-purple)] text-white hover:opacity-90'
                                                                }`}
                                                        >
                                                            {(followed) ? t('profile.joined') : t('profile.join_group')}
                                                        </button>
                                                    )
                                                }
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
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{group?.name}</h1>
                                    <div className='flex items-center gap-2 mt-1 mb-1'>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${group?.visibility === 'private'
                                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/50'
                                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/50'
                                            }`}>
                                            {group?.visibility === 'private' ? <FaLock className="w-3 h-3" /> : <FaGlobe className="w-3 h-3" />}
                                            {t('profile.visibility_group', { visibility: group?.visibility === 'private' ? t('feed.private') : t('feed.public') })}
                                        </span>
                                    </div>
                                    <p className='text-gray-500 dark:text-gray-400'>{group?.description}</p>
                                </div>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5 font-medium cursor-pointer" onClick={() => openModal(`followers-group-${group?.id}`)}>
                                        <Users className="w-4 h-4 text-[var(--special-purple)]" />
                                        {group?.followers_count} {t('profile.followers')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            {
                                isJoined && (
                                    <div className='flex items-center space-x-3 flex-1 min-w-0 mt-3 m-3'>
                                        <img
                                            src={user?.avatar_url ?? '/icons/avatar1.svg'}
                                            alt={t('common.avatar')}
                                            className="w-10 h-10 rounded-full object-cover shrink-0"
                                        />
                                        <div className="relative flex-1 flex items-center space-x-2 min-w-0">
                                            <input
                                                name='content'
                                                value={content}
                                                type="text"
                                                placeholder={t('feed.whatsOnYourMind', { username: user?.username ?? '' })}
                                                onChange={checkWrite}
                                                className="w-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--special-purple)] transition-all rounded-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-gray-700"
                                            />
                                            {
                                                write && (
                                                    <LoadingButton loading={loading} className='px-5 py-2.5 bg-[var(--special-purple)] text-white text-sm font-medium rounded-full hover:opacity-90 transition-all shadow-sm cursor-pointer animate-fadeIn font-semibold shrink-0' onClick={() => navigate('/create_post', { state: { groupId: group?.id, contentGroup: content } })}>
                                                        {t('feed.post')}
                                                    </LoadingButton>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('profile.group_posts')}</h2>
                            {
                                (!isJoined && group?.visibility === 'private') ? (
                                    <EmptyContent text={t('profile.private_group')} icon={<Lock />} />
                                ) : (
                                    <>
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
                                        </div>
                                        <div className='mt-3'>
                                            {
                                                activeTab === 'posts' ? (
                                                    <PostGrid posts={posts} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} isLoading={isLoading} />
                                                ) : (
                                                    <PostsGrid data={reels} fetchNextPage={fetchNextPageReels} hasNextPage={hasNextPageReels} isFetchingNextPage={isFetchingNextPageReels} isLoading={reelsLoading} />
                                                )
                                            }
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>
                )
            }
        </MainLayout>
    )
}
