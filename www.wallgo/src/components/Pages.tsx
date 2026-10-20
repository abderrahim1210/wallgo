import React from 'react'
import { MainLayout } from '../MainLayout';
import { FaNoteSticky, FaRectangleList, FaSliders } from 'react-icons/fa6';
import { FaCompass, FaLayerGroup, FaNewspaper, FaPage4 } from 'react-icons/fa';
import { LayoutDashboard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import type { Page } from './PageProfile';
import { EmptyContent } from './EmptyContent';
import { useNavigate } from 'react-router-dom';

export const Pages = () => {

  const fetchPages = async () => {
    try {
      const res = await axios.get(`${api_url}/pages`, { withCredentials: true, withXSRFToken: true });
      if (res.data.success) return res.data;
    } catch (err: any) {
      console.error(err?.response.data);
    }
  }

  const { data } = useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages
  });

  const my_pages = data?.my_pages || [];
  const pages = data?.pages || [];

  const navigate = useNavigate();
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
            {my_pages?.length === 0 ? <div><EmptyContent text='No pages - try again later !' icon={<FaNewspaper />} /></div> : my_pages.map((page: Page) => (
              <div key={page.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                  <img src={page.banner_url ?? '/backgrounds/users_banner.svg'} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="px-5 pb-5 relative">
                  <div className="-mt-10 mb-3 flex justify-between items-end">
                    <img src={page?.logo_url ?? '/icons/users.svg'} alt="Logo" className="w-16 h-16 rounded-full object-cover border border-gray-50 shadow-md bg-white" />
                    {/* <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{page.followers} followers</span> */}
                  </div>
                  <h3 className="font-bold text-base text-gray-900">{page.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{page.description}</p>
                  <button onClick={() => navigate(`/pages/${page?.id}`)} className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition">
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
            {pages?.length === 0 ? <div className='flex justify-center'><EmptyContent text='No suggested pages - try again later !' icon={<FaNewspaper />} /></div> : pages.map((page: Page) => {
              console.log(page.logo_url);
              return (
                (

                  <div key={page.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                    <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
                      <img src={page?.banner_url ?? '/backgrounds/users_banner.svg'} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="px-5 pb-5 relative">
                      <div className="-mt-10 mb-3 flex justify-between items-end">
                        <img src={page?.logo_url ?? '/icons/users.svg'} alt="Logo" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md bg-white" />
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{page.followers_count} followers</span>
                      </div>
                      <h3 className="font-bold text-base text-gray-900 cursor-pointer" onClick={() => navigate(`/pages/${page?.id}`)}>{page.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{page.description}</p>
                      <button className="w-full py-2 bg-[var(--special-purple)] text-white hover:opacity-90 rounded-xl text-xs font-semibold transition shadow-sm">
                        Follow Page
                      </button>
                    </div>
                  </div>
                )
              )
            }
            )}
          </div>
        </div>


      </div>
    </MainLayout>
  )
}
