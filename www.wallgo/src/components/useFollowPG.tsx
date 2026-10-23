import axios from 'axios';
import React from 'react'
import { api_url } from '../pages/Auth/getUser';

interface useFollowPG {
    setFollowed?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFollowPG = ({ setFollowed }: useFollowPG = {}) => {
    const handleFollow = async (id: number, type: 'page' | 'group' | string) => {
        try {
            const res = await axios.post(`${api_url}/pages/follow`, { type: type, entity_id: id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                if (setFollowed) {
                    setFollowed(prev => !prev);
                }
            } else {
                console.log(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response.data);
        }
    }
    return { handleFollow }
}
