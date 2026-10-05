import React, { useEffect, useRef, useState } from 'react'

export interface DropdownItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
}

interface DropdownMenuProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right'
}
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    trigger,
    items,
    align = 'right'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);
    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex items-center select-none">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={`absolute z-50 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-150 ${align === 'right' ? 'right-0' : 'left-0'
                        }`}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false);
                            }}
                            className={`w-full cursor-pointer flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${item.danger
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
