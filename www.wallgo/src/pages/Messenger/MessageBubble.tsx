import { CheckCheck, Flag, Trash2 } from 'lucide-react';
import { DropdownMenu, type DropdownItem } from '../../templates/DropdownMenu';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { api_url } from '../Auth/getUser';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export type ChatMessage = {
    id: number;
    sender: 'me' | 'them';
    content: string;
    time: string;
    image?: string;
    conversation_id: number;
};

type MessageBubbleProps = {
    message: ChatMessage;
    attachmentAlt: string;
};

export const MessageBubble = ({ message, attachmentAlt }: MessageBubbleProps) => {
    const [dropdownMenu, setDropDownMenu] = useState<{ message: ChatMessage, x: number, y: number } | null>(null);

    useEffect(() => {
        if (!dropdownMenu) return;

        const handleClose = () => setDropDownMenu(null);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDropDownMenu(null);
        };

        window.addEventListener('click', handleClose);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('click', handleClose);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dropdownMenu]);


    const isOwner: boolean = message?.sender === 'me';

    const messageMenu: DropdownItem[] = [
        {
            label: t('messenger.reportMessage'),
            icon: <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />,
            danger: true,
            onClick: () => { },
        },
        ...((isOwner) ? [
            {
                label: t('messenger.deleteMessage'),
                icon: <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />,
                danger: true,
                onClick: () => handleDeleteMessage(message?.id),
            },
        ] : [])
    ];
    const handleOpenMessageMenu = (e: React.MouseEvent<HTMLElement>, message: ChatMessage) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const x = message.sender === 'me' ? rect.left - 192 - 8 : rect.right + 8;
        const y = rect.top;

        setDropDownMenu({ message, x, y });
    }

    const queryClient = useQueryClient();

    const handleDeleteMessage = async (id: number) => {
        if (!id) return;
        Swal.fire({
            title: t('messenger.deleteMessage'),
            text: t('messenger.confirmDeleteMessage'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('feed.yesDelete'),
            confirmButtonColor: '#7371FC',
            cancelButtonText: t('feed.cancel')
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${api_url}/messages/${id}`, { withCredentials: true, withXSRFToken: true });
                    if (res.data.success) {
                        toast.success(res.data.message || 'Message deleted successfully');
                        queryClient.setQueryData<ChatMessage[]>([`messages-${message.conversation_id}`], (currentMessages = []) => [
                            ...currentMessages,
                            res.data.message,
                        ]);
                    } else {
                        toast.error(res.data.message || 'Failed to delete this message');
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        })
    }
    return (
        <div className='relative'>
            <div className={`flex min-w-0 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                    onContextMenu={(e) => handleOpenMessageMenu(e, message)}
                    className={`min-w-0 max-w-[85%] overflow-hidden rounded-2xl text-sm leading-relaxed shadow-sm md:max-w-md ${message.sender === 'me'
                        ? 'rounded-ee-md bg-[var(--special-purple)] text-white shadow-[var(--special-purple)]/15'
                        : 'rounded-es-md border border-gray-200/80 bg-white/85 text-gray-800 dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-100'
                        }`}
                >
                    {message.image && (
                        <div className="p-1.5">
                            <img src={message.image} alt={attachmentAlt} className="max-h-60 w-full max-w-full rounded-xl object-cover" />
                        </div>
                    )}
                    {message.content && <p className="break-words whitespace-pre-wrap px-4 py-2.5 [overflow-wrap:anywhere]">{message.content}</p>}
                    <div className={`flex items-center justify-end gap-1.5 px-3 pb-2 text-[10px] ${message.sender === 'me' ? 'text-white/75' : 'text-gray-400 dark:text-gray-500'}`}>
                        <span>{message.time}</span>
                        {message.sender === 'me' && <CheckCheck className="h-3 w-3" />}
                    </div>
                </div>

            </div>
            {dropdownMenu && (
                <div className='absolute'>
                    <DropdownMenu
                        items={messageMenu}
                        open={true}
                        onOpenChange={(open) => {
                            if (!open) setDropDownMenu(null);
                        }}
                        position={{ x: dropdownMenu.x, y: dropdownMenu.y }}
                    />
                </div>
            )}
        </div>
    )
};