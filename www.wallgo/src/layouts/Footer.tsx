import { Compass, Flame, Home, MessageCircle, MessageSquare, Sparkles, User } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '../templates/Tooltip';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    const date = new Date();
    const year = date.getFullYear();
    const linksClass = "hover:text-[var(--special-purple)] transition-colors";
    
    return (
        <>
            <footer className='hidden lg:block py-6'>
                <div className='max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <p>&copy;{year} {t('common.allRightsReserved', { brandName: t('common.brandName') })}</p>
                    <div className="flex space-x-6 mt-2 sm:mt-0">
                        <Link to="#" className={linksClass}>{t('common.about')}</Link>
                        <Link to="#" className={linksClass}>{t('common.privacy')}</Link>
                        <Link to="#" className={linksClass}>{t('common.terms')}</Link>
                        <Link to="#" className={linksClass}>{t('common.support')}</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}
