import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom'
import { api_url } from '../pages/Auth/getUser';
import { useQuery } from '@tanstack/react-query';
import type { Reel } from './CreateReel';
import { ReelCard } from './ReelCard';
import Spinner from '../templates/Spinner';
import { ErrorPage } from './ErrorPage';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../layouts/Navbar';
import { useTranslation } from 'react-i18next';

const ReelPreview = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const fetchReel = async () => {
        try {
            const res = await axios.get(`${api_url}/reels/${id}/preview`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['reel', id],
        queryFn: fetchReel
    });
    const reel: Reel = data?.reel || null;

    return (
        <>
            <Helmet>
                <title>{t('pageTitles.reel', { caption: reel?.caption || '' })}</title>
            </Helmet>

            <Navbar />

            {
                isLoading ? (
                    <Spinner type='large' text={t('reelGrid.fetchingSingle')} />
                ) : isError ? (
                    <ErrorPage codeP='500' />
                ) : (
                    <div className='h-[calc(100vh-55px)] w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center'>
                        <ReelCard reel={reel} />
                    </div>
                )
            }
        </>
    )
}

export default ReelPreview