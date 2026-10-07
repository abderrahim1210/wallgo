import React from 'react'
import { MainLayout } from '../MainLayout';
import { FaCompass, FaGlobe, FaLock, FaUsers } from 'react-icons/fa';

export const Groups = () => {
    const groups = [
        {
            id: 1,
            owner_id: 3,
            title: "Groupe1",
            description: "Grroupppe",
            type: "public",
            members_count: "1.4k",
            banner_url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
            logo_url: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg"
        },
        {
            id: 2,
            owner_id: 4,
            title: "Groupe2",
            description: "Grpepe",
            type: "private",
            members_count: "3.2k",
            banner_url: "https://images.pexels.com/photos/159369/xbox-xbox-one-microsoft-joystick-159369.jpeg",
            logo_url: "https://images.pexels.com/photos/39046606/pexels-photo-39046606.jpeg"
        },
        {
            id: 3,
            owner_id: 5,
            title: "Groupe3",
            description: "Grrrppps",
            type: "private",
            members_count: "3.2k",
            banner_url: "https://images.pexels.com/photos/159369/xbox-xbox-one-microsoft-joystick-159369.jpeg",
            logo_url: "https://images.pexels.com/photos/39046606/pexels-photo-39046606.jpeg"
        }
    ];

    const suggestedGroups = [
        {
            id: 3,
            owner_id: 5,
            title: "Groupe3",
            description: "Grrrppps",
            type: "public",
            members_count: "850",
            banner_url: "https://images.pexels.com/photos/3584932/pexels-photo-3584932.jpeg",
            logo_url: "https://images.pexels.com/photos/13827131/pexels-photo-13827131.jpeg"
        },
        {
            id: 4,
            owner_id: 5,
            title: "Groupe3",
            description: "Grrrppps",
            type: "private",
            members_count: "2.1k",
            banner_url: "https://images.pexels.com/photos/36228061/pexels-photo-36228061.jpeg",
            logo_url: "https://images.pexels.com/photos/5961982/pexels-photo-5961982.jpeg"
        }
    ];


    return (
        <MainLayout>
            <div className='px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaUsers className='w-8 h-8 text-[var(--special-purple)]' /> My Groups <span className='text-[var(--special-purple)]'>(9)</span></h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                                <img src={group.banner_url} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                                    {group.type === 'private' ? <FaLock className="w-2.5 h-2.5" /> : <FaGlobe className="w-2.5 h-2.5" />}
                                    {group.type}
                                </span>
                            </div>
                            <div className="px-5 pb-5 relative">
                                <div className="-mt-10 mb-3 flex justify-between items-end">
                                    <img src={group.logo_url} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white" />
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{group.members_count} members</span>
                                </div>
                                <h3 className="font-bold text-base text-gray-900">{group.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{group.description}</p>
                                <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition">
                                    Manage Group
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className="border-gray-200 my-8" />
            <div className='px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaUsers className='w-8 h-8 text-[var(--special-purple)]' /> Suggested Groups</h1>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                    {suggestedGroups.map((group) => (
                        <div key={group.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                            <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                                <img src={group.banner_url} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                                    {group.type === 'private' ? <FaLock className="w-2.5 h-2.5" /> : <FaGlobe className="w-2.5 h-2.5" />}
                                    {group.type}
                                </span>
                            </div>
                            <div className="px-5 pb-5 relative">
                                <div className="-mt-10 mb-3 flex justify-between items-end">
                                    <img src={group.logo_url} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white" />
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{group.members_count} members</span>
                                </div>
                                <h3 className="font-bold text-base text-gray-900">{group.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{group.description}</p>
                                <button className="w-full py-2 bg-[var(--special-purple)] text-white hover:opacity-90 rounded-xl text-xs font-semibold transition shadow-sm">
                                    Join Group
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}
