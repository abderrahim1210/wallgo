import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import WallGoSpinner from '../Icons/WallGoSpinner'
import { useTranslation } from 'react-i18next'

interface SpinnetProps {
    text?: string,
    type: 'mini' | 'large'
}

const Spinner: React.FC<SpinnetProps> = ({ text, type }) => {
    const { t } = useTranslation();
    const displayText = text ?? t('common.wait');
    return type === 'mini' ? (
        <div className='flex flex-col items-center justify-center py-6 w-full text-center'>
            <div className='text-3xl'>
                <WallGoSpinner />
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                <strong className="text-gray-500 font-semibold">WallGo.</strong><br />
                <span>{displayText}</span>
            </p>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center min-h-[50vh] w-full gap-4'>
            <div className='text-6xl'>
                <WallGoSpinner />
            </div>

            <p className='text-sm font-medium text-gray-500 tracking-wide animate-pulse'>
                {displayText}
            </p>
        </div>
    )
}

export default Spinner