import React from 'react'

interface TooltipProps {
    label: string,
    position?: 'top' | 'bottom' | 'left' | 'right',
    children: React.ReactNode
};

export const Tooltip: React.FC<TooltipProps> = ({ label, position = "top", children }) => {
    const getPositionClasses = () => {
        switch (position) {
            case 'bottom':
                return 'top-full left-1/2 -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 -translate-y-1/2 ml-2';
            case 'top':
            default:
                return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
        }
    };
    return (
        <div className="relative group inline-flex items-center">
            {children}

            <span className={`absolute ${getPositionClasses()} hidden group-hover:block px-2.5 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-md whitespace-nowrap z-50 pointer-events-none`}>
                {label}
            </span>
        </div>
    )
}
