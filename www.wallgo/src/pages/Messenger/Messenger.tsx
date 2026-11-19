import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Image, Info, MessageCircle, Phone, Search, Send, Smile, Video } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../layouts/Navbar';
import { MobileCellNavbar } from '../../layouts/MobileCellNavbar';
import axios from 'axios';
import { api_url } from '../Auth/getUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageBubble, type ChatMessage } from './MessageBubble';
import type { Conversation } from './ConversationItem';
import ConversationItem from './ConversationItem';
import { EmptyContent } from '../../components/EmptyContent';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../templates/Spinner';
import { ErrorPage } from '../../components/ErrorPage';
import moment from 'moment';
import { cloudName } from '../../components/CreateReel';

export const Messenger = () => {
    const location = useLocation();
    const id = location.state?.id;
    const queryClient = useQueryClient();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';

    const m = (date?: string | Date | null) => moment.utc(date).local().locale(currentLang);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchConversations = async () => {
        const res = await axios.get(`${api_url}/messenger`, { withCredentials: true, withXSRFToken: true });
        if (!res.data.success) throw new Error('Failed to fetch conversations');
        return res.data;
    };

    const { data, isLoading, isError: conversationsError } = useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations
    });

    const conversations: Conversation[] = data?.conversations || [];

    const [chatSelection, setChatSelection] = useState<{
        locationKey: string;
        conversation: Conversation;
        showOnMobile: boolean;
    } | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [term, setTerm] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const fetchConversation = async () => {
        const res = await axios.get(`${api_url}/messenger/${id}`, { withCredentials: true, withXSRFToken: true });
        if (!res.data.success) throw new Error('Failed to fetch conversation');
        return res.data.conversation;
    };

    const { data: conv, isLoading: convLoading, isError: convError } = useQuery({
        queryKey: [`conversation-${id}`, id],
        queryFn: fetchConversation,
        enabled: Boolean(id),
    });

    const linkedConversation: Conversation | null = conv ? {
        id: conv.id,
        name: conv.name,
        avatar_url: conv.avatar_url ?? '',
        latest_message: conv.latest_message ?? null,
        time: conv.time ?? '',
        online: conv.online ?? false,
        user: conv.user,
        unread: conv.unread ?? 0
    } : null;
    const currentSelection = chatSelection?.locationKey === location.key ? chatSelection : null;
    const activeChat = currentSelection?.conversation ?? linkedConversation;
    const showMobileChat = currentSelection?.showOnMobile ?? Boolean(id);
    const activeChatId = activeChat?.id;

    const navigate = useNavigate();

    const fetchMessages = async () => {
        const res = await axios.get(`${api_url}/messages/conversation`, { params: { conversation_id: activeChatId }, withCredentials: true, withXSRFToken: true });
        if (!res.data.success) throw new Error('Failed to fetch messages');
        return res.data.messages as ChatMessage[];
    };

    const { data: messages = [], isLoading: messagesLoading, isError: messagesError } = useQuery({
        queryKey: [`messages-${activeChatId}`],
        queryFn: fetchMessages,
        enabled: Boolean(activeChatId),
    })

    useEffect(() => {
        if (activeChatId && !messagesLoading && !messagesError) {
            void queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    }, [activeChatId, messagesError, messagesLoading, queryClient]);

    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2500);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = messageInput.trim();
        if (!text || !activeChat) return;

        try {
            setIsSending(true);
            const res = await axios.post(`${api_url}/messages/send`, { content: text, conversation_id: activeChat.id }, { withCredentials: true, withXSRFToken: true });
            if (!res.data.success || !res.data.message) throw new Error('Failed to send message');
            queryClient.setQueryData<ChatMessage[]>([`messages-${activeChat.id}`], (currentMessages = []) => [
                ...currentMessages,
                res.data.message,
            ]);
            setMessageInput('');
            setShowEmojiPicker(false);
        } catch (err) {
            console.error(err);
            showNotify(t('messenger.sendFailed'));
        } finally {
            setIsSending(false);
        }
    };

    const handleSelectChat = (conversation: Conversation) => {
        setChatSelection({ locationKey: location.key, conversation, showOnMobile: true });
        setMessageInput('');
        setShowChatInfo(false);
        setShowEmojiPicker(false);
    };

    const handleBackToConversations = () => {
        if (activeChat) {
            setChatSelection({ locationKey: location.key, conversation: activeChat, showOnMobile: false });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeChat) return;
        if (!file.type.startsWith('image/')) {
            showNotify(t('messenger.invalidImage'));
            e.target.value = '';
            return;
        }

        try {
            setIsUploadingImage(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'wallgo_posts_image');
            formData.append('resource_type', 'image');
            const upload = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
            const res = await axios.post(
                `${api_url}/messenger/send`,
                { media_url: upload.data.secure_url, conversation_id: activeChat.id },
                { withCredentials: true, withXSRFToken: true }
            );
            if (!res.data.success || !res.data.message) throw new Error('Failed to send image');
            queryClient.setQueryData<ChatMessage[]>([`messages-${activeChat.id}`], (currentMessages = []) => [
                ...currentMessages,
                res.data.message,
            ]);
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        } catch (err) {
            console.error(err);
            showNotify(t('messenger.sendFailed'));
        } finally {
            setIsUploadingImage(false);
            e.target.value = '';
        }
    };

    const addEmoji = (emoji: string) => {
        setMessageInput((currentInput) => currentInput + emoji);
    };

    const emojis = ['😊', '🚀', '🔥', '👍', '❤️', '💡', '😎', '💻', '✨', '⭐'];
    const filteredConversations = conversations.filter((chat) =>
        chat?.name?.toLowerCase().includes(term.toLowerCase())
        || chat?.latest_message?.content?.toLowerCase().includes(term.toLowerCase())
    );

    useEffect(() => {
        if (!activeChat?.id) return;

        let cancelled = false;

        const markAsRead = async () => {
            try {
                await axios.put(
                    `${api_url}/messenger/read_conversation`,
                    { conversation_id: activeChat.id },
                    { withCredentials: true, withXSRFToken: true }
                );

                if (!cancelled) {
                    await queryClient.invalidateQueries({ queryKey: ['messages_count'] });
                    await queryClient.invalidateQueries({ queryKey: ['conversations'] });
                }
            } catch (err) {
                console.error(err);
            }
        };

        markAsRead();

        return () => {
            cancelled = true;
        };
    }, [activeChat?.id, queryClient]);
    useEffect(() => {
        if (!activeChatId || !window.Echo) return;

        const channelName = `conversation.${activeChatId}`;
        const channel = window.Echo.private(channelName);

        const handleMessageSent = (e: { message: ChatMessage }) => {
            if (!e?.message) return;

            queryClient.setQueryData<ChatMessage[]>([`messages-${activeChatId}`], (current = []) => {
                if (current.some((m) => m.id === e.message.id)) return current;
                return [...current, e.message];
            });

            void queryClient.invalidateQueries({ queryKey: ['conversations'] });
            void queryClient.invalidateQueries({ queryKey: ['messages_count'] });
        };

        channel.listen('.message.sent', handleMessageSent);

        return () => {
            channel.stopListening('.message.sent', handleMessageSent);
            window.Echo.leave(channelName);
        };
    }, [activeChatId, queryClient]);

    return (
        <>
            <Navbar />
            <main className="relative flex min-h-[calc(100dvh-95px)] items-center justify-center bg-gradient-to-br from-[#f7f6ff] via-[#f8f9fc] to-[#f1f0ff] px-0 pb-20 pt-0 dark:from-gray-950 dark:via-gray-900 dark:to-[#211d3d] md:px-4 md:py-5 md:pb-5">
                <Helmet>
                    <title>{`WallGo : ${t('messenger.title')}`}</title>
                </Helmet>

                {notification && (
                    <div role="status" className="absolute top-5 z-50 rounded-full border border-white/20 bg-gray-900/90 px-5 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-xl dark:bg-gray-800/90">
                        {notification}
                    </div>
                )}

                <section
                    dir={i18n.dir()}
                    aria-label={t('messenger.title')}
                    className="relative flex h-[calc(100dvh-115px)] min-h-[380px] w-full overflow-hidden border-y border-gray-200/70 bg-white shadow-[0_24px_80px_-32px_rgba(52,52,74,0.24)] dark:border-white/10 dark:bg-gray-900 md:h-[min(82vh,820px)] md:min-h-[560px] md:max-w-7xl md:rounded-3xl md:border"
                >
                    <aside className={`h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-e border-gray-200/70 bg-white dark:border-white/10 dark:bg-gray-950/30 md:flex md:w-[360px] ${showMobileChat ? 'hidden' : 'flex'}`}>
                        <div className="shrink-0 border-b border-gray-100 px-5 py-5 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--special-purple)] text-white shadow-md shadow-[var(--special-purple)]/20">
                                    <MessageCircle className="h-5 w-5" />
                                </span>
                                <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{t('messenger.title')}</h1>
                            </div>
                        </div>

                        <div className="shrink-0 p-4 pb-3">
                            <label className="relative block">
                                <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="search"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder={t('messenger.searchPlaceholder')}
                                    aria-label={t('messenger.searchPlaceholder')}
                                    className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/80 py-3 pe-4 ps-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--special-purple)] focus:bg-white focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-white/10 dark:bg-gray-800/70 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-gray-800"
                                />
                            </label>
                        </div>

                        <nav aria-label={t('messenger.title')} className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-2 pb-3">
                            {isLoading ? (
                                <Spinner type="mini" text={t('messenger.loadingConversations')} />
                            ) : conversationsError ? (
                                <p role="alert" className="p-4 text-sm text-red-600 dark:text-red-400">{t('messenger.conversationsLoadFailed')}</p>
                            ) : filteredConversations.length === 0 ? (
                                <p className="p-4 text-center text-sm text-gray-500">{conversations.length ? t('messenger.noSearchResults') : t('messenger.noConversations')}</p>
                            ) : filteredConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    active={activeChat?.id === conversation?.id}
                                    yesterdayLabel={t('messenger.yesterday')}
                                    startConversationLabel={t('messenger.startConversation')}
                                    imageMessageLabel={t('messenger.imageMessage')}
                                    onSelect={handleSelectChat}
                                    m={m}
                                />
                            ))}
                        </nav>
                    </aside>

                    {
                        convLoading ? (
                            <Spinner type='mini' text='Fetching conversation ...' />
                        ) : convError ? (
                            <ErrorPage codeP='500' />
                        ) : activeChat ? (
                            <div className={`h-full min-h-0 min-w-0 flex-1 flex flex-col overflow-hidden bg-[#fafaff] dark:bg-gray-900/50 ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                                <header className="relative flex shrink-0 items-center justify-between border-b border-gray-200/70 bg-white px-4 py-4 dark:border-white/10 dark:bg-gray-900 sm:px-6">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleBackToConversations}
                                            className="rounded-xl p-2 text-gray-500 cursor-pointer transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white md:hidden"
                                            aria-label={t('auth.back')}
                                        >
                                            <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
                                        </button>
                                        <span className="relative shrink-0">
                                            <img src={activeChat?.user?.avatar_url ?? '/icons/avatar1.svg'} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                                            {activeChat?.user?.online && <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />}
                                        </span>
                                        <div className="min-w-0">
                                            <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate(`/profile/${activeChat.id}/${activeChat.user.username}`)}>{activeChat?.user?.name}</h2>
                                            {activeChat?.user?.online && (
                                                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    {t('messenger.activeNow')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative flex shrink-0 items-center gap-1 text-gray-500 dark:text-gray-400 sm:gap-2">
                                        <button
                                            type="button"
                                            onClick={() => showNotify(t('messenger.startingAudioCall', { name: activeChat?.user?.name }))}
                                            className="rounded-xl p-2.5 transition cursor-pointer hover:bg-[var(--special-purple)]/10 hover:text-[var(--special-purple)]"
                                            title={t('messenger.voiceCall')}
                                            aria-label={t('messenger.voiceCall')}
                                        >
                                            <Phone className="h-4.5 w-4.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => showNotify(t('messenger.startingVideoCall', { name: activeChat?.user?.name }))}
                                            className="rounded-xl p-2.5 transition cursor-pointer hover:bg-[var(--special-purple)]/10 hover:text-[var(--special-purple)]"
                                            title={t('messenger.videoCall')}
                                            aria-label={t('messenger.videoCall')}
                                        >
                                            <Video className="h-4.5 w-4.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowChatInfo(!showChatInfo)}
                                            className="rounded-xl p-2.5 transition cursor-pointer hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                                            title={t('messenger.chatInfo')}
                                            aria-label={t('messenger.chatInfo')}
                                            aria-expanded={showChatInfo}
                                            aria-haspopup="dialog"
                                        >
                                            <Info className="h-4.5 w-4.5" />
                                        </button>

                                        {showChatInfo && (
                                            <div role="dialog" aria-label={t('messenger.chatInfo')} className="absolute end-0 top-12 z-20 w-64 rounded-2xl border border-gray-200/80 bg-white/95 p-4 shadow-xl shadow-gray-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95">
                                                <div className="flex items-center gap-3">
                                                    <span className="relative shrink-0">
                                                        <img src={activeChat?.user?.avatar_url ?? '/icons/avatar1.svg'} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                                                        {activeChat?.user?.online && <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{activeChat?.name}</h3>
                                                        <p className={`mt-0.5 text-xs ${activeChat?.user?.online ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            {activeChat?.user?.online ? t('messenger.activeNow') : t('messenger.offline')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </header>

                                <div className="min-h-0 flex-1 flex flex-col overflow-y-auto overscroll-contain bg-gradient-to-b from-white via-[#fafaff] to-[#f6f5fc] p-4 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 sm:p-6">
                                    <div className="mt-auto flex flex-col gap-4">
                                        {
                                            messagesLoading ? (
                                                <Spinner text='Fetching messages ...' type='mini' />
                                            ) : messagesError ? (
                                                <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400">{t('messenger.messagesLoadFailed')}</p>
                                            ) : messages?.length > 0 ? messages.map((message) => (
                                                <MessageBubble key={message.id} message={message} attachmentAlt={t('messenger.uploadedAttachmentAlt')} />
                                            )) : (
                                                <span className='text-sm text-center text-gray-500'>{t('messenger.noMessages')}</span>
                                            )}
                                    </div>
                                </div>

                                <div className="relative shrink-0 border-t border-gray-200/70 bg-white dark:border-white/10 dark:bg-gray-900">
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full start-3 z-20 mb-2 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5 rounded-2xl border border-gray-200/80 bg-white/95 p-2.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/95">
                                            {emojis.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => addEmoji(emoji)}
                                                    className="rounded-lg p-1.5 text-lg transition-transform hover:scale-125"
                                                    aria-label={emoji}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 p-3 sm:gap-2.5 sm:p-4">
                                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" disabled={isUploadingImage || isSending} className="hidden" />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingImage || isSending}
                                            className="shrink-0 rounded-xl p-2.5 text-gray-400 transition hover:bg-[var(--special-purple)]/10 hover:text-[var(--special-purple)] disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500"
                                            title={t('messenger.sendImage')}
                                            aria-label={t('messenger.sendImage')}
                                        >
                                            <Image className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="shrink-0 rounded-xl p-2.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-500 dark:text-gray-500 dark:hover:bg-amber-950/30"
                                            title={t('messenger.addEmoji')}
                                            aria-label={t('messenger.addEmoji')}
                                            aria-expanded={showEmojiPicker}
                                        >
                                            <Smile className="h-5 w-5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            disabled={isSending || isUploadingImage}
                                            placeholder={t('messenger.typeMessage')}
                                            aria-label={t('messenger.typeMessage')}
                                            className="min-w-0 flex-1 rounded-2xl border border-gray-200/80 bg-white/75 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--special-purple)] focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-white/10 dark:bg-gray-800/70 dark:text-gray-100 dark:placeholder:text-gray-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSending || isUploadingImage || !messageInput.trim()}
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--special-purple)] text-white shadow-lg shadow-[var(--special-purple)]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--special-purple)]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--special-purple)]/25 disabled:cursor-not-allowed disabled:opacity-50"
                                            title={t('messenger.send')}
                                            aria-label={t('messenger.send')}
                                        >
                                            <Send className="h-4 w-4 rtl:rotate-180" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className='mx-auto flex'>
                                <EmptyContent text='Start talk' icon={<MessageCircle />} />
                            </div>
                        )
                    }
                </section>
            </main>
            <MobileCellNavbar />
        </>
    );
};
