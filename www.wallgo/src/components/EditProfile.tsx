import React from 'react'
import { MainLayout } from '../MainLayout';
import { Helmet } from 'react-helmet-async';
import { FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const EditProfile = () => {
    const profile = {
        name: 'Abderrahim',
        username: 'abdou_12',
        email: 'abderrahim12@gmail.com',
        bio: 'Anything',
        avatar_url: 'https://images.pexels.com/photos/15482284/pexels-photo-15482284.jpeg',
        banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        phone: '0654341243',
        birth: '2006-04-12',
        gender: 'male',
        location: 'Bouskoura'
    };
    return (
        <MainLayout>
            <Helmet>
                <title>WallGo : Edit Profile</title>
            </Helmet>
            <div className="max-w-3xl mx-auto px-4 py-8 pb-24">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="text-sm text-gray-500">Update your personal information and profile appearance</p>
                    </div>
                    <Link
                        to="/account/profile"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
                    >
                        <FaTimes className="w-4 h-4" /> Cancel
                    </Link>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Profile Banner & Avatar</label>

                        <div className="relative h-40 md:h-52 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
                            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                <span className="flex items-center gap-2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <FaCamera className="w-4 h-4" /> Change Banner
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 group shrink-0">
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                    <FaCamera className="text-white w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <button type="button" className="text-sm font-medium text-[var(--special-purple)] hover:underline">
                                    Upload new avatar
                                </button>
                                <p className="text-xs text-gray-400 mt-0.5">Recommended: Square JPG, PNG. Max 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                defaultValue={profile.name}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                            <input
                                type="text"
                                defaultValue={profile.username}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                defaultValue={profile.email}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                            <input
                                type="text"
                                defaultValue={profile.phone}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Date</label>
                            <input
                                type="date"
                                defaultValue={profile.birth}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                            <select
                                defaultValue={profile.gender}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 capitalize"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                            <input
                                type="text"
                                defaultValue={profile.location}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                            <textarea
                                rows={3}
                                defaultValue={profile.bio}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] focus:ring-2 focus:ring-[var(--special-purple)]/20 outline-none transition text-sm bg-gray-50/50 resize-none"
                            ></textarea>
                        </div>

                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <Link
                            to="/account/profile"
                            className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--special-purple)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
                        >
                            <FaSave className="w-4 h-4" /> Save Changes
                        </button>
                    </div>

                </div>

            </div>
        </MainLayout>
    )
}
