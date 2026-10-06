import React, { useEffect, useState } from 'react'
import { MainLayout } from '../MainLayout';
import { ArrowLeft, CheckCheck, Image, MoreVertical, Phone, Search, Send, Smile, Video } from 'lucide-react';

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
    // const [filtredConversations, setFiltredConversations] = useState(conversations);
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
    }

    const handleSelectChat = (conv: typeof conversations[0]) => {
        setActiveChat(conv);
        setShowMobileChat(true);
    };

    const [term, setTerm] = useState('');
    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(term.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerm(e.target.value);
    };
    return (
        <MainLayout>
            <div className="h-[calc(100vh-55px)] bg-gray-50 flex justify-center items-center p-0 md:p-4">
                <div className="w-full max-w-5xl h-full md:h-[90vh] bg-white border border-gray-200 md:rounded-2xl flex overflow-hidden shadow-sm relative">

                    {/* Sidebar: Conversations */}
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
                                    onClick={() => handleSelectChat(conv)}
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

                    {/* Chat Area */}
                    <div className={`flex-1 flex-col bg-white ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
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
                            <div className="flex items-center space-x-4 text-gray-500">
                                <Phone className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
                                <Video className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
                                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-900 transition-colors" />
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end bg-gray-50/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.sender === 'me'
                                            ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <div className={`flex items-center justify-end space-x-1 mt-1 text-[9px] ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            <span>{msg.time}</span>
                                            {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center space-x-3">
                            <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Image className="w-5 h-5" />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
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
        </MainLayout>
    )
}
