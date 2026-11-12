import React, { useState } from 'react'
import { FaFacebook, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiCheck, FiCopy, FiShare2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface ShareDropdownProps {
    url: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({ url = window.location.href }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <>
            <div className="w-full bg-white dark:bg-gray-900 p-2">

                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FiShare2 className="text-[var(--special-purple)]" /> {t('share.title')}
                    </h3>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                        onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition text-gray-600 dark:text-gray-400 group"
                    >
                        <FaWhatsapp className="w-10 h-10 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">WhatsApp</span>
                    </button>

                    <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-600 dark:text-gray-400 group"
                    >
                        <FaFacebook className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Facebook</span>
                    </button>

                    <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-sky-900/40 hover:text-sky-500 dark:hover:text-sky-400 transition text-gray-600 dark:text-gray-400 group"
                    >
                        <FaTwitter className="w-10 h-10 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Twitter</span>
                    </button>

                    <button
                        onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-sky-50 dark:hover:bg-sky-900/40 hover:text-sky-600 dark:hover:text-sky-400 transition text-gray-600 dark:text-gray-400 group"
                    >
                        <FaTelegram className="w-10 h-10 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Telegram</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
                    <input
                        type="text"
                        readOnly
                        value={url}
                        className="bg-transparent text-xs text-gray-500 dark:text-gray-400 px-2 flex-1 outline-none truncate"
                    />
                    <button
                        onClick={handleCopyLink}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${copied
                                ? 'bg-emerald-500 text-white'
                                : 'bg-[var(--special-purple)] text-white hover:opacity-90'
                            }`}
                    >
                        {copied ? (
                            <>
                                <FiCheck className="w-3.5 h-3.5" /> {t('share.copied')}
                            </>
                        ) : (
                            <>
                                <FiCopy className="w-3.5 h-3.5" /> {t('share.copy')}
                            </>
                        )}
                    </button>
                </div>

            </div>
        </>
    )
}

export default ShareDropdown