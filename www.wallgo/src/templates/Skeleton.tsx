import React from 'react'

export const Skeleton = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm w-full mb-3 animate-pulse">
            {/* Header: Avatar, Name, Username & Options dots */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    {/* Avatar Skeleton */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />

                    {/* Name & Username Skeleton */}
                    <div className="space-y-1.5">
                        <div className="h-3.5 bg-gray-200 rounded-md w-32" />
                        <div className="h-2.5 bg-gray-200 rounded-md w-24" />
                    </div>
                </div>

                {/* Three dots icon skeleton */}
                <div className="w-5 h-5 bg-gray-200 rounded-md" />
            </div>

            {/* Content Text Skeleton (2 lines) */}
            <div className="space-y-2 my-4">
                <div className="h-3.5 bg-gray-200 rounded-md w-3/4" />
                <div className="h-3.5 bg-gray-200 rounded-md w-1/2" />
            </div>

            {/* Footer Actions: Likes, Comments, Share & Bookmark */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                <div className="flex items-center space-x-6">
                    {/* Like button skeleton */}
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-4 h-3 bg-gray-200 rounded" />
                    </div>
                    {/* Comment button skeleton */}
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-4 h-3 bg-gray-200 rounded" />
                    </div>
                    {/* Share button skeleton */}
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                </div>

                {/* Bookmark button skeleton */}
                <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
        </div>
    )
}
