import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../MainLayout';
import { ArrowLeft, CheckCheck, Image, MoreVertical, Phone, Search, Send, Smile, Video } from 'lucide-react';
import { Navbar } from '../layouts/Navbar';
import { Helmet } from 'react-helmet-async';

export const Messenger = () => {
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
            time: 'Yesterday',
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
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMessage]);
            showNotify('Image sent successfully!');
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
            <Helmet>
                <title>WallGo : Messenger</title>
            </Helmet>
            <Navbar />
            <div className="h-[calc(100vh-55px)] bg-gray-50 flex justify-center items-center p-0 md:p-4 relative">

                {notification && (
                    <div className="absolute top-6 z-50 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg transition-all animate-bounce">
                        {notification}
                    </div>
                )}

                <div className="w-full max-w-5xl h-full md:h-[90vh] bg-white border border-gray-200 md:rounded-2xl flex overflow-hidden shadow-sm relative">

                    <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col bg-white ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-gray-900 font-bold text-lg">Messenger</h2>
                        </div>

                        <div className="p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={term}
                                    onChange={handleChange}
                                    placeholder="Search messages..."
                                    className="w-full bg-gray-100 text-gray-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-none">
                            {filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => { setActiveChat(conv); setShowMobileChat(true); }}
                                    className={`flex items-center space-x-3 p-3.5 cursor-pointer transition-colors border-b border-gray-100 ${activeChat.id === conv.id ? 'bg-blue-50/60' : 'hover:bg-gray-50'
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
                                            <h4 className="text-gray-900 font-semibold text-sm truncate">{conv.name}</h4>
                                            <span className="text-[10px] text-gray-400">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
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

                    <div className={`flex-1 flex-col bg-white ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white relative">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setShowMobileChat(false)}
                                    className="md:hidden text-gray-500 hover:text-gray-900 mr-1 cursor-pointer"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <img src={activeChat.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h4 className="text-gray-900 font-semibold text-sm">{activeChat.name}</h4>
                                    <p className="text-[10px] text-green-600 font-medium">Active now</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-gray-500 relative">
                                <button
                                    onClick={() => showNotify(`Starting audio call with ${activeChat.name}...`)}
                                    className="hover:text-blue-600 transition-colors cursor-pointer"
                                    title="Voice Call"
                                >
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => showNotify(`Starting video call with ${activeChat.name}...`)}
                                    className="hover:text-blue-600 transition-colors cursor-pointer"
                                    title="Video Call"
                                >
                                    <Video className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="hover:text-gray-900 transition-colors cursor-pointer"
                                    title="More Options"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 text-xs">
                                        <button onClick={() => { setShowDropdown(false); showNotify('Chat muted'); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">Mute Notifications</button>
                                        <button onClick={() => { setShowDropdown(false); setMessages([]); showNotify('Chat cleared'); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Clear Chat</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end bg-gray-50/50">
                            {messages.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-2xl text-xs leading-relaxed overflow-hidden ${msg.sender === 'me'
                                                ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                                            }`}
                                    >
                                        {msg.image && (
                                            <div className="p-1">
                                                <img
                                                    src={msg.image}
                                                    alt="Uploaded attachment"
                                                    className="w-full max-h-60 object-cover rounded-xl"
                                                />
                                            </div>
                                        )}

                                        {msg.text && (
                                            <p className="px-4 py-2.5">{msg.text}</p>
                                        )}

                                        <div className={`flex items-center justify-end space-x-1 px-3 pb-2 text-[9px] ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            <span>{msg.time}</span>
                                            {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            {showEmojiPicker && (
                                <div className="absolute bottom-16 left-3 bg-white border border-gray-200 p-2 rounded-xl shadow-lg flex gap-2 z-20">
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

                            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center space-x-3">
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
                                    className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                    title="Send Image"
                                >
                                    <Image className="w-5 h-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                                    title="Add Emoji"
                                >
                                    <Smile className="w-5 h-5" />
                                </button>

                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-100 text-gray-900 text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200"
                                />

                                <button
                                    type="submit"
                                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
