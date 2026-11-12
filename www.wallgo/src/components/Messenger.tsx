import React, { useRef, useState } from 'react'
import { ArrowLeft, CheckCheck, Image, MoreVertical, Phone, Search, Send, Smile, Video } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { Helmet } from 'react-helmet-async';
import { MobileCellNavbar } from '../layouts/MobileCellNavbar';
import { useTranslation } from 'react-i18next';

export const Messenger = () => {
    const { t, i18n } = useTranslation();
    const [conversations, setConversations] = useState([
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
    ]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNotify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2500);
    }
    const [activeChat, setActiveChat] = useState(conversations[0]);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'them', text: 'Salam! Labas 3lik?', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Walaeikom Assalam, alhamdulillah kolchi مزيان!', time: '10:32 AM' },
        { id: 3, sender: 'them', text: 'Safée, daccord! Nchofouk gheda ncha2llah. 🚀', time: '10:45 AM' },
    ]);
    const [showMobileChat, setShowMobileChat] = useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        const newMessage = {
            id: messages.length + 1,
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages([...messages, newMessage]);
        setMessageInput('');
        setShowEmojiPicker(false);
    }

    const handleSelectChat = (conv: typeof conversations[0]) => {
        setActiveChat(conv);
        setShowMobileChat(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const newMessage = {
                id: messages.length + 1,
                sender: 'me',
                text: '',
                image: imageUrl,
                time: new Date().toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMessage]);
            showNotify(t('messenger.imageSent'));
        }
    };

    const addEmoji = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
    };

    const emojis = ['😊', '🚀', '🔥', '👍', '❤️', '💡', '😎', '💻', '✨', '⭐'];

    const [term, setTerm] = useState('');
    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(term.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm(e.target.value);
    };
    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-95px)] bg-gray-50 dark:bg-gray-800 flex justify-center items-center p-0 md:p-4 pb-10 md:pb-4 relative">
                <Helmet>
                    <title>{t('messenger.title')}</title>
                </Helmet>

                {notification && (
                    <div className="absolute top-6 z-50 bg-gray-900 dark:bg-gray-800 text-white text-xs px-4 py-2 rounded-xl shadow-lg transition-all animate-bounce">
                        {notification}
                    </div>
                )}

                <div className="w-full max-w-5xl h-full md:h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 md:rounded-2xl flex overflow-hidden shadow-sm relative">

                    <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-gray-900 dark:text-gray-100 font-bold text-lg">{t('messenger.title')}</h2>
                        </div>

                        <div className="p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    value={term}
                                    onChange={handleChange}
                                    placeholder={t('messenger.searchPlaceholder')}
                                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-none">
                            {filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => { setActiveChat(conv); setShowMobileChat(true); }}
                                    className={`flex items-center space-x-3 p-3.5 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 ${activeChat.id === conv.id ? 'bg-blue-50/60 dark:bg-blue-950/40' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="relative">
                                        <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                                        {conv.online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-sm truncate">{conv.name}</h4>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{conv.time === 'yesterday' ? t('messenger.yesterday') : conv.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`flex-1 flex-col bg-white dark:bg-gray-900 ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900 relative">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowMobileChat(false)}
                                    className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mr-1 cursor-pointer"
                                    aria-label={t('auth.back')}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <img src={activeChat.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-sm">{activeChat.name}</h4>
                                    <p className="text-[10px] text-green-600 dark:text-green-400 font-medium">{t('messenger.activeNow')}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400 relative">
                                <button
                                    onClick={() => showNotify(t('messenger.startingAudioCall', { name: activeChat.name }))}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                    title={t('messenger.voiceCall')}
                                >
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => showNotify(t('messenger.startingVideoCall', { name: activeChat.name }))}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                    title={t('messenger.videoCall')}
                                >
                                    <Video className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
                                    title={t('messenger.moreOptions')}
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-10 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-20 text-xs">
                                        <button onClick={() => { setShowDropdown(false); showNotify(t('messenger.chatMuted')); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">{t('messenger.muteNotifications')}</button>
                                        <button onClick={() => { setShowDropdown(false); setMessages([]); showNotify(t('messenger.chatCleared')); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400">{t('messenger.clearChat')}</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end bg-gray-50/50 dark:bg-gray-800/50">
                            {messages.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-2xl text-xs leading-relaxed overflow-hidden ${msg.sender === 'me'
                                            ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                                            : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700 shadow-sm'
                                            }`}
                                    >
                                        {msg.image && (
                                            <div className="p-1">
                                                <img
                                                    src={msg.image}
                                                    alt={t('messenger.uploadedAttachmentAlt')}
                                                    className="w-full max-h-60 object-cover rounded-xl"
                                                />
                                            </div>
                                        )}

                                        {msg.text && (
                                            <p className="px-4 py-2.5">{msg.text}</p>
                                        )}

                                        <div className={`flex items-center justify-end space-x-1 px-3 pb-2 text-[9px] ${msg.sender === 'me' ? 'text-blue-100 dark:text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                                            <span>{msg.time}</span>
                                            {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            {showEmojiPicker && (
                                <div className="absolute bottom-16 left-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2 rounded-xl shadow-lg flex gap-2 z-20">
                                    {emojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => addEmoji(emoji)}
                                            className="text-lg hover:scale-125 transition-transform cursor-pointer"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center space-x-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                    title={t('messenger.sendImage')}
                                >
                                    <Image className="w-5 h-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                    title={t('messenger.addEmoji')}
                                >
                                    <Smile className="w-5 h-5" />
                                </button>

                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={t('messenger.typeMessage')}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200 dark:border-gray-700"
                                />

                                <button
                                    type="submit"
                                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-sm"
                                    title={t('messenger.send')}
                                    aria-label={t('messenger.send')}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <MobileCellNavbar />
        </>
    )
}
