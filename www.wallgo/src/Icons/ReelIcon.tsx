import type React from "react";

interface ReelIconProps {
    className: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
}
export const ReelIcon: React.FC<ReelIconProps> = ({ size = 96,
    color = "#7371FC",
    strokeWidth = 1.75,
    className = "",
    ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <rect x="5" y="2.5" width="14" height="19" rx="4.25" />
            <path d="M10.4 8.9L15.2 12L10.4 15.1Z" />
            <path d="M22 8.5V10.5M22 13.5V15.5" />
            <path d="M2 8.5V10.5M2 13.5V15.5" opacity="0" />
        </svg>
    )
}