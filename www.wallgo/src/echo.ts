import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { api } from './pages/Auth/getUser';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

window.Pusher = Pusher;

const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname;
const port = Number(import.meta.env.VITE_REVERB_PORT || 8080);
const scheme = import.meta.env.VITE_REVERB_SCHEME || window.location.protocol.slice(0, -1);

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'abcdefg123456',
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws'],
    cluster: 'mt1',
    authorizer: (channel) => ({
        authorize: (socketId, callback) => {
            api.post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
            })
                .then(({ data }) => callback(null, data))
                .catch((error: unknown) => {
                    callback(
                        error instanceof Error ? error : new Error('Broadcast channel authorization failed'),
                        null,
                    );
                });
        },
    }),
});

export default window.Echo;