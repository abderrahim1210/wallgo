import moment from 'moment';


export type Conversation = {
    id: number;
    name: string;
    avatar_url: string;
    unread:number;
    latest_message: {
        id: number;
        content: string;
        created_at: string;
        is_read: boolean;
        media_url?: string | null;
    } | null;
    time: string;
    online: boolean;
    user: {
        id: number;
        name: string;
        avatar_url: string;
        username: string;
        online: boolean;
    }

};

type ConversationItemProps = {
    id?: number;
    conversation: Conversation;
    active: boolean;
    yesterdayLabel: string;
    startConversationLabel: string;
    imageMessageLabel: string;
    onSelect: (conversation: Conversation) => void;
    m: (time: string | Date | null) => moment.Moment;
};

const ConversationItem = ({ conversation, active, yesterdayLabel, startConversationLabel, imageMessageLabel, onSelect, m }: ConversationItemProps) => {
    const messageTime = conversation.latest_message ? m(conversation.latest_message.created_at) : null;
    const isYesterday = messageTime?.isValid()
        && m(new Date()).startOf('day').diff(messageTime.clone().startOf('day'), 'days') === 1;

    return (
    <button
        type="button"
        onClick={() => onSelect(conversation)}
        aria-pressed={active}
        className={`flex w-full items-center cursor-pointer gap-3 rounded-2xl p-3 text-start transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--special-purple)] ${active
            ? 'bg-[var(--special-purple)]/10 ring-1 ring-inset ring-[var(--special-purple)]/15'
            : 'hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
    >
        <span className="relative shrink-0">
            <img src={conversation?.user?.avatar_url || '/icons/avatar1.svg'} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/80 dark:ring-gray-800" />
            {conversation.online && (
                <span className="absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
            )}
        </span>
        <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{conversation?.user?.name}</span>
                {
                    messageTime?.isValid() && (
                        <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
                            {isYesterday ? yesterdayLabel : messageTime.fromNow()}
                        </span>
                    )
                }
            </span>
            <span className={`mt-1 block truncate text-xs text-gray-500 ${conversation.unread > 0 ? 'font-bold' : ''} dark:text-gray-400`}>{conversation.latest_message?.content || (conversation.latest_message?.media_url ? imageMessageLabel : startConversationLabel)}</span>
        </span>
        {conversation?.unread > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--special-purple)] px-1 text-[10px] font-bold text-white shadow-sm shadow-[var(--special-purple)]/25">
                {conversation?.unread}
            </span>
        )}
    </button>
    );
};

export default ConversationItem