import React from 'react';

interface CreatePlusIconProps {
    className?: string;
    size?: number;
}

export const CreatePlusIcon: React.FC<CreatePlusIconProps> = ({
    className = "w-6 h-6",
    size = 24
}) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`group cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
        >
            <defs>
                <linearGradient id="wallgoCreateGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>

                <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.3" />
                </filter>
            </defs>

            <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="7"
                fill="url(#wallgoCreateGrad)"
                filter="url(#glowShadow)"
                className="transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-lg"
            />

            <path
                d="M12 7V17M7 12H17"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-500 ease-out group-hover:rotate-90 origin-center"
            />
        </svg>
    );
};