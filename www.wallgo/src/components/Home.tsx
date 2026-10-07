import React from 'react'
import { MainLayout } from '../MainLayout'
import { PostCard } from '../pages/Post/PostCard';
import { Bookmark, Code, Compass, Flame, Globe, ImageIcon, Layers, Pencil, Plus, Settings, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const dummyPosts = [
    {
      id: 1,
      author: {
        name: 'Abderrahim Khali Ali',
        username: 'abderrahim',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      },
      content: 'Working on WallGo social media platform UI/UX today! The glassmorphism design with Tailwind is looking amazing. 🚀🔥',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      timestamp: '2h ago',
      likesCount: 24,
      commentsCount: 5,
    },
    {
      id: 2,
      author: {
        name: 'Sara Miller',
        username: 'saramiller',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      },
      content: 'Beautiful sunset captured during my evening walk. Photography is pure therapy! 📸✨',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      timestamp: '5h ago',
      likesCount: 142,
      commentsCount: 18,
    },
    {
      id: 2,
      author: {
        name: 'Mohammed',
        username: 'Ahmed',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      },
      content: 'Wooooooooooooow',
      timestamp: '5h ago',
      likesCount: 10,
      commentsCount: 4,
    },
  ];

  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-10">
        <div className="max-w-7xl mx-auto pt-6 px-2 flex justify-center lg:gap-6">

          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                    alt="Abderrahim Khali Ali"
                    className="w-11 h-11 rounded-full object-cover border-2 border-purple-100"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">Abderrahim Khali Ali</h4>
                    <p className="text-xs text-gray-500 truncate">@abderrahim</p>
                  </div>
                </div>
                <div className="flex justify-around text-center py-1 text-xs text-gray-600">
                  <div>
                    <span className="block font-bold text-gray-900 text-sm">128</span>
                    <span>Posts</span>
                  </div>
                  <div className="border-r border-gray-100"></div>
                  <div>
                    <span className="block font-bold text-gray-900 text-sm">1.4k</span>
                    <span>Followers</span>
                  </div>
                  <div className="border-r border-gray-100"></div>
                  <div>
                    <span className="block font-bold text-gray-900 text-sm">342</span>
                    <span>Following</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-4 mb-2">Discover</h3>

                <button onClick={() => navigate('/myposts')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm cursor-pointer">
                  <Pencil className="w-5 h-5 text-blue-500" />
                  <span>My Posts</span>
                </button>

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

                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-purple-50 text-gray-600 text-sm transition-colors cursor-pointer">
                  <Settings className="w-5 h-5 text-[var(--special-gray)]" />
                  <span>Settings</span>
                </button>

                <div className="pt-3 border-t border-gray-100 mt-3">
                  <button onClick={() => navigate('/create_post')} className="w-full py-3 bg-[var(--special-purple)] text-white font-medium text-sm rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer">
                    <Plus className="w-5 h-5" />
                    <span>Create Post</span>
                  </button>
                </div>
              </div>

            </div>
          </aside>

          <main className="w-full max-w-xl shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6 flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="What's on your mind, Abderrahim?"
                  className="w-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--special-purple)] transition-all rounded-full px-4 py-2.5 text-sm text-gray-800 outline-none border border-transparent"
                />
              </div>
            </div>

            <div className="space-y-4">
              {dummyPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
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

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center space-x-2 mb-4 text-gray-900 font-bold text-sm">
                  <Users className="w-4 h-4 text-[var(--special-purple)]" />
                  <span>Who to follow</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h5 className="text-xs font-semibold text-gray-900 leading-tight">Sara Miller</h5>
                        <span className="text-[11px] text-gray-500">@saramiller</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-[var(--special-purple)] text-xs font-semibold rounded-full transition-colors cursor-pointer">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </MainLayout>
  )
}
