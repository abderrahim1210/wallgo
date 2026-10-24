import React, { useState } from 'react'
import { MainLayout } from '../MainLayout';
import { FaCompass, FaGlobe, FaLock, FaUsers } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { api_url } from '../pages/Auth/getUser';
import { EmptyContent } from './EmptyContent';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GroupCard } from './GroupCard';

export interface Group {
    id: number;
    owner_id: number;
    name: string;
    description: string;
    type: string;
    logo_url: string;
    banner_url: string;
    created_at: string;
    followers_count: number;
    is_followed: boolean;
}

export const Groups = () => {
    const navigate = useNavigate();
    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${api_url}/groups`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data;
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }

    const { data } = useQuery({
        queryKey: ['groups_and_suggested_groups'],
        queryFn: fetchGroups,
    });

    const groups = data?.my_groups || [];
    const suggestedGroups = data?.groups || [];

    return (
        <MainLayout>
            <div className='px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaUsers className='w-8 h-8 text-[var(--special-purple)]' /> My Groups <span className='text-[var(--special-purple)]'>({groups?.length ?? 0})</span></h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                    {
                        groups?.length > 0 ? groups.map((group: Group, index:number) => (
                            <GroupCard group={group} key={index} />
                        )) : (
                            <div className='col-span-full flex justify-center'>
                                <EmptyContent text="You don't have any group - try to create a first now !" icon={<Users />} />
                            </div>
                        )
                    }
                </div>
            </div>
            <hr className="border-gray-200 my-8" />
            <div className='px-4 py-6'>
                <div className='flex justify-start items-center'>
                    <h1 className='font-bold text-3xl flex items-center gap-2'><FaUsers className='w-8 h-8 text-[var(--special-purple)]' /> Suggested Groups <span className='text-[var(--special-purple)]'>({suggestedGroups?.length ?? 0})</span></h1>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                    {
                        suggestedGroups?.length > 0 ? suggestedGroups.map((group: Group, index:number) => <GroupCard group={group} key={index} />) : (
                            <div className='col-span-full flex justify-center'>
                                <EmptyContent text='No groups suggested for you - try again later !' icon={<Users />} />
                            </div>
                        )
                    }
                </div>
            </div>
        </MainLayout>
    )
}
