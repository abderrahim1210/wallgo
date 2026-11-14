import { Album, FileText } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { EmptyContent } from '../components/EmptyContent';
import { PostCard } from '../pages/Post/PostCard';
import { Skeleton } from './Skeleton';
import FollowUserCard from '../components/FollowUserCard';
import { useTranslation } from 'react-i18next';

interface User {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
}
export interface Post {
    id: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    content: string;
    media_url: string;
    schedule_time: string,
    unlock_time: string;
    expires_at: string;
    likes_count: number;
    is_liked: boolean;
    comments_count: number;
    created_at: string;
    is_owner?: boolean;
    postable?: {
        id?: number;
        name?: string;
        logo_url?: string;
        owner_id?:number;
    };
    postable_type: string;
    is_saved: boolean;
    visibility: 'private' | 'public';
    is_group_owner?: boolean;
    is_page_owner?:boolean;
    views_count:number;
};

interface PostGridProps {
    posts: Post[];
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    suggested_follow?: User[];
};

export const PostGrid: React.FC<PostGridProps> = ({ posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, suggested_follow }) => {
    const { t } = useTranslation();
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

    if (posts?.length === 0) {
        return (
            <EmptyContent text={t('feed.noPostsFound')} icon={<Album />} />
        )
    }

    return (
        <div className="gap-1 md:gap-2">
            {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton type='post' key={i} />) : posts.length > 0 ? posts.map((post, index) => (
                <React.Fragment key={post.id}>
                    <PostCard key={post.id} post={post} />
                    {(index + 1) % 6 === 0 && suggested_follow && suggested_follow.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm my-2 lg:hidden">
                            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                {t('feed.suggestedForYou')}
                            </h3>

                            <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar snap-x">
                                {suggested_follow.map((user, index: number) => (
                                    <FollowUserCard user={user} key={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </React.Fragment>

            )) : (
                <EmptyContent text={t('feed.noPostsYet')} icon={<FileText />} />
            )}

            <div ref={observerRef} className="h-10"></div>

            {!hasNextPage && posts.length > 0 && (
                <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
                    {t('feed.endReached')}
                </div>
            )}
        </div>
    )
}
