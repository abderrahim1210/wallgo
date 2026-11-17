import { CheckCheck } from 'lucide-react';
import React from 'react'

export type ChatMessage = {
    id: number;
    sender: 'me' | 'them';
    content: string;
    time: string;
    image?: string;
};

type MessageBubbleProps = {
    message: ChatMessage;
    attachmentAlt: string;
};

export const MessageBubble = ({ message, attachmentAlt }: MessageBubbleProps) => (
    <div className={`flex min-w-0 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
        <div
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
);