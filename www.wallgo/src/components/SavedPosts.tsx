import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../MainLayout';
import { PostGrid } from '../templates/PostGrid';
import { Bookmark } from 'lucide-react';
import { FaBookmark } from 'react-icons/fa';

const SavedPosts = () => {
    const posts =[
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
            content: 'Nature Landscape View',
            author: 'Sara Miller',
            likesCount: 142,
            commentsCount: 24,
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
            content: 'Adventure in the Mountains',
            author: 'Abderrahim Khali Ali',
            likesCount: 89,
            commentsCount: 12,
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
            content: 'Green Forest Morning',
            author: 'John Doe',
            likesCount: 230,
            commentsCount: 45,
        },
    ];

    // const [notification, setNotification] = useState<string | null>(null);
    // const showNotify = (msg: string) => {
    //     setNotification(msg);
    //     setTimeout(() => setNotification(null), 2500);
    // };
    // const handleRemoveSaved = (id: number, e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     // setPosts(posts.filter(post => post.id !== id));
    //     showNotify('Removed from saved posts');
    // };
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Saved Posts</title>
            </Helmet>


            <div className='px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaBookmark className='w-8 h-8 text-[var(--special-purple)]' /> Saved Posts <span className='text-[var(--special-purple)]'>({posts.length})</span></h1>

                </div>
                <div className='mt-3'>
                    <PostGrid posts={[]} />
                </div>
            </div>

        </MainLayout>
    )
}

export default SavedPosts