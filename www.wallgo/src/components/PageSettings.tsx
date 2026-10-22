import axios from 'axios';
import React from 'react'
import { api_url } from '../pages/Auth/getUser';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface PageSettingsProps {
    page_id: number
}
export const PageSettings: React.FC<PageSettingsProps> = ({ page_id }) => {
    const navigate = useNavigate();
    const handleDelete = async () => {
        if (!page_id) return null;
        Swal.fire({
            title: 'Delete page',
            text: 'Are you sure for delete this page ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes , delete it',
            confirmButtonColor: '#7371FC',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${api_url}/pages/${page_id}`, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success(res.data.message || 'Page deleted successfully');
                        setTimeout(() => {
                            navigate('/pages');
                        }, 1000);
                    } else {
                        toast.error(res.data.message || 'Failed to delete page');
                        console.log(res.data.message);
                    }
                } catch (err: any) {
                    console.error(err?.response.data);
                }
            }
        })
    }
    return (
        <div className="z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full overflow-hidden border border-gray-100 transform transition-all">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Page Settings</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Manage your page details and preferences</p>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

                    <div className="pt-4 border-t border-gray-100">
                        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-red-700">Delete Page</h4>
                                <p className="text-xs text-red-500 mt-0.5">
                                    Once deleted, it cannot be recovered.
                                </p>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
                            >
                                Delete Page
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
