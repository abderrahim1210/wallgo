import { X } from 'lucide-react';
import React, { useState } from 'react'

interface Post{
    id:number;
    content:string;
    image:string;
    likes:number;
    comments:number;
    author:{
        name:string;
        username:string;
        avatar:string
    }
}

interface SelectedPostsProps {
    post: Post;
};

export const SelectedPosts: React.FC<SelectedPostsProps> = ({ post }) => {
    const [selectedPost, setSelectedPost] = useState<Post | null>(post);
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-in zoom-in-95 duration-150">
                <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="md:w-1/2 bg-black flex items-center justify-center">
                    <img src={selectedPost?.image} alt="Detail" className="max-h-[400px] w-full object-contain" />
                </div>

                <div className="md:w-1/2 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                            <img src={selectedPost?.author.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900">{selectedPost?.author.name}</h4>
                                <p className="text-xs text-gray-500">@{selectedPost?.author.username}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed mb-4">{selectedPost?.content}</p>
                    </div>

                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                        <span className="flex items-center space-x-1 text-red-500">❤️ {selectedPost?.likes} Likes</span>
                        <span className="flex items-center space-x-1 text-purple-500">💬 {selectedPost?.comments} Comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
