import React, { useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { Bell, ChevronRight, Moon, Settings as SettingsIcon, Shield, User } from 'lucide-react'

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  return (
    <MainLayout>
      <Helmet>
        <title>WallGo : Settings</title>
      </Helmet>
      <div className='px-4 py-6'>
        <div className='flex justify-start items-center'>
          <h1 className='font-bold text-3xl flex items-center gap-2'><SettingsIcon className='w-8 h-8 text-[var(--special-purple)]' /> Settings</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-5 gap-6">

          <div className="md:col-span-1 space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'account' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <span className="flex items-center gap-3"><User className="w-4 h-4" /> Account</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'notifications' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Notifications</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'security' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <span className="flex items-center gap-3"><Shield className="w-4 h-4" /> Security</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'appearance' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <span className="flex items-center gap-3"><Moon className="w-4 h-4" /> Appearance</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>

          <div className="md:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
                  <p className="text-sm text-gray-500">Update your account details and preferences.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] outline-none text-sm bg-gray-50/50">
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Visibility</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--special-purple)] outline-none text-sm bg-gray-50/50">
                      <option value="public">Public Account</option>
                      <option value="private">Private Account</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500">Choose what notifications you want to receive.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Email Notifications for Likes & Comments</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--special-purple)]" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">New Follower Alerts</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--special-purple)]" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500">Manage your password and security credentials.</p>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-gray-50/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-gray-50/50" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500">Customize how WallGo looks on your device.</p>
                </div>
                <hr className="border-gray-100" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme Mode</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm bg-gray-50/50">
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode (Coming soon)</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button className="px-6 py-2.5 bg-[var(--special-purple)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition cursor-pointer">
                Save Changes
              </button>
            </div>

          </div>

        </div>
      </div>

    </MainLayout>
  )
}
