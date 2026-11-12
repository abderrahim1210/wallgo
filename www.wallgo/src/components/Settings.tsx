import React, { useEffect, useState } from 'react'
import { MainLayout } from '../MainLayout'
import { Helmet } from 'react-helmet-async'
import { Bell, ChevronRight, Info, LogOut, Moon, Settings as SettingsIcon, Shield, Sun, User } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../hooks/AuthProvider'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { api_url } from '../pages/Auth/getUser'
import { useQuery } from '@tanstack/react-query'
import LoadingButton from '../Icons/LoadingButton'
import { useTranslation } from 'react-i18next'
import useDarkMode from '../hooks/useDarkMode'

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { user } = useAuth()!;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    visibility: 'public',
    currentPassword: '',
    password: '',
    emails_likes_notifications: false,
    new_follower_alerts: false
  });

  useEffect(() => {
    if (user) {
      setData({
        visibility: user?.visibility,
        password: '',
        currentPassword: '',
        emails_likes_notifications: Boolean(user?.emails_likes_notifications),
        new_follower_alerts: Boolean(user?.new_follower_alerts)
      })
    }
  }, [user]);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setData(prev => ({ ...prev, [name]: checked }));
    } else {
      const { value } = e.target;
      setData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${api_url}/settings`, data, { withCredentials: true, withXSRFToken: true }).then(res => {
        if (res.data.success) {
          setLoading(false);
          toast.success(res.data.message || t('settings.updatedSuccessfully'));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        else {
          setLoading(false);
          toast.error(res.data.message || t('settings.updateFailed'));
          console.log(res.data.message);
        }
      });
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message || t('settings.updateFailed'));
      console.log(err?.response?.data);
    }
  }

  const handleLogOut = async () => {
    try {
      const res = await axios.delete(`${api_url}/logout`, { withCredentials: true, withXSRFToken: true });
      if (res.data.success) {
        toast.success(res.data.message || t('common.logoutSuccess'));
        setTimeout(() => {
          navigate('/account/login');
        }, 1000);
      }
    } catch (err: any) {
      console.error(err?.response?.data);
      toast.error(t('settings.logoutFailed'));
    }
  }

  const { i18n, t } = useTranslation();
  const { theme, isDarkMode, setTheme, toggleDarkMode } = useDarkMode();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    if (selectedTheme === 'light' || selectedTheme === 'dark' || selectedTheme === 'system') {
      setTheme(selectedTheme);
    }
  }

  const handleChangeLanguages = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
  return (
    <MainLayout>
      <Helmet>
        <title>{t('settings.title')}</title>
      </Helmet>
      <div className='px-4 py-6'>
        <div className='flex justify-start items-center'>
          <h1 className='font-bold text-3xl flex items-center gap-2'><SettingsIcon className='w-8 h-8 text-[var(--special-purple)]' /> {t('settings.title')}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-5 gap-6">

          <div className="md:col-span-1 space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'account' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span className="flex items-center gap-3"><User className="w-4 h-4" /> {t('common.account')}</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'notifications' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> {t('common.notifications')}</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'security' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span className="flex items-center gap-3"><Shield className="w-4 h-4" /> {t('common.security')}</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${activeTab === 'appearance' ? 'bg-[var(--special-purple)] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <span className="flex items-center gap-3"><Moon className="w-4 h-4" /> {t('common.appearance')}</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>

          <div className="md:col-span-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('settings.accountInformation')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.accountInformationDescription')}</p>
                </div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('common.language')}</label>
                    <select value={i18n.language} onChange={handleChangeLanguages} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] outline-none text-sm bg-gray-50/50 dark:bg-gray-800/50">
                      <option value="en">{t('common.english')}</option>
                      <option value="ar">{t('common.arabic')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.accountVisibility')}</label>
                    <select value={data?.visibility} name='visibility' onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-[var(--special-purple)] outline-none text-sm bg-gray-50/50 dark:bg-gray-800/50">
                      <option value="public">{t('settings.publicAccount')}</option>
                      <option value="private">{t('settings.privateAccount')}</option>
                    </select>
                  </div>
                  <div>
                    <button onClick={handleLogOut} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200 cursor-pointer">
                      <LogOut className="w-5 h-5 flex-shrink-0" />
                      <span>{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('settings.notificationPreferences')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notificationPreferencesDescription')}</p>
                </div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.emailLikesComments')}</span>
                    <input type="checkbox" name='emails_likes_notifications' checked={data?.emails_likes_notifications} onChange={handleChange} className="w-4 h-4 accent-[var(--special-purple)]" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.newFollowerAlerts')}</span>
                    <input type="checkbox" name='new_follower_alerts' checked={data?.new_follower_alerts} onChange={handleChange} className="w-4 h-4 accent-[var(--special-purple)]" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('settings.securitySettings')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.securitySettingsDescription')}</p>
                </div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.currentPassword')}</label>
                    <input value={data.currentPassword} name='currentPassword' onChange={handleChange} type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none text-sm bg-gray-50/50 dark:bg-gray-800/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.newPassword')}</label>
                    <input value={data.password} name='password' onChange={handleChange} type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none text-sm bg-gray-50/50 dark:bg-gray-800/50" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('common.appearance')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.appearanceDescription')}</p>
                </div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.themeMode')}</label>
                  <select value={theme} onChange={handleThemeChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none text-sm bg-gray-50/50 dark:bg-gray-800/50">
                    <option value="light">{t('settings.lightMode')}</option>
                    <option value="dark">{t('settings.darkMode')}</option>
                    <option value="system">{t('settings.systemDefault')}</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <LoadingButton loading={loading} className="px-6 py-2.5 bg-[var(--special-purple)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition cursor-pointer" onClick={handleSubmit}>
                {t('settings.saveChanges')}
              </LoadingButton>
            </div>

          </div>

        </div>
      </div>

    </MainLayout>
  )
}
