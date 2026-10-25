import axios from 'axios'
import { AlertTriangle } from 'lucide-react'
import React, { useState, type ChangeEvent } from 'react'
import toast from 'react-hot-toast'


interface ReportProps {
    type: 'post' | 'page' | 'user' | 'group';
    id: number
}
export const Report: React.FC<ReportProps> = ({ type, id }) => {
    const [data, setData] = useState({
        reportable_id: id,
        reportable_type: type,
        reason: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const api_url = 'https://api.wallgo.test';
    const send_report = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${api_url}/send_report`, data, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message || 'Report added successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(res.data.message || 'Report failed to send');
                console.error(res.data.message);
            }
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }
    return (
        <div className="backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full rounded-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-150">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" /> Report Content
                    </h3>
                </div>

                <form className="p-6 space-y-4" onSubmit={send_report}>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Select a reason for reporting
                        </label>
                        <select
                            name='reason'
                            value={data.reason}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--special-purple)] focus:bg-white transition-all text-gray-800"
                            required
                        >
                            <option value="" disabled>Choose a reason...</option>
                            <option value="spam">Spam or misleading</option>
                            <option value="harassment">Harassment or hate speech</option>
                            <option value="inappropriate">Inappropriate or explicit content</option>
                            <option value="false_info">False information</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                            Additional Details (Optional)
                        </label>
                        <textarea
                            name='description'
                            rows={3}
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Please provide more details about why you are reporting this..."
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--special-purple)] focus:bg-white transition-all text-gray-800 resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
