import React, { useEffect, useRef } from 'react'
import type { Reel } from '../components/CreateReel'
import { EmptyContent } from '../components/EmptyContent';
import { Heart, MessageCircle, MoreVertical, Music, Send, Video, VolumeX } from 'lucide-react';
import { Skeleton } from './Skeleton';
import { ReelCard } from '../components/ReelCard';

interface ReelGridProps {
    reels: Reel[],
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}
export const ReelGrid: React.FC<ReelGridProps> = ({ reels, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage }) => {
    if (reels?.length === 0) {
        return (
            <EmptyContent text='No posts found it - try again later !' icon={<Video />} />
        )
    }

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
    return (
        <>
            {
                isLoading ? Array(4).fill(0).map((_, i) => <Skeleton type='reels' key={i} />) : reels?.map((r: Reel) => (
                    <div className="h-[calc(100vh-55px)] bg-gray-950 overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center">

                        {reels.map((reel) => (
                            <ReelCard reel={reel} />
                        ))}
                    </div>
                ))
            }
        </>
    )
}