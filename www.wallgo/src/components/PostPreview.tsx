import React from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api_url } from '../pages/Auth/getUser'
import { useQuery } from '@tanstack/react-query'
import { PostCard } from '../pages/Post/PostCard'

export const PostPreview = () => {
    const { id } = useParams();
    const fetchInfos = async () => {
        try {
            const res = await axios.get(`${api_url}/post_preview/${id}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data } = useQuery({
        queryKey: ['post_preview', id],
        queryFn: fetchInfos,
        staleTime: 1000 * 60 * 5
    });

    const post = data?.post;

    const navigate = useNavigate();
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Post</title>
            </Helmet>

            <div className='max-w-xl mx-auto px-4 py-6'>
                <button
                    onClick={() => navigate(-1)}
                    className="text-slate-400 transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center space-x-1.5 font-medium group cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back</span>
                </button>

                <PostCard post={post} onDelete={() => { }} />
            </div>
        </MainLayout>
    )
}
