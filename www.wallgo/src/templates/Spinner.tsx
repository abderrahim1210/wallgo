import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import WallGoSpinner from '../Icons/WallGoSpinner'

interface SpinnetProps {
    text: string,
    type: 'mini' | 'large'
}

const Spinner: React.FC<SpinnetProps> = ({ text = 'Wait a few seconds ...', type }) => {
    return type === 'mini' ? (
        <div className='flex flex-col items-center justify-center py-6 w-full text-center'>
            <div className='text-3xl'>
                <WallGoSpinner />
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white font-semibold">WallGo.</strong><br />
                <span>{text}</span>
            </p>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center min-h-[50vh] w-full gap-4'>
            <div className='text-6xl'>
                <WallGoSpinner />
            </div>

            <p className='text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide animate-pulse'>
                {text}
            </p>
        </div>
    )
}

export default Spinner