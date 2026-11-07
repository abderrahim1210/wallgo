import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { api_url } from '../pages/Auth/getUser';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MainLayout } from '../MainLayout';
import { Helmet } from 'react-helmet-async';
import Spinner from '../templates/Spinner';
import { ErrorPage } from './ErrorPage';
import { RequestCard } from './RequestCard';
import { UserCheck } from 'lucide-react';

export type Request = {
    id: number;
    group: {
        id: number;
        name: string;
        logo_url: string;
    };
    answer: string;
    user: {
        id: number;
        username: string;
        avatar_url: string;
    }
    status: string;
    created_at: string;
}

const JoinGroupRequests = () => {
    const fetchRequests = async ({ pageParam = 1 }) => {
        try {
            const res = await axios.get(`${api_url}/groups/requests?page=${pageParam}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.requests;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: rqs, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['groups_requests'],
        queryFn: fetchRequests,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });

    const requests: Request[] = rqs?.pages.flatMap((page: any) => page?.data || []) || [];

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
        <MainLayout>
            <Helmet>
                <title>Wallgo : Requests Groups</title>
            </Helmet>

            {
                isLoading ? (
                    <Spinner type='mini' text='Fetching requests ...' />
                ) : isError ? (
                    <ErrorPage codeP='500' />
                ) : (
                    <div className='max-w-2xl mx-auto px-4 py-6'>
                        <div className='flex justify-start items-center mb-3'>
                            <h1 className='font-bold text-3xl flex items-center gap-2'><UserCheck className='w-8 h-8 text-[var(--special-purple)]' /> Requests <span className='text-[var(--special-purple)]'>({requests.length ?? 0})</span></h1>
                        </div>
                        {requests?.map((request, index: number) => (
                            <RequestCard request={request} key={index} />
                        ))}
                    </div>
                )
            }
            <div ref={observerRef} className="h-10"></div>
        </MainLayout>
    )
}

export default JoinGroupRequests