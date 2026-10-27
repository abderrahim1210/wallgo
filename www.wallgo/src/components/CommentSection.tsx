import React, { useEffect, useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi';
import { CommentItem, type Comment } from './CommentItem';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';
import Spinner from '../templates/Spinner';
import { EmptyContent } from './EmptyContent';
import { FaComments } from 'react-icons/fa';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import { Report } from './Report';
import { ErrorPage } from './ErrorPage';
import LoadingButton from '../Icons/LoadingButton';

interface CommentSectionProps {
    postId: number;
    setOpenModal: (isopen: boolean) => void;
}
export const CommentSection: React.FC<CommentSectionProps> = ({ postId, setOpenModal }) => {
    const fetchComments = async ({ pageParam = 1 }) => {
        try {
            const res = await axios.get(`${api_url}/comments/${postId}?page=${pageParam}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.comments || null;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: cs, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['comments', postId],
        queryFn: fetchComments,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const comments: Comment[] = cs?.pages.flatMap((page: any) => page?.data || []) || [];

    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = observerRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    const [newComment, setNewComment] = useState('');
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(`${api_url}/comments/create`, { post_id: postId, content: newComment }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || 'Comment added successfully');
                queryClient.invalidateQueries({ queryKey: ['comments'] });
            } else {
                setLoading(false);
                toast.error(res.data.message || 'Failed to add comment');
                console.error(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
        setNewComment('');
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full mx-auto">


            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base">Comments ({comments?.length})</h3>
            </div>

            <div className="overflow-y-auto p-4 space-y-4 divide-y divide-gray-50">
                {isLoading ? (<Spinner text='Wait few seconds to get comments ...' type='mini' />) : isError ? (<ErrorPage codeP='500' />) : comments?.length > 0 ? (
                    comments.map((comment: Comment, index: number) => (
                        <CommentItem comment={comment} postId={postId} key={index} openReport={setOpenModal} />
                    ))
                ) : (
                    <div className="py-8 text-center">
                        <EmptyContent text=' No comments yet. Be the first to comment!' icon={<FaComments />} />
                    </div>
                )}

                <div ref={observerRef} className="h-10"></div>

                {!hasNextPage && comments.length > 0 && (
                    <div className="text-center text-xs text-gray-400 font-medium uppercase tracking-wider">
                        You've reached the end!
                    </div>
                )}
            </div>

            <form onSubmit={handleAddComment} className="p-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5  text-gray-800 focus:outline-none focus:border-[var(--special-purple)] transition"
                />
                <LoadingButton type='submit' loading={loading} className="bg-[var(--special-purple)] text-white p-2.5 rounded-xl hover:opacity-90 transition shadow-sm shrink-0 flex items-center justify-center cursor-pointer">
                    <FiSend className="w-5 h-5" />
                </LoadingButton>
            </form>

        </div>
    )
}
