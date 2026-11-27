import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { t } from "i18next";

interface VoiceMessageProps {
    src: string;
    duration?: number | string;
    isMine?: boolean;
}

const formatTime = (sec: number) => {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export function VoiceMessage({ src, duration, isMine = true }: VoiceMessageProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState<number>(
        typeof duration === "number" ? duration : Number(duration) || 0
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onLoaded = () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                setTotalDuration(audio.duration);
            }
        };
        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
        };
    }, [src]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !totalDuration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        audio.currentTime = ratio * totalDuration;
        setCurrentTime(audio.currentTime);
    };

    const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

    return (
        <div className="flex w-56 max-w-full items-center gap-2.5 px-3 py-2 select-none" dir="ltr">
            <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

            <button
                type="button"
                onClick={togglePlay}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${isMine
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                    }`}
                aria-label={isPlaying ? t('messenger.pause') : t('messenger.play')}
            >
                {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                ) : (
                    <Play className="h-4 w-4 translate-x-0.5 fill-current" />
                )}
            </button>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div
                    onClick={handleSeek}
                    className={`group relative h-1.5 w-full cursor-pointer rounded-full ${isMine ? "bg-white/25" : "bg-slate-700"
                        }`}
                >
                    <div
                        style={{ width: `${progress}%` }}
                        className={`h-full rounded-full transition-[width] duration-75 ${isMine ? "bg-white" : "bg-indigo-400"
                            }`}
                    />
                    <span
                        style={{ left: `${progress}%` }}
                        className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow transition-transform group-hover:scale-110 ${isMine ? "bg-white" : "bg-indigo-400"
                            }`}
                    />
                </div>

                <div className="flex items-center justify-between text-[10px] font-medium tabular-nums opacity-80">
                    <span>{formatTime(isPlaying || currentTime > 0 ? currentTime : totalDuration)}</span>
                    <span className="uppercase tracking-wider opacity-70">{t('messenger.voice')}</span>
                </div>
            </div>
        </div>
    );
}