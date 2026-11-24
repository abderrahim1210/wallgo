export type User = {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
    followers_count?: number;
};

export interface Post {
    id: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    content: string;
    media_url: string;
    schedule_time: string;
    unlock_time: string;
    expires_at: string;
    likes_count: number;
    is_liked: boolean;
    comments_count: number;
    created_at: string;
    is_owner?: boolean;
    postable?: {
        id?: number;
        name?: string;
        logo_url?: string;
        owner_id?: number;
    };
    postable_type: string;
    is_saved: boolean;
    visibility: 'private' | 'public';
    is_group_owner?: boolean;
    is_page_owner?: boolean;
    views_count: number;
}

export interface Group {
    id: number;
    owner_id: number;
    name: string;
    description: string;
    visibility: string;
    logo_url: string;
    banner_url: string;
    created_at: string;
    followers_count: number;
    is_followed: boolean;
}

export interface Page {
    id: number;
    owner_id: number;
    owner: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    name: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    created_at: string;
    followers_count: number;
    is_followed: boolean;
    posts: Post[];
}

export type Reel = {
    id: number;
    user_id: number;
    video_url: string;
    caption: string;
    audio_name: string;
    audio_url: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    is_owner: boolean;
    is_followed: boolean;
    is_liked: boolean;
    is_saved: boolean;
    public_id: number;
    views_count: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    reelable: {
        id: number;
        name: string;
        owner_id: number;
        logo_url: string;
    };
    reelable_type: string;
};

export type Request = {
    id: number;
    group: {
        id: number;
        name: string;
        logo_url: string;
    };
    answer: string;
    user: {
        id: number;
        username: string;
        avatar_url: string;
    };
    status: string;
    created_at: string;
};

export interface Notification {
    id: string;
    type: string;
    read_at: string;
    data: {
        user_id: number;
        user_name: string;
        user_avatar: string;
        post_id: number;
        type: string;
        message: string;
        link: string;
        followig_id?: number;
        comment_content?: string;
    };
    created_at: string;
}
