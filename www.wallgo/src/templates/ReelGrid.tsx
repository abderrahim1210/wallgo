import React, { useEffect, useRef } from 'react'
import type { Reel } from '../components/CreateReel'
import { EmptyContent } from '../components/EmptyContent';
import { Heart, MessageCircle, MoreVertical, Music, Send, Video, VolumeX } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { ReelCard } from '../components/ReelCard';
import { useTranslation } from 'react-i18next';

interface ReelGridProps {
    reels: Reel[],
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}
export const ReelGrid: React.FC<ReelGridProps> = ({ reels, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage }) => {
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
    if (reels?.length === 0) {
        return <EmptyContent text={t('feed.noPostsFound')} icon={<Video />} />;
    }

    return (
        <div className='h-[calc(100vh-55px)] w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center'>
            {
                isLoading ? Array(4).fill(0).map((_, i) => <Skeleton type='reels' key={i} />) :
                    reels.map((reel, index:number) => (
                        <ReelCard reel={reel} key={index} />
                    ))
            }
            <div ref={observerRef} className="h-4 w-full" />
        </div>
    )
}