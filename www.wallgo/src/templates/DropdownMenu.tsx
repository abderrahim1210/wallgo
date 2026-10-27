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
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            let left = align === 'right' ? rect.right - 192 : rect.left;
            let top = rect.bottom + 8;

            setCoords({ top, left });
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        const handleScrollOrResize = () => {
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScrollOrResize, true);
            window.addEventListener('resize', handleScrollOrResize);
        }
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex items-center select-none">
                {trigger}
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    style={{
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                    }}
                    className="fixed z-50 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-150"
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
