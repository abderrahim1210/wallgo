import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

interface useFollowProps {
    id?: number;
    setFollow?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFollow = ({ setFollow } : useFollowProps = {}) => {
    const api_url = 'https://api.wallgo.test';
    const add_follow = async (following_id: number) => {
        try {
            const res = await axios.post(`${api_url}/add_follow`, { following_id: following_id }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                if (setFollow){
                    setFollow((prev) => !prev);
                }
                // queryClient.invalidateQueries({ queryKey: ['user_data', id] });
            }
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }
    return { add_follow }
}
