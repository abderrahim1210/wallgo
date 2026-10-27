import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

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

const MENU_W = 192;
const GAP = 8;
const PADDING = 8;

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    trigger,
    items,
    align = 'right'
}) => {
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const menuH = menuRef.current?.offsetHeight ?? 0;

        let left = align === 'right' ? rect.right - MENU_W : rect.left;
        left = Math.max(PADDING, Math.min(left, window.innerWidth - MENU_W - PADDING));

        let top = rect.bottom + GAP;
        if (top + menuH > window.innerHeight - PADDING) {
            top = rect.top - menuH - GAP;
        }
        top = Math.max(PADDING, top);

        setCoords({ top, left });
    };

    useLayoutEffect(() => {
        if (isOpen) updatePosition();
    }, [isOpen]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        if (!isOpen) return;

        const close = () => setIsOpen(false);

        const handleOutside = (e: MouseEvent | TouchEvent) => {
            const target = e.target as Node;
            if (containerRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            close();
        };

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        document.addEventListener('mousedown', handleOutside, true);
        document.addEventListener('touchstart', handleOutside, true);
        document.addEventListener('keydown', handleKey);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);

        return () => {
            document.removeEventListener('mousedown', handleOutside, true);
            document.removeEventListener('touchstart', handleOutside, true);
            document.removeEventListener('keydown', handleKey);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <div onClick={handleToggle} className="cursor-pointer inline-flex items-center select-none">
                {trigger}
            </div>

            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
                    className="fixed z-[9999] w-48 bg-white border border-gray-100 rounded-xl shadow-2xl py-1.5"
                >
                    {items.map((item, index) => (
                        <button key={index} onClick={() => { item.onClick(); setIsOpen(false); }}
                            className={`w-full cursor-pointer flex items-center space-x-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    )
}
