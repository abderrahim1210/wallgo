import React, { useEffect, useRef } from 'react'
import type { Reel } from '../components/CreateReel'
import { useNavigate } from 'react-router-dom';
import { EmptyContent } from '../components/EmptyContent';
import { Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PostsGridProps {
    data: Reel[],
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}
const PostsGrid: React.FC<PostsGridProps> = ({ data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage }) => {
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
    const navigate = useNavigate();
    return (
        <>
            <div className='grid grid-cols-3 gap-1.5'>
                {data?.length > 0 ? data?.map((item) => (
                    <div key={item?.id} className='relative aspect-square bg-gray-100 dark:bg-zinc-900 overflow-hidden group cursor-pointer' onClick={() => navigate(`/reel/${item.id}`)}>

                        <video
                            src={item.video_url}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute top-2 right-2 bg-black/40 backdrop-blur-sm p-1 rounded-full text-white'>
                            <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                                <path d='M8 5v14l11-7z' />
                            </svg>
                        </div>

                        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold text-sm'>
                        </div>
                    </div>
                )) : (
                    <EmptyContent text={t('reelGrid.emptySaved')} icon={<Video />} />
                )}
            </div>
            <div ref={observerRef} className="h-10"></div>

            {!hasNextPage && data.length > 0 && (
                <div className="text-center py-6 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {t('feed.endReached')}
                </div>
            )}
        </>
    )
}

export default PostsGrid