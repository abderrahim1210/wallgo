import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../MainLayout';
import { PostGrid } from '../templates/PostGrid';
import { Bookmark } from 'lucide-react';
import { FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { useQuery } from '@tanstack/react-query';

const SavedPosts = () => {
    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${api_url}/posts/saved`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data.posts;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data: posts = [] } = useQuery({
        queryKey: ['posts_saved'],
        queryFn: fetchPosts,
        staleTime: 1000 * 60 * 5
    });

    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Saved Posts</title>
            </Helmet>


            <div className='max-w-2xl mx-auto px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaBookmark className='w-8 h-8 text-[var(--special-purple)]' /> Saved Posts <span className='text-[var(--special-purple)]'>({posts.length})</span></h1>

                </div>
                <div className='mt-3'>
                    <PostGrid posts={posts} />
                </div>
            </div>

        </MainLayout>
    )
}

export default SavedPosts