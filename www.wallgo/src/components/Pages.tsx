import React from 'react'
import { MainLayout } from '../MainLayout';
import { FaNoteSticky, FaRectangleList } from 'react-icons/fa6';
import { FaCompass, FaLayerGroup, FaPage4 } from 'react-icons/fa';
import { LayoutDashboard } from 'lucide-react';

export const Pages = () => {
  const pages = [
    {
      id: 1,
      owner_id: 1,
      title: 'Gamers',
      description: 'For gamers',
      logo_url: 'https://images.pexels.com/photos/39046606/pexels-photo-39046606.jpeg',
      banner_url: 'https://images.pexels.com/photos/159369/xbox-xbox-one-microsoft-joystick-159369.jpeg',
      followers: 340
    }
  ];

  const suggestedPages = [
    {
      id: 2,
      owner_id: 3,
      title: 'Photographie',
      description: 'Photos',
      logo_url: 'https://images.pexels.com/photos/13827131/pexels-photo-13827131.jpeg',
      banner_url: 'https://images.pexels.com/photos/3584932/pexels-photo-3584932.jpeg',
      followers: 560
    },
    {
      id: 3,
      owner_id: 5,
      title: 'Transports',
      description: 'Cars',
      logo_url: 'https://images.pexels.com/photos/5961982/pexels-photo-5961982.jpeg',
      banner_url: 'https://images.pexels.com/photos/36228061/pexels-photo-36228061.jpeg',
      followers: 34
    }
  ];

  return (
    <MainLayout>
      <div className='px-4 py-6'>
        <div className='flex justify-start items-center'>
          <h1 className='font-bold text-3xl flex items-center gap-2'><FaLayerGroup className='w-8 h-8 text-[var(--special-purple)]' /> Pages <span className='text-[var(--special-purple)]'>(9)</span></h1>

        </div>
        <div className="mb-10 mt-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaRectangleList className="text-[var(--special-purple)]" /> My Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div key={page.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                  <img src={page.banner_url} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="px-5 pb-5 relative">
                  <div className="-mt-10 mb-3 flex justify-between items-end">
                    <img src={page.logo_url} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{page.followers} followers</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900">{page.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{page.description}</p>
                  <button className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition">
                    Manage Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCompass className="text-[var(--special-purple)]" /> Suggested Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedPages.map((page) => (
              <div key={page.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                  <img src={page.banner_url} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="px-5 pb-5 relative">
                  <div className="-mt-10 mb-3 flex justify-between items-end">
                    <img src={page.logo_url} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md bg-white" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{page.followers} followers</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900">{page.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{page.description}</p>
                  <button className="w-full py-2 bg-[var(--special-purple)] text-white hover:opacity-90 rounded-xl text-xs font-semibold transition shadow-sm">
                    Follow Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </MainLayout>
  )
}
