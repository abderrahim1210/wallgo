import React, { useRef, useState } from 'react';
import { ArrowLeft, CheckCheck, Image, Info, Phone, Search, Send, Smile, Video } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../layouts/Navbar';
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';

type Conversation = {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
};

type ChatMessage = {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
    image?: string;
};

type ConversationItemProps = {
    conversation: Conversation;
    active: boolean;
    yesterdayLabel: string;
    onSelect: (conversation: Conversation) => void;
};

const ConversationItem = ({ conversation, active, yesterdayLabel, onSelect }: ConversationItemProps) => (
    <button
        type="button"
        onClick={() => onSelect(conversation)}
        aria-pressed={active}
        className={`flex w-full items-center gap-3 rounded-2xl p-3 text-start transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)] ${
            active
                ? 'bg-[var(--special-purple)]/10'
                : 'border-s-transparent hover:bg-white/70 dark:hover:bg-white/5'
        }`}
    >
        <span className="relative shrink-0">
            <img src={conversation.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-800" />
            {conversation.online && (
                <span className="absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
            )}
        </span>
        <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{conversation.name}</span>
                <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
                    {conversation.time === 'yesterday' ? yesterdayLabel : conversation.time}
                </span>
            </span>
            <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">{conversation.lastMessage}</span>
        </span>
        {conversation.unread > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--special-purple)] px-1 text-[10px] font-bold text-white shadow-sm shadow-[var(--special-purple)]/25">
                {conversation.unread}
            </span>
        )}
    </button>
);

type MessageBubbleProps = {
    message: ChatMessage;
    attachmentAlt: string;
};

const MessageBubble = ({ message, attachmentAlt }: MessageBubbleProps) => (
    <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
        <div
            className={`max-w-[85%] overflow-hidden rounded-2xl text-sm leading-relaxed shadow-sm md:max-w-md ${
                message.sender === 'me'
                    ? 'rounded-ee-md bg-[var(--special-purple)] text-white shadow-[var(--special-purple)]/15'
                    : 'rounded-es-md border border-gray-200/80 bg-white/85 text-gray-800 dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-100'
            }`}
        >
            {message.image && (
                <div className="p-1.5">
                    <img src={message.image} alt={attachmentAlt} className="max-h-60 w-full rounded-xl object-cover" />
                </div>
            )}
            {message.text && <p className="px-4 py-2.5">{message.text}</p>}
            <div className={`flex items-center justify-end gap-1.5 px-3 pb-2 text-[10px] ${message.sender === 'me' ? 'text-white/75' : 'text-gray-400 dark:text-gray-500'}`}>
                <span>{message.time}</span>
                {message.sender === 'me' && <CheckCheck className="h-3 w-3" />}
            </div>
        </div>
    </div>
);

const conversations: Conversation[] = [
    {
        id: 1,
        name: 'Sara Miller',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        lastMessage: 'Safée, daccord! Nchofouk gheda ncha2llah. 🚀',
        time: '10:45 AM',
        unread: 2,
        online: true,
    },
    {
        id: 2,
        name: 'Abderrahim Khali Ali',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        lastMessage: 'Wach wajadti dak l-code dyal Laravel?',
        time: 'yesterday',
        unread: 0,
        online: false,
    },
];

