import { Bookmark, CalendarClock, Crown, Edit3, Flag, Globe, Heart, Link, Lock, MessageCircle, MoreHorizontal, Play, Share2, Sparkles, Timer, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { DropdownMenu, type DropdownItem } from '../../templates/DropdownMenu';
import { useModal } from '../../hooks/ModalProvider';
import ModalTemplate from '../../templates/ModalTemplate';
import { CommentSection } from '../../components/CommentSection';
import ShareDropdown from '../../components/ShareDropdown';
import moment from 'moment';
// @ts-ignore Moment locale modules do not include their own type declarations.
import 'moment/dist/locale/ar';
import { useAuth } from '../../hooks/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Post } from '../../templates/PostGrid';
import { SelectedPosts } from '../../components/SelectedPosts';
import { Report } from '../../components/Report';
import { Link as LinkR } from 'react-router-dom'
import axios from 'axios';
import { api_url } from '../Auth/getUser';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import TimeCapsuleLocked from '../../Icons/TimeCapsule';
import { Tooltip } from '../../templates/Tooltip';
import { useTranslation } from 'react-i18next';
interface PostCardProps {
    post: Post;
}
export const PostCard: React.FC<PostCardProps> = ({
    post,
}) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';

    const m = (date?: string | Date | null) => moment.utc(date).local().locale(currentLang);
    const [liked, setLiked] = useState<boolean>(post?.is_liked);
    const [likes, setLikes] = useState(Number(post?.likes_count));
    const [saved, setSaved] = useState(Boolean(post?.is_saved));
    useEffect(() => {
        if (post) {
            setSaved(Boolean(post?.is_saved));
            setLiked(Boolean(post?.is_liked));
            setLikes(Number(post?.likes_count) || 0);
        }
    }, [post?.is_liked, post?.is_saved, post?.likes_count]);
    const { show, openModal, closeModal } = useModal()!;
    const { user: currentUser } = useAuth()!;
    const handleLike = async () => {
        const previousLiked = liked;
        const previousLikes = likes;

        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikes(newLikedState ? previousLikes + 1 : Math.max(0, previousLikes - 1));
        try {
            const res = await axios.post(`${api_url}/add_like`, { post_id: post?.id, type: 'post', 'owner_id': post.user?.id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                if (typeof res.data.is_liked === 'boolean') {
                    setLiked(res.data.is_liked);
                }
                if (typeof res.data.likes_count === 'number') {
                    setLikes(res.data.likes_count);
                }
            } else {
                setLiked(previousLiked);
                setLikes(previousLikes);
                console.log(res.data.message);
            }
        } catch (err: any) {
            setLiked(previousLiked);
            setLikes(previousLikes);
            console.error(err?.response?.data);
        }
    }

    const isOwner = currentUser?.id === post?.user?.id;

    const navigate = useNavigate();
    const { user } = useAuth()!;
    const isAuthorGroupOwner = post?.user?.id === post?.postable?.owner_id;
    const isGroupOwner = user?.id === post?.postable?.owner_id;
    const deletePost = async (id: number) => {
        if (!id) return toast.error(t('feed.postIdNotFound'));
        try {
            Swal.fire({
                icon: "question",
                title: t('feed.deletePost'),
                text: t('feed.confirmDeletePost'),
                confirmButtonColor: "#DB5461",
                confirmButtonText: t('feed.yes'),
                cancelButtonText: t('feed.no'),
                showConfirmButton: true,
                showCancelButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const url = isGroupOwner ? `${api_url}/groups/${post?.postable?.id}/${post?.id}` : `${api_url}/posts/${id}`;
                    const res = await axios.delete(url, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success(t('feed.postDeleted'));
                        setTimeout(() => {
                            navigate('/account/profile');
                        }, 1000);
                    } else {
                        toast.error(t('feed.postDeleteFailed'));
                        console.log(res.data.message);
                    }
                }
            })
        } catch (err: any) {
            console.log(err?.response?.data);
        }
    }

    const postMenuItems: DropdownItem[] = [
        {
            label: t('feed.copyLink'),
            icon: <Link className="w-4 h-4 text-blue-500 dark:text-blue-400" />,
            onClick: () => {
                navigator.clipboard.writeText(`${window.location.href}post/${post?.id}`);
                toast.success(t('feed.linkCopied'))
            }
        },

        ...((isOwner) ? [
            {
                label: t('feed.editPost'),
                icon: <Edit3 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />,
                onClick: () => navigate(`/post/${post?.id}/edit`, { state: { postToEdit: { content: post?.content, media_url: post?.media_url, created_at: post?.created_at }, id: post?.id } }),
            },
        ] : []),
        ...((isOwner || post?.is_group_owner) ? [
            {
                label: t('feed.deletePost'),
                icon: <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />,
                danger: true,
                onClick: () => deletePost(post?.id),
            },
        ] : []),
        ...(!isOwner ? [
            {
                label: t('feed.reportPost'),
                icon: <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />,
                danger: true,
                onClick: () => openModal(`report-${post?.id}`),
            },
        ] : [])
    ];

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [openReport, setOpenReport] = useState(false);

    const handleSavePost = async () => {
        if (!post) return null;
        setSaved(prev => !prev);
        try {
            await axios.post(`${api_url}/post/save`, { post_id: post?.id, type: 'post' }, { withCredentials: true, withXSRFToken: true });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const location = useLocation();
    const isLocked = post?.unlock_time && moment(post?.unlock_time).isAfter(moment());
    const [commentId, setCommentId] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm mb-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between p-4 pb-3 transition-all rounded-t-2xl">
                <div className="flex items-center space-x-3">
                    {
                        post?.postable_type?.includes('Page') || post?.postable_type?.includes('Group') ? (
                            <img
                                src={post?.postable?.logo_url || '/icons/users.svg'}
                                alt={t('common.profile')}
                                className="w-10 h-10 rounded-full object-cover border border-purple-100 dark:border-purple-900/60"
                            />
                        ) : (
                            <img
                                src={post?.user?.avatar_url || '/icons/avatar1.svg'}
                                alt={t('common.profile')}
                                className="w-10 h-10 rounded-full object-cover border border-purple-100 dark:border-purple-900/60"
                            />
                        )
                    }
                    <div>
                        <h4 className="flex gap-1 items-center font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">
                            {
                                (post?.postable_type?.includes('Page')) ? (
                                    <LinkR to={`/pages/${post?.postable?.id}`}>
                                        {post?.postable?.name}
                                    </LinkR>
                                ) : post?.postable_type?.includes('Group') ?
                                    (
                                        <LinkR to={`/groups/${post?.postable?.id}`}>
                                            {t('feed.postedInGroup', { username: post?.user.name, group: post?.postable?.name })}
                                        </LinkR>
                                    ) : (
                                        <LinkR to={`/profile/${post?.user.id}/${post?.user.username}`}>
                                            {post?.user.name}
                                        </LinkR>
                                    )
                            }
                            {
                                isAuthorGroupOwner && (
                                    <Tooltip label={t('feed.adminOf', { name: post?.postable?.name })}>
                                        <Crown className='w-3.5 h-3.5 text-[var(--special-purple)]' />
                                    </Tooltip>
                                )
                            }
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {!post?.postable && (
                                <>
                                    <span>@{post?.user.username}</span>
                                    <span>•</span>
                                </>
                            )}
                            <span title={m(post?.created_at).format('LLL')}>
                                {m(post?.created_at).fromNow()}
                            </span>
                            <span>•</span>
                            {
                                post?.unlock_time ? (
                                    <Tooltip label={t('feed.unlockAt', { date: m(post?.unlock_time).calendar(), time: m(post?.unlock_time).format('MMM D, YYYY h:mm A') })}><Timer className='w-3.5 h-3.5' /></Tooltip>
                                ) : post?.schedule_time ? <Tooltip label={t('feed.scheduledAt', { date: m(post?.schedule_time).calendar(), time: m(post?.schedule_time).format('MMM D, YYYY h:mm A') })}><CalendarClock className='w-3.5 h-3.5' /></Tooltip> : post?.visibility === 'public' ? <Tooltip label={t('feed.publicPost')}><Globe className='w-3.5 h-3.5' /></Tooltip> : <Tooltip label={t('feed.privatePost')}><Lock className='w-3.5 h-3.5' /></Tooltip>
                            }
                        </div>
                    </div>
                </div>
                <Tooltip label={t('feed.moreOptions')}>
                    <DropdownMenu
                        trigger={
                            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        }
                        items={postMenuItems}
                    />

                </Tooltip>
            </div>

            {
                isLocked ? (
                    <TimeCapsuleLocked unlockTime={post?.unlock_time} createdAt={post?.created_at} />
                ) : (
                    <>
                        <div className="px-4 pb-3 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" onClick={() => navigate(`/post/${post?.id}`)}>
                            {post?.content}
                        </div>

                        {post?.media_url && post?.media_url.includes('image') && (
                            <div className="w-full bg-gray-50 dark:bg-gray-800 max-h-[500px] overflow-hidden flex items-center justify-center">
                                <img src={post?.media_url} alt={t('feed.postContent')} className="w-full h-auto object-cover max-h-[500px]" onClick={() => setSelectedPost(post)} />
                            </div>
                        )}

                        {post?.media_url && post?.media_url.includes('video') && (
                            <div className="w-full bg-gray-50 dark:bg-gray-800 max-h-[500px] overflow-hidden flex items-center justify-center">
                                <div className="relative overflow-hidden bg-black flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    <video
                                        src={post?.media_url}
                                        autoPlay
                                        playsInline
                                        onClick={togglePlay}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        ref={videoRef}
                                    />

                                    {!isPlaying && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
                                            <div className="p-3 bg-black/60 backdrop-blur-md rounded-full text-white">
                                                <Play className="w-6 h-6" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )
            }

            {
                (show === `comments-${post?.id}-post`) && (location.pathname !== `/post/${post?.id}`) && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <CommentSection key={post?.id} postId={post?.id} type='post' setOpenModal={setOpenReport} setCommentId={setCommentId} />
                    </ModalTemplate>
                )
            }

            {
                show === `share-${post?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <ShareDropdown url={window.location.href} />
                    </ModalTemplate>
                )
            }

            {
                show === `report-${post?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={post?.id} type='post' />
                    </ModalTemplate>
                )
            }

            {
                (openReport && commentId) && (
                    <ModalTemplate show={openReport} closeModal={() => setOpenReport(false)}>
                        <Report id={commentId} type='comment' onClose={() => setOpenReport(false)} />
                    </ModalTemplate>
                )
            }

            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 dark:border-gray-800 mt-1">
                <div className="flex items-center space-x-6">
                    <Tooltip label={t('feed.like')}>
                        <button
                            onClick={handleLike}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group cursor-pointer"
                        >
                            <Heart
                                className={`w-6 h-6 transition-transform active:scale-125 ${liked ? 'text-red-500 dark:text-red-400 fill-red-500' : 'group-hover:scale-110'
                                    }`}
                            />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{likes || post?.likes_count}</span>
                        </button>
                    </Tooltip>

                    <Tooltip label={t('feed.comments', { count: post?.comments_count })}>
                        <button onClick={() => openModal(`comments-${post?.id}-post`)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-[var(--special-purple)] transition-colors group cursor-pointer">
                            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{post?.comments_count}</span>
                        </button>
                    </Tooltip>

                    <Tooltip label={t('feed.share')}>
                        <button onClick={() => openModal(`share-${post?.id}`)} className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group cursor-pointer">
                            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </Tooltip>
                </div>

                <Tooltip label={t('feed.savePost')}>
                    <button
                        onClick={handleSavePost}
                        className={`text-gray-600 dark:text-gray-400 hover:text-[var(--special-purple)] transition-colors cursor-pointer ${saved ? 'text-[var(--special-purple)]' : ''
                            }`}
                    >
                        <Bookmark className={`w-5 h-5 ${saved ? 'fill-[var(--special-purple)]' : ''}`} />
                    </button>
                </Tooltip>
            </div>
            {selectedPost && (
                <SelectedPosts post={selectedPost} onClose={() => setSelectedPost(null)} onDelete={deletePost} />
            )}
        </div>
    )
}
