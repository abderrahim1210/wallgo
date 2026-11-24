import Gallery from '../../templates/Gallery';
import { t } from 'i18next';

export type MessageAttachment = {
    id: number;
    media_url: string;
    created_at: string;
    message_id: number;
    position: number;
    public_id: string;
    updated_at: string;
};

type MessageImageGalleryProps = {
    attachments: MessageAttachment[];
    attachmentAlt: string;
};

export const MessageImageGallery = ({ attachments, attachmentAlt }: MessageImageGalleryProps) => {
    const images = attachments.map((attachment) => ({
        src: attachment.media_url,
        alt: attachmentAlt,
    }));

    return (
        <Gallery items={images}>
            {(openMedia) => (
                <div className={`grid gap-1 overflow-hidden rounded-xl ${attachments.length > 1 ? 'grid-cols-2' : ''}`}>
                    {attachments.slice(0, attachments.length > 2 ? 3 : attachments.length).map((attachment, index) => {
                        const hasMoreOverlay = attachments.length > 2 && index === 2;
                        return (
                            <button
                                key={attachment.id}
                                type="button"
                                onClick={() => openMedia(hasMoreOverlay ? 0 : index)}
                                className="group relative min-w-0 cursor-pointer overflow-hidden bg-black/10 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--special-purple)]"
                                aria-label={hasMoreOverlay ? `${attachmentAlt}, ${attachments.length - 2} ${t('messenger.images')}` : attachmentAlt}
                            >
                                <img
                                    src={attachment.media_url}
                                    alt=""
                                    className={`${attachments.length === 1 ? 'max-h-60' : 'aspect-square'} w-full max-w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]`}
                                />
                                {hasMoreOverlay && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-2xl font-semibold text-white">
                                        +{attachments.length - 2}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </Gallery>
    );
};
