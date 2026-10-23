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
            {my_pages?.length === 0 ? <div><EmptyContent text='No pages - try again later !' icon={<FaNewspaper />} /></div> : my_pages.map((page: Page, index: number) => (
              <PageCard page={page} key={index} />
            ))}
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCompass className="text-[var(--special-purple)]" /> Suggested Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages?.length === 0 ? <div className='flex justify-center'><EmptyContent text='No suggested pages - try again later !' icon={<FaNewspaper />} /></div> : pages.map((page: Page, index:number) =>
            (
              <PageCard page={page} key={index} />
            ))}
          </div>
        </div>


      </div>
    </MainLayout>
  )
}
