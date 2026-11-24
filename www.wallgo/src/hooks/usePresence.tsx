import { useCallback, useEffect, useState } from 'react'
import { api_url } from '../services/api';
import axios from 'axios';
import { t } from 'i18next';
import useMoment from './useMoment';

export type PresenceUser = {
    id: number;
    name?: string;
    last_seen_at: string | null;
}

export type UserPresenceInfo = {
    isOnline: boolean;
    lastSeen: string | null;
    statusLabel: string;
}

let onlineIds = new Set<number>();
let lastSeenMap: Record<number, string | null> = {};
let activeChannelName: string | null = null;
let subscribedUserId: number | null = null;
let pingTimer: number | null = null;
const listeners = new Set<() => void>();

const emitChange = () => {
    listeners.forEach((fn) => fn());
};

const setUsersLastSeen = (users: PresenceUser[]) => {
    if (!users.length) return;
    let changed = false;

    for (const u of users) {
        if (u.id && u.last_seen_at !== undefined) {
            const id = Number(u.id);
            if (lastSeenMap[id] !== u.last_seen_at) {
                lastSeenMap = { ...lastSeenMap, [id]: u.last_seen_at ?? null };
                changed = true;
            }
        }
    }

    if (changed) emitChange();
};

const sendPing = async (userId: number) => {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    try {
        const res = await axios.post(
            `${api_url}/presence/ping`,
            {},
            { withCredentials: true, withXSRFToken: true }
        );

        if (res.data?.last_seen_at) {
            lastSeenMap = { ...lastSeenMap, [userId]: res.data.last_seen_at };
            emitChange();
        }
    } catch (error) {
        console.error('Presence heartbeat failed', error);
    }
};

const ensureSubscribed = (currentUserId?: number | null, channelName = 'online') => {
    if (!currentUserId) {
        if (subscribedUserId !== null && activeChannelName && window.Echo) {
            window.Echo.leave(activeChannelName);
        }
        subscribedUserId = null;
        activeChannelName = null;
        onlineIds = new Set();
        if (pingTimer) {
            window.clearInterval(pingTimer);
            pingTimer = null;
        }
        emitChange();
        return;
    }

    if (subscribedUserId === currentUserId && activeChannelName === channelName) {
        return;
    }

    if (activeChannelName && window.Echo) {
        window.Echo.leave(activeChannelName);
    }

    onlineIds = new Set();
    subscribedUserId = currentUserId;
    activeChannelName = channelName;

    if (window.Echo) {
        window.Echo
            .join(channelName)
            .here((users: PresenceUser[]) => {
                onlineIds = new Set(users.map((u) => Number(u.id)));
                setUsersLastSeen(users);
                emitChange();
            })
            .joining((user: PresenceUser) => {
                const id = Number(user.id);
                const next = new Set(onlineIds);
                next.add(id);
                onlineIds = next;
                if (user.last_seen_at !== undefined) {
                    lastSeenMap = { ...lastSeenMap, [id]: user.last_seen_at ?? null };
                }
                emitChange();
            })
            .leaving((user: PresenceUser) => {
                const id = Number(user.id);
                const next = new Set(onlineIds);
                next.delete(id);
                onlineIds = next;
                lastSeenMap = {
                    ...lastSeenMap,
                    [id]: new Date().toISOString(),
                };
                emitChange();
            });
    }

    if (pingTimer) {
        window.clearInterval(pingTimer);
    }
    void sendPing(currentUserId);
    pingTimer = window.setInterval(() => {
        if (subscribedUserId) {
            void sendPing(subscribedUserId);
        }
    }, 45_000);
};

export const usePresence = (currentUserId?: number | null, channelName = 'online') => {
    const [, setTick] = useState(0);
    const m = useMoment()!;

    useEffect(() => {
        const update = () => setTick((prev) => prev + 1);
        listeners.add(update);
        return () => {
            listeners.delete(update);
        };
    }, []);

    useEffect(() => {
        if (currentUserId !== undefined) {
            ensureSubscribed(currentUserId, channelName);
        }
    }, [currentUserId, channelName]);

    const isUserOnline = useCallback((userId?: number | null): boolean => {
        if (!userId) return false;
        return onlineIds.has(Number(userId));
    }, []);

    const getUserLastSeen = useCallback(
        (userId?: number | null, fallbackLastSeen?: string | null): string | null => {
            if (!userId) return fallbackLastSeen ?? null;
            return lastSeenMap[Number(userId)] ?? fallbackLastSeen ?? null;
        },
        []
    );

    const getPresenceInfo = useCallback(
        (userId?: number | null, fallbackLastSeen?: string | null): UserPresenceInfo => {
            const online = isUserOnline(userId);
            const lastSeen = getUserLastSeen(userId, fallbackLastSeen);

            if (online) {
                return {
                    isOnline: true,
                    lastSeen,
                    statusLabel: t('messenger.online', { defaultValue: 'Online' }),
                };
            }

            if (lastSeen) {
                return {
                    isOnline: false,
                    lastSeen,
                    statusLabel: t('messenger.lastSeenAt', {
                        defaultValue: `Last seen ${m(lastSeen).fromNow()}`,
                        time: m(lastSeen).fromNow(),
                    }),
                };
            }

            return {
                isOnline: false,
                lastSeen: null,
                statusLabel: t('messenger.offline', { defaultValue: 'Offline' }),
            };
        },
        [isUserOnline, getUserLastSeen, m]
    );

    return {
        isUserOnline,
        getUserLastSeen,
        getPresenceInfo,
        syncUsersPresence: setUsersLastSeen,
    };
}
