import { Calendar, Check, CheckCheck, Flag, Info, Pencil, Trash2, X } from 'lucide-react';
import { DropdownMenu, type DropdownItem } from '../../templates/DropdownMenu';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { api_url } from '../Auth/getUser';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useModal } from '../../hooks/ModalProvider';
import ModalTemplate from '../../templates/ModalTemplate';
import { Report } from '../../components/Report';
import { Tooltip } from '../../templates/Tooltip';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useMoment from '../../hooks/useMoment';

export type ChatMessage = {
    id: number;
    sender: 'me' | 'them';
    content: string;
    time: string;
    image?: string;
    conversation_id: number;
    edited: boolean;
    can_edit: boolean;
    created_at: string;
    updated_at: string;
};

type MessageBubbleProps = {
    message: ChatMessage;
    attachmentAlt: string;
};

export const MessageBubble = ({ message, attachmentAlt }: MessageBubbleProps) => {
    const [dropdownMenu, setDropDownMenu] = useState<{ message: ChatMessage, x: number, y: number } | null>(null);
    const { show, openModal, closeModal } = useModal()!;
    const [loading, setLoading] = useState(false);
    const [newContent, setNewContent] = useState('');

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
    const [messageToEdit, setMessageToEdit] = useState(false);

    useEffect(() => {
        if (messageToEdit) {
            setNewContent(message?.content);
        }
    }, [messageToEdit]);

    const m = useMoment()!;

    const messageMenu: DropdownItem[] = [
        {
            label: `${m(message?.created_at).calendar()}`,
            icon: <Calendar className="w-4 h-4 text-[var(--special-purple)]" />,
            danger: false,
            onClick: () => { },
        },
        ...((message?.edited) ? [
            {
                label: `Edited at : ${m(message?.updated_at).calendar()}`,
                danger: false,
                onClick: () => { },
            },
        ] : []),
        ...((!isOwner) ? [
            {
                label: t('messenger.reportMessage'),
                icon: <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />,
                danger: true,
                onClick: () => { openModal(`report-message-${message?.id}`) },
            },
        ] : []),
        ...((isOwner && message?.can_edit && !message?.image) ? [
            {
                label: t('messenger.editMessage'),
                icon: <Pencil className="w-4 h-4 text-[var(--special-purple)]" />,
                danger: false,
                onClick: () => { setMessageToEdit(prev => !prev) },
            },
        ] : []),
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

    const handleEdit = async () => {
        if (!message.id && newContent === '') return null;
        setLoading(true);
        try {
            const res = await axios.put(`${api_url}/messages/edit`, { message_id: message?.id, content: newContent }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setLoading(false);
                setMessageToEdit(false);
                toast.success(res.data.message);
                queryClient.invalidateQueries({ queryKey: [`messages-${message?.conversation_id}`] });
            } else {
                setLoading(false);
                toast.error(res.data.messages || 'Failed to edit message');
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    }


    return (
        <div className='relative'>
            {
                show === `report-message-${message?.id}` && (
                    <ModalTemplate show={show} closeModal={closeModal}>
                        <Report id={message?.id} type='message' />
                    </ModalTemplate>
                )
            }
            <div className={`flex min-w-0 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                    onContextMenu={(e) => handleOpenMessageMenu(e, message)}
                    className={`min-w-0 max-w-[85%] overflow-hidden rounded-2xl text-sm leading-relaxed shadow-sm md:max-w-md ${message.sender === 'me'
                        ? 'rounded-ee-md bg-[var(--special-purple)] text-white shadow-[var(--special-purple)]/15'
                        : 'rounded-es-md border border-gray-200/80 bg-white/85 text-gray-800 dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-100'
                        }`}
                >
                    {messageToEdit ?
                        <div className='flex'>
                            <input value={newContent} onChange={(e) => setNewContent(e.target.value)} type='text' className='m-1 bg-indigo-300 dark:bg-gray-900 rounded-xl px-3 py-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[var(--special-purple)] transition' />
                            <Tooltip label={t('common.valideChanges')}>
                                <button className='cursor-pointer text-green-400 m-1' onClick={handleEdit}>
                                    <Check />
                                </button>
                            </Tooltip>
                            <Tooltip label={t('common.discardChanges')}>
                                <button className='cursor-pointer text-red-400 m-1' onClick={() => setMessageToEdit(false)}>
                                    <X />
                                </button>
                            </Tooltip>
                        </div> :
                        (!message?.image) ? <p className="break-words whitespace-pre-wrap px-4 py-2.5 [overflow-wrap:anywhere]">{message.content}</p> :
                            <div className="p-1.5">
                                <img src={message.image} alt={attachmentAlt} className="max-h-60 w-full max-w-full rounded-xl object-cover" />
                            </div>}
                    <div className={`flex items-center justify-end gap-1.5 px-3 pb-2 text-[10px] ${message.sender === 'me' ? 'text-white/75' : 'text-gray-400 dark:text-gray-500'}`}>
                        {
                            message?.edited && (
                                <span>{t('messenger.edited')}</span>
                            )
                        }
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