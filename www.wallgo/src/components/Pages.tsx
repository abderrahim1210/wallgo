import React from 'react'
import { MainLayout } from '../MainLayout';
import { FaNoteSticky, FaRectangleList, FaSliders } from 'react-icons/fa6';
import { FaCompass, FaLayerGroup, FaNewspaper, FaPage4 } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import type { Page } from './PageProfile';
import { EmptyContent } from './EmptyContent';
import { useNavigate } from 'react-router-dom';
import { PageCard } from './PageCard';
import PagesIcon from '../Icons/PageIcon';
import { ArrowLeft } from 'lucide-react';

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
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center space-x-1.5 font-medium group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>
        <div className='flex justify-start items-center'>
          <h1 className='font-bold text-3xl flex items-center gap-2'><span className='text-[40px] text-indigo-600'>
            <PagesIcon />
          </span> Pages</h1>

        </div>
        <div className="mb-10 mt-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Your Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {my_pages?.length === 0 ? <div className='col-span-full flex justify-center'><EmptyContent text='No pages - try again later !' icon={<FaNewspaper />} /></div> : my_pages.map((page: Page, index: number) => (
              <PageCard page={page} key={index} />
            ))}
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Suggested Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages?.length === 0 ? <div className='col-span-full flex justify-center'><EmptyContent text='No suggested pages - try again later !' icon={<FaNewspaper />} /></div> : pages.map((page: Page, index: number) =>
            (
              <PageCard page={page} key={index} />
            ))}
          </div>
        </div>


      </div>
    </MainLayout>
  )
}
