import { Heart, MessageSquare } from 'lucide-react';
import React, { useState } from 'react'
import { SelectedPosts } from '../components/SelectedPosts';

interface Post {
    id: number;
    content: string;
    image?: string;
    likesCount: number;
    commentsCount: number;
};

interface PostGridProps {
    posts: Post[];
    // onPostClick: (post: Post) => void;
};

export const PostGrid: React.FC<PostGridProps> = ({ posts }) => {

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 rounded-2xl">
                <p className="text-gray-400">No posts found.</p>
            </div>
        )
    }

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-1 md:gap-2">
            {posts.map((post) => (
                <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="relative group aspect-square bg-gray-900 rounded overflow-hidden cursor-pointer"
                >
                    {post.image ? (
                        <img
                            src={post.image}
                            alt="Post media"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                    ) : (
                        <div className="w-full h-full p-4 flex items-center justify-center bg-gray-800 text-gray-300 text-xs text-center">
                            <p className="line-clamp-4">{post.content}</p>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-6 text-white font-semibold">
                        <div className="flex items-center gap-1.5">
                            <Heart size={20} className="fill-white" />
                            <span>{post.likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageSquare size={20} className="fill-white" />
                            <span>{post.commentsCount}</span>
                        </div>
                    </div>
                    
                </div>
            ))}
            {selectedPost && (
                <SelectedPosts post={selectedPost} onClose={() => setSelectedPost(null)} />
            )}

        </div>
    )
}