export const Messenger = () => {
    const { t, i18n } = useTranslation();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeChat, setActiveChat] = useState(conversations[0]);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, sender: 'them', text: 'Salam! Labas 3lik?', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Walaeikom Assalam, alhamdulillah kolchi مزيان!', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'Safée, daccord! Nchofouk gheda ncha2llah. 🚀', time: '10:45 AM' },
    ]);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [term, setTerm] = useState('');

    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2500);
    };

    const currentTime = () => new Date().toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = messageInput.trim();
        if (!text) return;

        setMessages((currentMessages) => [
            ...currentMessages,
            { id: currentMessages.length + 1, sender: 'me', text, time: currentTime() },
        ]);
        setMessageInput('');
        setShowEmojiPicker(false);
    };

    const handleSelectChat = (conversation: Conversation) => {
        setActiveChat(conversation);
        setShowMobileChat(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setMessages((currentMessages) => [
            ...currentMessages,
            { id: currentMessages.length + 1, sender: 'me', text: '', image: imageUrl, time: currentTime() },
        ]);
        showNotify(t('messenger.imageSent'));
        e.target.value = '';
    };

    const addEmoji = (emoji: string) => {
        setMessageInput((currentInput) => currentInput + emoji);
    };

    const emojis = ['😊', '🚀', '🔥', '👍', '❤️', '💡', '😎', '💻', '✨', '⭐'];
    const filteredConversations = conversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(term.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <main className="relative flex min-h-[calc(100dvh-95px)] items-center justify-center bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-100 px-0 pb-20 pt-0 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 md:px-4 md:py-5 md:pb-5">
                <Helmet>
                    <title>{t('messenger.title')}</title>
                </Helmet>

                {notification && (
                    <div role="status" className="absolute top-5 z-50 rounded-full border border-white/20 bg-gray-900/90 px-5 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-xl dark:bg-gray-800/90">
                        {notification}
                    </div>
                )}

                <section
                    dir={i18n.dir()}
                    aria-label={t('messenger.title')}
                    className="relative flex h-[calc(100dvh-180px)] min-h-[420px] max-h-[820px] w-full overflow-hidden border-y border-white/70 bg-white/80 shadow-2xl shadow-indigo-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-gray-900/75 md:h-[min(82vh,820px)] md:min-h-[560px] md:max-w-6xl md:rounded-3xl md:border"
                >
                    <aside className={`w-full shrink-0 flex-col border-e border-gray-200/70 bg-white/45 dark:border-white/10 dark:bg-gray-950/20 md:flex md:w-[340px] ${showMobileChat ? 'hidden' : 'flex'}`}>
                        <div className="border-b border-gray-200/70 px-5 py-5 dark:border-white/10">
                            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">{t('messenger.title')}</h1>
                        </div>

                        <div className="p-4">
                            <label className="relative block">
                                <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="search"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder={t('messenger.searchPlaceholder')}
                                    aria-label={t('messenger.searchPlaceholder')}
                                    className="w-full rounded-2xl border border-gray-200/80 bg-white/70 py-3 pe-4 ps-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--special-purple)] focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-white/10 dark:bg-gray-800/55 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />
                            </label>
                        </div>

                        <nav aria-label={t('messenger.title')} className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                            {filteredConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    active={activeChat.id === conversation.id}
                                    yesterdayLabel={t('messenger.yesterday')}
                                    onSelect={handleSelectChat}
                                />
                            ))}
                        </nav>
                    </aside>

                    <div className={`min-w-0 flex-1 flex-col bg-white/35 dark:bg-gray-900/25 ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                        <header className="relative flex items-center justify-between border-b border-gray-200/70 bg-white/45 px-4 py-4 dark:border-white/10 dark:bg-gray-900/35 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowMobileChat(false)}
                                    className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white md:hidden"
                                    aria-label={t('auth.back')}
                                >
                                    <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
                                </button>
                                <span className="relative shrink-0">
                                    <img src={activeChat.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                                    {activeChat.online && <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />}
                                </span>
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white">{activeChat.name}</h2>
                                    {activeChat.online && (
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
                                    onClick={() => showNotify(t('messenger.startingAudioCall', { name: activeChat.name }))}
                                    className="rounded-xl p-2.5 transition hover:bg-[var(--special-purple)]/10 hover:text-[var(--special-purple)]"
                                    title={t('messenger.voiceCall')}
                                    aria-label={t('messenger.voiceCall')}
                                >
                                    <Phone className="h-4.5 w-4.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => showNotify(t('messenger.startingVideoCall', { name: activeChat.name }))}
                                    className="rounded-xl p-2.5 transition hover:bg-[var(--special-purple)]/10 hover:text-[var(--special-purple)]"
                                    title={t('messenger.videoCall')}
                                    aria-label={t('messenger.videoCall')}
                                >
                                    <Video className="h-4.5 w-4.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowChatInfo(!showChatInfo)}
                                    className="rounded-xl p-2.5 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
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
                                                <img src={activeChat.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                                                {activeChat.online && <span className="absolute bottom-0 end-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />}
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{activeChat.name}</h3>
                                                <p className={`mt-0.5 text-xs ${activeChat.online ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {activeChat.online ? t('messenger.activeNow') : t('messenger.offline')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-1 border-t border-gray-200/70 pt-3 text-xs dark:border-white/10">
                                            <button type="button" onClick={() => { setShowChatInfo(false); showNotify(t('messenger.chatMuted')); }} className="w-full rounded-xl px-3 py-2.5 text-start text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">{t('messenger.muteNotifications')}</button>
                                            <button type="button" onClick={() => { setShowChatInfo(false); setMessages([]); showNotify(t('messenger.chatCleared')); }} className="w-full rounded-xl px-3 py-2.5 text-start text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">{t('messenger.clearChat')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </header>

                        <div className="flex flex-1 flex-col justify-end space-y-4 overflow-y-auto bg-gradient-to-b from-white/10 to-gray-100/35 p-4 dark:to-black/10 sm:p-6">
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} attachmentAlt={t('messenger.uploadedAttachmentAlt')} />
                            ))}
                        </div>

                        <div className="relative border-t border-gray-200/70 bg-white/55 dark:border-white/10 dark:bg-gray-900/45">
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
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="shrink-0 rounded-xl p-2.5 text-gray-400 transition hover:bg-[var(--special-purple)]/10 hover:text-[var(--special-purple)] dark:text-gray-500"
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
                                    placeholder={t('messenger.typeMessage')}
                                    aria-label={t('messenger.typeMessage')}
                                    className="min-w-0 flex-1 rounded-2xl border border-gray-200/80 bg-white/75 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--special-purple)] focus:ring-4 focus:ring-[var(--special-purple)]/10 dark:border-white/10 dark:bg-gray-800/70 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--special-purple)] text-white shadow-lg shadow-[var(--special-purple)]/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--special-purple)]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--special-purple)]/25"
                                    title={t('messenger.send')}
                                    aria-label={t('messenger.send')}
                                >
                                    <Send className="h-4 w-4 rtl:rotate-180" />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <MobileCellNavbar />
        </>
    );
};
