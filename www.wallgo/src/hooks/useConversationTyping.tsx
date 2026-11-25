import { useCallback, useEffect, useRef, useState } from 'react'
import type { UserConversationTypingParams } from '../types'
import { api } from '../services/api';

export const useConversationTyping = ({ echo, conversationId, currentUserId, messageInput, isSending }: UserConversationTypingParams) => {
    const [peerTypingConversationId, setPeerTypingConversationId] = useState<number | null>(null);

    const lastSentRef = useRef<number>(0);
    const activeTypingRef = useRef<boolean>(false);
    const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hidePeerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const postTyping = useCallback((isTyping: boolean) => {
        if (!conversationId) return;
        void api.post(`/conversations/${conversationId}/typing`, { is_typing: isTyping })
            .catch((error: unknown) => console.error('Failed to update typing status', error));
    }, [conversationId]);

    const stopOwnTyping = useCallback(() => {
        if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
            stopTimerRef.current = null;
        }

        if (activeTypingRef.current) {
            activeTypingRef.current = false;
            postTyping(false);
        }
    }, [postTyping]);

    useEffect(() => {
        if (!conversationId) return;

        const trimmed = messageInput.trim();
        if (!trimmed || isSending) {
            stopOwnTyping();
            return;
        }

        const now = Date.now();
        if (!activeTypingRef.current || now - lastSentRef.current >= 800) {
            lastSentRef.current = now;
            activeTypingRef.current = true;
            postTyping(true);
        }

        if (stopTimerRef.current) {
            clearTimeout(stopTimerRef.current);
        }

        stopTimerRef.current = setTimeout(() => {
            stopOwnTyping();
        }, 1500);

        return () => {
            if (stopTimerRef.current) {
                clearTimeout(stopTimerRef.current);
            }
        };
    }, [conversationId, messageInput, isSending, postTyping, stopOwnTyping]);

    useEffect(() => {
        if (!echo || !conversationId) return;

        const channel = echo.private(`conversation.${conversationId}`);

        const handleTyping = (e: { user_id?: number | string; is_typing: boolean }) => {
            if (currentUserId !== undefined && String(e.user_id) === String(currentUserId)) {
                return;
            }

            if (hidePeerTimerRef.current) {
                clearTimeout(hidePeerTimerRef.current);
                hidePeerTimerRef.current = null;
            }

            setPeerTypingConversationId(e.is_typing ? conversationId : null);

            if (e.is_typing) {
                hidePeerTimerRef.current = setTimeout(() => {
                    setPeerTypingConversationId(null);
                    hidePeerTimerRef.current = null;
                }, 2500);
            }
        }

        channel.listen('.user.typing', handleTyping);

        return () => {
            stopOwnTyping();
            setPeerTypingConversationId(null);
            if (hidePeerTimerRef.current) {
                clearTimeout(hidePeerTimerRef.current);
                hidePeerTimerRef.current = null;
            }

            channel.stopListening('.user.typing', handleTyping);
        };
    }, [echo, conversationId, currentUserId, stopOwnTyping]);
    return { isPerringTyping: peerTypingConversationId === conversationId };
}
