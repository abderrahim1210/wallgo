import React from 'react'

interface TooltipProps {
    label: string,
    position: string,
    children: React.ReactNode
};

export const Tooltip: React.FC<TooltipProps> = ({ label, position="top", children }) => {
    return (
        <div className="relative group inline-flex items-center">
            {children}

            <span className={`absolute ${position}-full left-1/2 -translate-x-1/2 mt-3.5 hidden group-hover:block px-2.5 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-md whitespace-nowrap z-50 pointer-events-none`}>
                {label}
            </span>
        </div>
    )
}
