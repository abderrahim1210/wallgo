import React, { useEffect, useState } from 'react'
import { MainLayout } from '../MainLayout'
import { PostCard } from '../pages/Post/PostCard';
import { Bookmark, Code, Compass, Flame, Globe, ImageIcon, Layers, Pencil, Plus, Settings, TrendingUp, Users } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useModal } from '../hooks/ModalProvider';
import ModalTemplate from '../templates/ModalTemplate';
import axios from 'axios';
import type { Post } from '../templates/PostGrid';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { PostGrid } from '../templates/PostGrid';
import toast from 'react-hot-toast';
import { useFollow } from './useFollow';
import { FollowUser } from './FollowUser';
import Spinner from '../templates/Spinner';
import { ErrorPage } from './ErrorPage';

export type User = {
  id: number,
  name: string,
  username: string,
  avatar_url: string
}
export const Home = () => {
  const api_url = 'https://api.wallgo.test';

  const fetchPosts = async ({pageParam=1}): Promise<Post[]> => {
    try {
      const res = await axios.get(`${api_url}/posts?page=${pageParam}`, { withCredentials: true, withXSRFToken: true });
      return res.data.success ? res.data.posts : [];
    } catch (err: any) {
      console.log(err?.response?.data?.message);
      return [];
    }
  }

  const { data:ps, isLoading:postsLoading, isError:postsError, fetchNextPage,hasNextPage,isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam:(lastPage:any) => {
      if (lastPage.current_page < lastPage.last_page){
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam:1
  });
  const posts: Post[] = ps?.pages.flatMap((page: any) => page?.data || []) || [];

  const navigate = useNavigate();
  const fetchInfos = async () => {
    try {
      const res = await axios.get(`${api_url}/get_user`, { withCredentials: true, withXSRFToken: true });
      if (res.data.success) return res.data;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${api_url}/get_suggested_users`, { withCredentials: true, withXSRFToken: true });
      if (res.data.success) return res.data.users;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }

  const { data: users = [] } = useQuery({
    queryKey: ['suggested_users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data } = useQuery({
    queryKey: ['user_data_home'],
    queryFn: fetchInfos,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const profile = data?.user || null;
  const stats = data?.stats || [];
  const quotes = [
    "Share your world on WallGo. 🎈",
    "Connect, inspire, and grow together. ✨",
    "Your wall, your community, your voice. 🎤",
    "Build ideas, spark conversations.",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [write, isWrite] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const checkWrite = (e: React.ChangeEvent<HTMLInputElement>) => {
    isWrite(e.target.value.trim().length > 0);
    setContent(e.target.value);
  }

  const handleSubmit = async () => {
    if (content === '') return toast.error('Type a text for add a post');
    try {
      const res = await axios.post(`${api_url}/posts/create`, { content: content }, { withCredentials: true, withXSRFToken: true });
      if (res.data.success) {
        toast.success(res.data.message || 'Post uploaded successfully');
        setTimeout(() => {
          navigate('/account/profile');
        }, 1000);
      } else {
        toast.error(res.data.message || 'Failed to upload the post');
        console.error(res.data.message);
      }
    } catch (err: any) {
      console.log(err?.response?.data);
    }
  }

  const redirectToProfile = () => {
    navigate(`/account/profile`);
  }

  const { add_follow } = useFollow();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-10">
        <div className="max-w-7xl mx-auto pt-6 px-2 flex justify-center lg:gap-6">

          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-4">

              {
                profile ? (
                  <>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
                        <img
                          src={profile?.avatar_url ?? '/icons/avatar1.svg'}
                          alt="Abderrahim Khali Ali"
                          className="w-11 h-11 rounded-full object-cover border-2 border-purple-100"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">{profile?.name}</h4>
                          <p className="text-xs text-gray-500 truncate">@{profile?.username}</p>
                        </div>
                      </div>
                      <div className="flex justify-around text-center py-1 text-xs text-gray-600">
                        <div>
                          <span className="block font-bold text-gray-900 text-sm">{stats?.postsCount}</span>
                          <span>Posts</span>
                        </div>
                        <div className="border-r border-gray-100"></div>
                        <div>
                          <span className="block font-bold text-gray-900 text-sm">{stats?.followers_count}</span>
                          <span className='cursor-pointer' onClick={() => redirectToProfile()}>Followers</span>
                        </div>
                        <div className="border-r border-gray-100"></div>
                        <div>
                          <span className="block font-bold text-gray-900 text-sm">{stats?.followings_count}</span>
                          <span className='cursor-pointer' onClick={() => redirectToProfile()}>Following</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 mb-2">Discover</h3>

                      <button onClick={() => navigate('/pages')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm cursor-pointer">
                        <Layers className="w-5 h-5 text-emerald-500" />
                        <span>Pages</span>
                      </button>

                      <button onClick={() => navigate('/groups')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm cursor-pointer">
                        <Users className="w-5 h-5 text-[var(--special-red)]" />
                        <span>Groups</span>
                      </button>

                      <button onClick={() => navigate('/saved_posts')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm cursor-pointer">
                        <Bookmark className="w-5 h-5 text-purple-500" />
                        <span>Bookmarks</span>
                      </button>

                      <button onClick={() => navigate('/settings')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-purple-50 text-gray-600 text-sm transition-colors cursor-pointer">
                        <Settings className="w-5 h-5 text-[var(--special-gray)]" />
                        <span>Settings</span>
                      </button>

                      <div className="pt-3 border-t border-gray-100 mt-3">
                        <button onClick={() => navigate('/create_post')} className="w-full py-3 bg-[var(--special-purple)] text-white font-medium text-sm rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:bg-[var(--special-white)] hover:text-[var(--special-purple)] hover:border hover:border-[var(--special-purple)]">
                          <Plus className="w-5 h-5" />
                          <span>Create Post</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md space-y-4 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                      <div className="space-y-1.5 relative z-10">
                        <h3 className="font-bold text-base tracking-tight">Join WallGo Today! 🚀</h3>
                        <p className="text-xs text-purple-200 leading-relaxed">
                          Connect with creators, share your favorite wallpapers, and build your community.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1 relative z-10">
                        <Link
                          to="/account/login"
                          className="flex-1 py-2.5 px-3 bg-white hover:bg-purple-50 text-purple-900 text-xs font-semibold rounded-xl text-center transition shadow-sm"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/account/signup"
                          className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl text-center transition shadow-sm border border-purple-500/50"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          </aside>

          <main className="w-full max-w-xl shrink-0">
            {
              !profile && (
                <>
                  <div className="lg:hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md space-y-4 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                    <div className="space-y-1.5 relative z-10">
                      <h3 className="font-bold text-base tracking-tight">Join WallGo Today! 🚀</h3>
                      <p className="text-xs text-purple-200 leading-relaxed">
                        Connect with creators, share your favorite wallpapers, and build your community.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 relative z-10">
                      <Link
                        to="/account/login"
                        className="flex-1 py-2.5 px-3 bg-white hover:bg-purple-50 text-purple-900 text-xs font-semibold rounded-xl text-center transition shadow-sm"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/account/signup"
                        className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl text-center transition shadow-sm border border-purple-500/50"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </>
              )
            }
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6 w-full">
              <div className='mb-3 px-1 h-10 flex items-center overflow-hidden'>
                <p className={`quote text-2xs text-gray-500 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                  {quotes[currentIndex]}
                </p>

              </div>
              <div className='flex items-center space-x-3 flex-1 min-w-0'>
                <img
                  src={profile?.avatar_url ?? '/icons/avatar1.svg'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="relative flex-1 flex items-center space-x-2 min-w-0">
                  <input
                    name='content'
                    value={content}
                    type="text"
                    placeholder={`What's on your mind, ${profile?.username ?? ''}?`}
                    onChange={checkWrite}
                    className="w-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--special-purple)] transition-all rounded-full px-4 py-2.5 text-sm text-gray-800 outline-none border border-gray-200"
                  />
                  {
                    write && (
                      <button onClick={handleSubmit} className='px-5 py-2.5 bg-[var(--special-purple)] text-white text-sm font-medium rounded-full hover:opacity-90 transition-all shadow-sm cursor-pointer animate-fadeIn font-semibold shrink-0'>Post</button>
                    )
                  }
                </div>
              </div>


            </div>

            <div className="space-y-4">
              {
                postsLoading ? (
                  <Spinner text='Fetching posts ...' type='mini' />
                ) : postsError ? (
                  <ErrorPage codeP='500' />
                ) : (
                  <PostGrid posts={posts} isLoading={postsLoading} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} suggested_follow={users} />
                )
              }
            </div>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 space-y-6">
            <div className="sticky top-20 space-y-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center space-x-2 mb-4 text-gray-900 font-bold text-sm">
                  <TrendingUp className="w-4 h-4 text-[var(--special-purple)]" />
                  <span>Trending for you</span>
                </div>
                <div className="space-y-3">
                  <div className="cursor-pointer group">
                    <p className="text-xs text-gray-400">Technology • Trending</p>
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[var(--special-purple)] transition-colors">#TailwindCSS</h4>
                    <p className="text-xs text-gray-500">14.2k Posts</p>
                  </div>
                  <div className="cursor-pointer group">
                    <p className="text-xs text-gray-400">Web Development • Trending</p>
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[var(--special-purple)] transition-colors">#LaravelPHP</h4>
                    <p className="text-xs text-gray-500">8.9k Posts</p>
                  </div>
                </div>
              </div>

              {
                users?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4 text-gray-900 font-bold text-sm">
                      <Users className="w-4 h-4 text-[var(--special-purple)]" />
                      <span>Who to follow</span>
                    </div>
                    {
                      users?.map((u: User, index: number) => (
                        <FollowUser user={u} onFollow={add_follow} key={index} />
                      ))
                    }
                  </div>
                )
              }
            </div>
          </aside>

        </div>
      </div>
    </MainLayout>
  )
}
