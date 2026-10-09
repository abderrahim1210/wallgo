import React from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info';
interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
}
export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    return (
        <div className="fixed bottom-15 right-3 z-100 flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 min-w-[280px] max-w-md">

            <div className="shrink-0">
                {type === 'success' && <FiCheckCircle className="w-5 h-5 text-emerald-500" />}
                {type === 'error' && <FiAlertCircle className="w-5 h-5 text-rose-500" />}
                {type === 'info' && <FiInfo className="w-5 h-5 text-blue-500" />}
            </div>

            <div className="flex-1 text-sm font-medium text-gray-800">
                {message}
            </div>

            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
                <FiX className="w-4 h-4" />
            </button>
        </div>
    )
}
