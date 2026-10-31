import React from 'react'

interface SkeletonProps {
    type: 'post' | 'profile' | 'pages_groups' | 'bookmark' | 'edit_profile' | 'reels';
}
export const Skeleton: React.FC<SkeletonProps> = ({ type }) => {
    return type === 'post' ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm w-full mb-3 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />

                    <div className="space-y-1.5">
                        <div className="h-3.5 bg-gray-200 rounded-md w-32" />
                        <div className="h-2.5 bg-gray-200 rounded-md w-24" />
                    </div>
                </div>

                <div className="w-5 h-5 bg-gray-200 rounded-md" />
            </div>

            <div className="space-y-2 my-4">
                <div className="h-3.5 bg-gray-200 rounded-md w-3/4" />
                <div className="h-3.5 bg-gray-200 rounded-md w-1/2" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-2">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-4 h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                        <div className="w-4 h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                </div>

                <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
        </div>
    ) : type === 'pages_groups' ? (
        <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">
            <div className="mb-4">
                <div className="h-4 w-12 bg-gray-200 rounded mb-3"></div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-28 bg-gray-300 rounded-md"></div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-28 bg-gray-300 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                    <div className="w-full h-32 bg-gray-200 relative">
                        <div className="absolute bottom-2 right-2 h-5 w-16 bg-white/80 rounded-full"></div>
                    </div>

                    <div className="px-4 pt-2 relative">
                        <div className="-mt-8 mb-2 w-14 h-14 rounded-full border-4 border-white bg-gray-300 shadow-sm"></div>

                        <div className="space-y-2 mb-4">
                            <div className="h-5 w-28 bg-gray-300 rounded"></div>
                            <div className="h-3 w-36 bg-gray-200 rounded"></div>
                        </div>

                        <div className="w-full h-10 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                    <div className="w-full h-32 bg-gray-200 relative">
                        <div className="absolute bottom-2 right-2 h-5 w-16 bg-white/80 rounded-full"></div>
                    </div>

                    <div className="px-4 pt-2 relative">
                        <div className="-mt-8 mb-2 w-14 h-14 rounded-full border-4 border-white bg-gray-300 shadow-sm"></div>

                        <div className="space-y-2 mb-4">
                            <div className="h-5 w-28 bg-gray-300 rounded"></div>
                            <div className="h-3 w-36 bg-gray-200 rounded"></div>
                        </div>

                        <div className="w-full h-10 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                    <div className="w-full h-32 bg-gray-200 relative">
                        <div className="absolute bottom-2 right-2 h-5 w-16 bg-white/80 rounded-full"></div>
                    </div>

                    <div className="px-4 pt-2 relative">
                        <div className="-mt-8 mb-2 w-14 h-14 rounded-full border-4 border-white bg-gray-300 shadow-sm"></div>

                        <div className="space-y-2 mb-4">
                            <div className="h-5 w-28 bg-gray-300 rounded"></div>
                            <div className="h-3 w-36 bg-gray-200 rounded"></div>
                        </div>

                        <div className="w-full h-10 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    ) : type === "bookmark" ? (
        <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
            {/* 1. Header: Bookmark Icon + "Saved Posts (6)" */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-200 rounded-lg"></div>
                <div className="h-8 w-48 bg-gray-300 rounded-md"></div>
            </div>

            {/* 2. Post Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">

                {/* Post Header: Avatar, Name, Username/Time, Options dots */}
                <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        {/* Name & Subtitle */}
                        <div className="space-y-1.5">
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    {/* Three dots menu */}
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                </div>

                {/* Post Text / Caption */}
                <div className="px-4 pb-3 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>

                {/* Post Media / Image (Square / Banner) */}
                <div className="w-full h-80 sm:h-96 bg-gray-200"></div>

                {/* Post Footer: Actions (Like, Comment, Share, Bookmark) */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="h-3 w-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                            <div className="h-3 w-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                </div>

            </div>
        </div>
    ) : type === 'edit_profile' ? (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">

            {/* 1. Header: Edit Profile Title + Cancel Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                    <div className="h-7 w-36 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
                </div>
                <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
            </div>

            {/* 2. Main Card Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">

                {/* Banner & Avatar Section */}
                <div className="space-y-4">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>

                    {/* Banner Skeleton */}
                    <div className="w-full h-44 sm:h-56 bg-gray-200 rounded-xl"></div>

                    {/* Avatar Upload Area */}
                    <div className="flex items-center gap-4 pt-2">
                        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                            <div className="h-3 w-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Form Inputs Grid (2 columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                    </div>
                    {/* Username */}
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                    </div>
                    {/* Email Address */}
                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                    </div>
                    {/* Phone Number */}
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                    </div>
                    {/* Birth Date */}
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                    </div>
                    {/* Gender */}
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-11 w-full bg-gray-100 rounded-xl"></div>
                </div>

                {/* Bio Textarea */}
                <div className="space-y-2">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="h-24 w-full bg-gray-100 rounded-xl"></div>
                </div>

                <hr className="border-gray-100" />

                {/* Footer Buttons (Cancel & Save Changes) */}
                <div className="flex justify-end items-center gap-3 pt-2">
                    <div className="h-10 w-20 bg-gray-100 rounded-xl"></div>
                    <div className="h-10 w-32 bg-purple-200 rounded-xl"></div>
                </div>

            </div>
        </div>
    ) : type === 'reels' ? (
        <div className="relative w-full max-w-sm mx-auto h-[80vh] bg-gray-900 rounded-3xl overflow-hidden shadow-xl animate-pulse flex flex-col justify-between p-4">

            {/* Top Bar / Header Skeleton */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    {/* Avatar Circle */}
                    <div className="w-10 h-10 rounded-full bg-gray-700/60"></div>
                    {/* Username & Time */}
                    <div className="space-y-1.5">
                        <div className="w-24 h-3 bg-gray-700/60 rounded-md"></div>
                        <div className="w-16 h-2.5 bg-gray-700/40 rounded-md"></div>
                    </div>
                </div>
                {/* Follow / Options Button */}
                <div className="w-16 h-6 bg-gray-700/50 rounded-full"></div>
            </div>

            {/* Center Content / Video Area Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Optional subtle loader icon or pulse effect */}
                <div className="w-12 h-12 rounded-full bg-gray-800/40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
            </div>

            {/* Right Side Action Buttons (Like, Comments, Share) */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-10">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gray-700/60"></div>
                    <div className="w-6 h-2.5 bg-gray-700/40 rounded-md"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gray-700/60"></div>
                    <div className="w-6 h-2.5 bg-gray-700/40 rounded-md"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gray-700/60"></div>
                    <div className="w-6 h-2.5 bg-gray-700/40 rounded-md"></div>
                </div>
            </div>

            {/* Bottom Info Area (Caption & Audio Track) */}
            <div className="space-y-3 z-10 pr-12">
                {/* Caption Lines */}
                <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-700/60 rounded-md"></div>
                    <div className="w-3/4 h-3 bg-gray-700/50 rounded-md"></div>
                </div>

                {/* Audio Track Badge */}
                <div className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 rounded-full bg-gray-700/60"></div>
                    <div className="w-32 h-2.5 bg-gray-700/40 rounded-md"></div>
                </div>
            </div>

        </div>
    ) : (
        <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
            <div className="w-full h-48 sm:h-64 bg-gray-300 rounded-t-2xl"></div>

            <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 px-6 pb-6 pt-4 relative">

                <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-gray-300 shadow-md"></div>

                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="h-7 w-40 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                </div>

                <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100 mb-6">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-50 rounded-xl"></div>
                    <div className="h-12 bg-gray-50 rounded-xl"></div>
                    <div className="h-12 bg-gray-50 rounded-xl sm:col-span-2"></div>
                </div>

            </div>
        </div>
    )
}
