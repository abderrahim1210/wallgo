import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { api_url } from '../pages/Auth/getUser'
import type { Notification } from './Notifications'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import Spinner from '../templates/Spinner'
import { ErrorPage } from './ErrorPage'
import { Bell } from 'lucide-react'
import { NotificationCard } from './NotificationCard'
import { FiCheck } from 'react-icons/fi'
import { useTranslation } from 'react-i18next';

const NotificationsView = () => {
    const { t } = useTranslation();
    const fetchNotifications = async ({ pageParam = 1 }) => {
        try {
            const res = await axios.get(`${api_url}/notifications/all?page=${pageParam}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.notifications;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    const { data: nts, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['notificationas_all'],
        queryFn: fetchNotifications,
        getNextPageParam: (lastPage: any) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1
    });
    const notifications: Notification[] = nts?.pages.flatMap((page: any) => page?.data || []) || [];

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

    const queryClient = useQueryClient();
    const handleReadAll = async () => {
        try {
            await axios.post(`${api_url}/notifications/is_read/all`, {}, { withCredentials: true, withXSRFToken: true }).then(res => {
                if (res.data.success) {
                    queryClient.invalidateQueries({ queryKey: ['notifications_all'] })
                }
            });
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return (
        <MainLayout>
            <Helmet>
                <title>{t('notifications.title')}</title>
            </Helmet>

            {
                isLoading ? (
                    <Spinner type='mini' text={t('notifications.fetching')} />
                ) : isError ? (
                    <ErrorPage codeP='500' />
                ) : (
                    <div className='max-w-2xl mx-auto px-4 py-6'>
                        <div className='flex justify-start items-center'>
                            <h1 className='font-bold text-3xl flex items-center gap-2'><Bell className='w-8 h-8 text-[var(--special-purple)]' /> {t('notifications.title')} <span className='text-[var(--special-purple)]'>({notifications.length})</span></h1>
                        </div>

                        <div className="px-4 py-3 border-b border-gray-100 flex items-center bg-white">
                            <button onClick={handleReadAll} className="text-sm text-[var(--special-purple)] hover:underline font-medium flex items-center gap-1">
                                <FiCheck className="w-3.5 h-3.5" /> {t('notifications.markAllRead')}
                            </button>
                        </div>
                        <div className='mt-3'>
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <NotificationCard notif={notif} key={notif.id} />
                                ))
                            ) : (
                                <div className="py-8 text-center text-gray-400 text-sm">
                                    {t('notifications.empty')}
                                </div>
                            )}
                        </div>
                        <div ref={observerRef} className="h-10"></div>
                    </div>
                )
            }
        </MainLayout>
    )
}

export default NotificationsView