import axios from 'axios'
import { AlertTriangle } from 'lucide-react'
import React, { useState, type ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import LoadingButton from '../Icons/LoadingButton';
import { useModal } from '../hooks/ModalProvider';
import { useTranslation } from 'react-i18next';

interface ReportProps {
    type: 'post' | 'page' | 'user' | 'group' | 'comment' | 'reel';
    id: number,
    onClose?: () => void;
}
export const Report: React.FC<ReportProps> = ({ type, id, onClose }) => {
    const { t } = useTranslation();
    const entity = t(`report.types.${type}`);
    const [data, setData] = useState({
        reportable_id: id,
        reportable_type: type,
        reason: '',
        description: '',
    });

    const [loading, setLoading] = useState(false);
    const { closeModal } = useModal()!;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const api_url = 'https://api.wallgo.test';
    const send_report = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${api_url}/send_report`, data, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                toast.success(res.data.message || t('report.success'));

                closeModal?.();
                if (onClose) onClose();
            } else {
                setLoading(false);
                toast.error(res.data.message || t('report.failure'));
                console.error(res.data.message);
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err?.response?.data);
        }
    }
    return (
        <div className="backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full rounded-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95 duration-150">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" /> {t('report.title', { entity })}
                    </h3>
                </div>

                <form className="p-6 space-y-4" onSubmit={send_report}>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                            {t('report.selectReason')}
                        </label>
                        <select
                            name='reason'
                            value={data.reason}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--special-purple)] focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-800 dark:text-gray-200"
                            required
                        >
                            <option value="" disabled>{t('report.chooseReason')}</option>
                            <option value="spam">{t('report.reasons.spam')}</option>
                            <option value="harassment">{t('report.reasons.harassment')}</option>
                            <option value="inappropriate">{t('report.reasons.inappropriate')}</option>
                            <option value="false_info">{t('report.reasons.falseInfo')}</option>
                            <option value="other">{t('report.reasons.other')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                            {t('report.additionalDetails')}
                        </label>
                        <textarea
                            name='description'
                            rows={3}
                            value={data.description}
                            onChange={handleChange}
                            placeholder={t('report.detailsPlaceholder')}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--special-purple)] focus:bg-white dark:focus:bg-gray-900 transition-all text-gray-800 dark:text-gray-200 resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <LoadingButton loading={loading} type='submit' className="px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50">
                            {t('report.submit')}
                        </LoadingButton>
                    </div>

                </form>
            </div>
        </div>
    )
}
