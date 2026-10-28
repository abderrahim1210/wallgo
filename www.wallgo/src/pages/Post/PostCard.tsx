import { Bookmark, CalendarClock, Edit3, Flag, Globe, Heart, Link, Lock, MessageCircle, MoreHorizontal, Share2, Sparkles, Timer, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { DropdownMenu, type DropdownItem } from '../../templates/DropdownMenu';
import { useModal } from '../../hooks/ModalProvider';
import ModalTemplate from '../../templates/ModalTemplate';
import { CommentSection } from '../../components/CommentSection';
import ShareDropdown from '../../components/ShareDropdown';
import moment from 'moment';
import { useAuth } from '../../hooks/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Post } from '../../templates/PostGrid';
import { SelectedPosts } from '../../components/SelectedPosts';
import { Report } from '../../components/Report';
import { Link as LinkR } from 'react-router-dom'
import axios from 'axios';
import { api_url } from '../Auth/getUser';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import TimeCapsuleLocked from '../../Icons/TimeCapsule';
interface PostCardProps {
    post: Post;
}
export const PostCard: React.FC<PostCardProps> = ({
    post,
}) => {
    const [liked, setLiked] = useState<boolean>(post?.is_liked);
    const [likes, setLikes] = useState(Number(post?.likes_count));
    useEffect(() => {
        if (post) {
            setLikes(post?.likes_count);
        }
    }, [post]);
    const [saved, setSaved] = useState(Boolean(post?.is_saved));
    useEffect(() => {
        if (post) {
            setSaved(post?.is_saved);
        }
    }, [post]);
    const { show, openModal, closeModal } = useModal()!;
    const { user: currentUser } = useAuth()!;
    const handleLike = async () => {
        if (liked) {
            setLikes(likes - 1);
            setLiked(false);
        } else {
            setLikes(likes + 1);
            setLiked(true);
        }
        try {
            const res = await axios.post(`${api_url}/add_like`, { post_id: post?.id, type: 'post' }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                if (res.data.is_liked) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            } else {
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }

    const isOwner = currentUser?.id === post?.user?.id;

    const navigate = useNavigate();

    const deletePost = async (id: number) => {
        if (!id) return toast.error('Post ID not found');
        try {
            Swal.fire({
                icon: "question",
                title: "Delete post",
                text: "Are you sure to delete this post ?",
                confirmButtonColor: "#DB5461",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                showConfirmButton: true,
                showCancelButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await axios.delete(`${api_url}/posts/${id}`, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success('Post deleted !');
                        setTimeout(() => {
                            navigate('/account/profile');
                        }, 1000);
                    } else {
                        toast.error('Failed to delete post');
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
            label: 'Copy link',
            icon: <Link className="w-4 h-4 text-blue-500" />,
            onClick: () => {
                navigator.clipboard.writeText(`${window.location.href}post/${post?.id}`);
                toast.success('Copy link')
            }
        },

        ...(isOwner ? [
            {
                label: 'Edit Post',
                icon: <Edit3 className="w-4 h-4 text-emerald-500" />,
                onClick: () => navigate(`/post/${post?.id}/edit`, { state: { postToEdit: { content: post?.content, media_url: post?.media_url, created_at: post?.created_at }, id: post?.id } }),
            },
            {
                label: 'Delete Post',
                icon: <Trash2 className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => deletePost(post?.id),
            },
        ] : []),
        ...(!isOwner ? [
            {
                label: 'Report Post',
                icon: <Flag className="w-4 h-4 text-red-500" />,
                danger: true,
                onClick: () => openModal('report'),
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
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between p-4 pb-3 hover:bg-gray-200 transition-all rounded-t-2xl">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(`/post/${post?.id}`)}>
                    {
                        post?.postable ? (
                            <img
                                src={post?.postable?.logo_url || '/icons/users.svg'}
                                alt={post?.user.name}
                                className="w-10 h-10 rounded-full object-cover border border-purple-100"
                            />
                        ) : (
                            <img
                                src={post?.user?.avatar_url || '/icons/avatar1.svg'}
                                alt={post?.user.name}
                                className="w-10 h-10 rounded-full object-cover border border-purple-100"
                            />
                        )
                    }
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                            {
                                post?.postable_type?.includes('Page') ? (
                                    <LinkR to={`/pages/${post?.postable?.id}`}>
                                        {post?.postable?.name}
                                    </LinkR>
                                ) : post?.postable_type?.includes('Group') ? (
                                    <LinkR to={`/groups/${post?.postable?.id}`}>
                                        {post?.postable?.name}
                                    </LinkR>
                                ) : (
                                    <LinkR to={`/profile/${post?.user.id}/${post?.user.username}`}>
                                        {post?.user.name}
                                    </LinkR>
                                )
                            }
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            {!post?.postable && (
                                <span>@{post?.user.username}</span>
                            )}
                            <span>•</span>
                            <span>{moment(post?.created_at).fromNow()}</span>
                            <span>•</span>
                            {
                                post?.unlock_time ? (
                                    <Timer className='w-3.5 h-3.5' />
                                ) : post?.schedule_time ? <CalendarClock className='w-3.5 h-3.5' /> : post?.visibility === 'public' ? <Globe className='w-3.5 h-3.5' /> : <Lock className='w-3.5 h-3.5' />
                            }
                        </div>
                    </div>
                </div>
                <DropdownMenu
                    trigger={
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    }
                    items={postMenuItems}
                />

            </div>

            {
                isLocked ? (
                    <TimeCapsuleLocked unlockTime={post?.unlock_time} createdAt={post?.created_at} />
                ) : (
                    <>
                        <div className="px-4 pb-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {post?.content}
                        </div>

                        {post?.media_url && (
                            <div className="w-full bg-gray-50 max-h-[500px] overflow-hidden flex items-center justify-center">
                                <img src={post?.media_url} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" onClick={() => setSelectedPost(post)} />
                            </div>
                        )}
                    </>
                )
            }

            {
                (show === `comments-${post?.id}-post`) && (location.pathname !== `/post/${post?.id}`) && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <CommentSection key={post?.id} postId={post?.id} setOpenModal={setOpenReport} />
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
                show === 'report' && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={post?.id} type='post' />
                    </ModalTemplate>
                )
            }

            {
                openReport && (
                    <ModalTemplate show={openReport} closeModal={() => setOpenReport(false)}>
                        <Report id={post?.id} type='comment' />
                    </ModalTemplate>
                )
            }

            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-50 mt-1">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group cursor-pointer"
                    >
                        <Heart
                            className={`w-6 h-6 transition-transform active:scale-125 ${liked || post?.is_liked ? 'text-red-500 fill-red-500' : 'group-hover:scale-110'
                                }`}
                        />
                        <span className="text-xs font-semibold text-gray-700">{likes || post?.likes_count}</span>
                    </button>

                    <button onClick={() => openModal(`comments-${post?.id}-post`)} className="flex items-center space-x-2 text-gray-600 hover:text-[var(--special-purple)] transition-colors group cursor-pointer">
                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-gray-700">{post?.comments_count}</span>
                    </button>

                    <button onClick={() => openModal(`share-${post?.id}`)} className="text-gray-600 hover:text-blue-500 transition-colors group cursor-pointer">
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <button
                    onClick={handleSavePost}
                    className={`text-gray-600 hover:text-[var(--special-purple)] transition-colors cursor-pointer ${saved ? 'text-[var(--special-purple)]' : ''
                        }`}
                >
                    <Bookmark className={`w-5 h-5 ${saved ? 'fill-[var(--special-purple)]' : ''}`} />
                </button>
            </div>
            {selectedPost && (
                <SelectedPosts post={selectedPost} onClose={() => setSelectedPost(null)} onDelete={deletePost} />
            )}
        </div>
    )
}
