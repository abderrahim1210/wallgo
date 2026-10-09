import React, { useState } from 'react'
import { FaFacebook, FaTelegram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FiCheck, FiCopy, FiShare2 } from 'react-icons/fi';

interface ShareDropdownProps {
    // isOpen: boolean;
    // onClose: () => void;
    postUrl: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({ postUrl = window.location.href }) => {
    const [copied, setCopied] = useState(false);

    // if (!isOpen) return null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <>
            <div className="w-full bg-white p-2">

                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        <FiShare2 className="text-[var(--special-purple)]" /> Share Post
                    </h3>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                        onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(postUrl)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 transition text-gray-600 group"
                    >
                        <FaWhatsapp className="w-10 h-10 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">WhatsApp</span>
                    </button>

                    <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition text-gray-600 group"
                    >
                        <FaFacebook className="w-10 h-10 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Facebook</span>
                    </button>

                    <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 hover:bg-sky-50 hover:text-sky-500 transition text-gray-600 group"
                    >
                        <FaTwitter className="w-10 h-10 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Twitter</span>
                    </button>

                    <button
                        onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}`, '_blank')}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 hover:bg-sky-50 hover:text-sky-600 transition text-gray-600 group"
                    >
                        <FaTelegram className="w-10 h-10 text-sky-500 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Telegram</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <input
                        type="text"
                        readOnly
                        value={postUrl}
                        className="bg-transparent text-xs text-gray-500 px-2 flex-1 outline-none truncate"
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
                                <FiCheck className="w-3.5 h-3.5" /> Copied
                            </>
                        ) : (
                            <>
                                <FiCopy className="w-3.5 h-3.5" /> Copy
                            </>
                        )}
                    </button>
                </div>

            </div>
        </>
    )
}

export default ShareDropdown