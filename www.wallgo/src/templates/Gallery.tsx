import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export type GalleryMedia = {
    src: string;
    alt: string;
    type?: 'image' | 'video';
};

type GalleryProps = {
    items: GalleryMedia[];
    children: (openMedia: (index: number) => void) => ReactNode;
};

const Gallery = ({ items, children }: GalleryProps) => {
    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
    const { t } = useTranslation();
    const isOpen = selectedMediaIndex !== null;
    const selectedMedia = selectedMediaIndex === null ? null : items[selectedMediaIndex];

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedMediaIndex(null);
            if (event.key === 'ArrowLeft') {
                setSelectedMediaIndex((index) => index === null ? null : Math.max(0, index - 1));
            }
            if (event.key === 'ArrowRight') {
                setSelectedMediaIndex((index) => index === null ? null : Math.min(items.length - 1, index + 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [items.length, isOpen]);

    const openMedia = (index: number) => {
        if (items[index]) setSelectedMediaIndex(index);
    };

    return (
        <>
            {children(openMedia)}
            {selectedMedia && selectedMediaIndex !== null && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
                    onClick={() => setSelectedMediaIndex(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedMedia.alt || t('common.image')}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedMediaIndex(null)}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                        aria-label={t('common.close')}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {items.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedMediaIndex((index) => index === null ? null : Math.max(0, index - 1));
                                }}
                                disabled={selectedMediaIndex === 0}
                                className="absolute left-3 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:left-6"
                                aria-label={t('common.previousMedia')}
                            >
                                <ChevronLeft className="h-7 w-7" />
                            </button>
                            <span className="absolute bottom-5 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                                {selectedMediaIndex + 1} / {items.length}
                            </span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedMediaIndex((index) => index === null ? null : Math.min(items.length - 1, index + 1));
                                }}
                                disabled={selectedMediaIndex === items.length - 1}
                                className="absolute right-3 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:right-6"
                                aria-label={t('common.nextMedia')}
                            >
                                <ChevronRight className="h-7 w-7" />
                            </button>
                        </>
                    )}
                    {selectedMedia.type === 'video' ? (
                        <video
                            src={selectedMedia.src}
                            aria-label={selectedMedia.alt}
                            controls
                            playsInline
                            onClick={(event) => event.stopPropagation()}
                            onContextMenu={(event) => event.preventDefault()}
                            className="max-h-[85vh] max-w-[calc(100vw-2rem)]"
                        />
                    ) : (
                        <img
                            src={selectedMedia.src}
                            alt={selectedMedia.alt}
                            onContextMenu={(event) => event.preventDefault()}
                            onClick={(event) => event.stopPropagation()}
                            className="max-h-[85vh] max-w-[calc(100vw-2rem)] object-contain"
                        />
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

export default Gallery;