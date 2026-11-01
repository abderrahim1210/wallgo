import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../MainLayout';
import { Heart, MessageCircle, MoreVertical, Music, Pause, Send, Volume2, VolumeX } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Reel } from './CreateReel';
import Spinner from '../templates/Spinner';
import { ErrorPage } from './ErrorPage';
import { ReelGrid } from '../templates/ReelGrid';
import { Toaster } from 'react-hot-toast';

export const Reels = () => {
    const fetchReels = async () => {
        try {
            const res = await axios.get(`${api_url}/reels`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.reels || [];
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: rl, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['reels'],
        queryFn: fetchReels,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const reels: Reel[] = rl?.pages.flatMap((page: any) => page?.data || []) || [];


    
    return (
        <>
            <Helmet>
                <title>WallGo : Reels</title>
            </Helmet>
            <Navbar />
            <Toaster position='top-right' />
            {
                isLoading ? (
                    <Spinner type='large' text='Fetching reel ...' />
                ) : isError ? (
                    <ErrorPage codeP='500' />
                ) : (
                    <ReelGrid reels={reels} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isLoading={isLoading} isFetchingNextPage={isFetchingNextPage} />
                )
            }
        </>
    )
}
