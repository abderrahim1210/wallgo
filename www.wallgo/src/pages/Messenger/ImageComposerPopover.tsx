import { t } from 'i18next';
import { Plus, RotateCw, Send, X } from 'lucide-react';
import React, { useRef, useState } from 'react'

export interface SelectedMediaItem {
    id: string;
    file: File;
    previewUrl: string;
    rotation: number;
}

interface ImageComposerPopoverProps {
    items: SelectedMediaItem[];
    onAddMore: (files: FileList) => void;
    onRemoveItem: (id: string) => void;
    onRotationItem: (id: string) => void;
    onClose: () => void;
    onSend: (caption: string, finalFiles: File[], itemIds: string[]) => Promise<number>;
    onError: () => void;
    isSending?: boolean;
}

async function applyRotationIfNeeded(item: SelectedMediaItem): Promise<File> {
    if (item.rotation % 360 === 0) return item.file;
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not create an image canvas');

                const isSideways = item.rotation === 90 || item.rotation === 270;
                canvas.width = isSideways ? img.height : img.width;
                canvas.height = isSideways ? img.width : img.height;

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((item.rotation * Math.PI) / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not encode the rotated image'));
                            return;
                        }
                        resolve(new File([blob], item.file.name, {
                            type: blob.type || item.file.type || 'image/png',
                            lastModified: item.file.lastModified,
                        }));
                    },
                    item.file.type || 'image/jpeg',
                    0.92
                );
            } catch (error) {
                reject(error);
            }
        }
        img.onerror = () => reject(new Error('Could not load the image preview'));
        img.src = item.previewUrl;
    });
}

const ImageComposerPopover: React.FC<ImageComposerPopoverProps> = ({
    items,
    onAddMore,
    onClose,
    onRemoveItem,
    onRotationItem,
    onSend,
    onError,
    isSending = false
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [caption, setCaption] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const addMoreInputRef = useRef<HTMLInputElement | null>(null);

    if (items.length === 0) return null;

    const activeIndex = Math.min(selectedIndex, items.length - 1);
    const activeItem = items[activeIndex] ?? items[0];

    const busy = isSending || isProcessing;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy || items.length === 0) return;

        setIsProcessing(true);
        try {
            const processedFiles = await Promise.all(items.map(applyRotationIfNeeded));
            const sentCount = await onSend(caption.trim(), processedFiles, items.map((item) => item.id));
            if (sentCount > 0) setCaption("");
        } catch (error) {
            console.error(error);
            onError();
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-40 w-[92%] max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    {t('messenger.choosed', { count: items.length })}
                </span>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onRotationItem(activeItem.id)}
                        disabled={busy}
                        title={t('messenger.rotateImage')}
                        className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        title={t('messenger.cancel')}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="relative h-56 bg-zinc-100/70 dark:bg-zinc-950/70 flex items-center justify-center overflow-hidden p-2">
                <img
                    src={activeItem.previewUrl}
                    alt={t('messenger.previewImage')}
                    style={{ transform: `rotate(${activeItem.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200"
                />
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto border-t border-zinc-100 dark:border-zinc-800">
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition ${busy ? 'cursor-wait' : 'cursor-pointer'} ${idx === activeIndex
                                ? "border-blue-500 scale-105"
                                : "border-transparent opacity-75 hover:opacity-100"
                            }`}
                        aria-current={idx === activeIndex ? 'true' : undefined}
                    >
                        <img
                            src={item.previewUrl}
                            alt=""
                            style={{ transform: `rotate(${item.rotation}deg)` }}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            disabled={busy}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveItem(item.id);
                            }}
                            aria-label={t('messenger.removeImage')}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                        >
                            <X className="w-2.5 h-2.5" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => addMoreInputRef.current?.click()}
                    disabled={busy}
                    className="shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition disabled:opacity-50"
                    title={t('messenger.addImage')}
                >
                    <Plus className="w-5 h-5" />
                </button>

                <input
                    ref={addMoreInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={busy}
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.length) {
                            onAddMore(e.target.files);
                            e.target.value = "";
                        }
                    }}
                />
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50/80 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
            >
                <input
                    type="text"
                    value={caption}
                    disabled={busy}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={t('messenger.addCaption')}
                    className="flex-1 text-sm bg-transparent outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
                />
                <button
                    type="submit"
                    disabled={busy}
                    className="p-2 rounded-xl bg-[var(--special-purple)] disabled:opacity-50 text-white transition"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}

export default ImageComposerPopover