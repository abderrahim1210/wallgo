import React, { useCallback, useEffect, useRef, useState } from 'react'

export type VoiceRecordingResult = {
    blob: Blob;
    url: string;
    duration: number;
    mimeType: string;
}

export const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioPreview, setAudioPreview] = useState<VoiceRecordingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunkRef = useRef<BlobPart[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const discardRef = useRef<boolean>(false);
    const durationRef = useRef<number>(0);

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const cleanupStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    const resetPreview = useCallback(() => {
        setAudioPreview((prev) => {
            if (prev?.url) {
                URL.revokeObjectURL(prev.url);
            }
            return null;
        });
        setDuration(0);
        durationRef.current = 0;
    }, []);

    const startRecording = useCallback(async () => {
        setError(null);
        resetPreview();

        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
            setError('The browser not supported the audio');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunkRef.current = [];
            discardRef.current = false;

            const preferredTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus',
                'audio/mp4'
            ];

            const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';

            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event: BlobEvent) => {
                if (event.data && event.data.size > 0) {
                    chunkRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                clearTimer();
                cleanupStream();
                setIsRecording(false);

                if (discardRef.current) {
                    chunkRef.current = [];
                    setDuration(0);
                    durationRef.current = 0;
                    return;
                }

                const finalMime = recorder.mimeType || mimeType || 'audio/webm';
                const blob = new Blob(chunkRef.current, { type: finalMime });
                chunkRef.current = [];

                if (blob.size === 0) return;

                const url = URL.createObjectURL(blob);
                setAudioPreview({
                    blob,
                    url,
                    duration: Math.max(1, durationRef.current),
                    mimeType: finalMime
                });
            };
            recorder.start();
            setIsRecording(true);
            setDuration(0);
            durationRef.current = 0;

            timerRef.current = setInterval(() => {
                durationRef.current += 1;
                setDuration(durationRef.current);
            }, 1000);
        } catch {
            cleanupStream();
            clearTimer();
            setIsRecording(false);
            setError('Authorization refused or microphone not found');
        }
    },[resetPreview]);

    const stopRecording = useCallback(() => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== 'inactive'){
            discardRef.current = false;
            recorder.stop();
        }
    },[]);

    const cancelRecording = useCallback(() => {
        discardRef.current = true;
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== 'inactive'){
            recorder.stop();
        }else{
            clearTimer();
            cleanupStream();
            setIsRecording(false);
            resetPreview();
        }
    },[resetPreview]);

    useEffect(() => {
        return () => {
            discardRef.current = true;
            clearTimer();
            cleanupStream();
            if (audioPreview?.url){
                URL.revokeObjectURL(audioPreview.url);
            }
        };
    },[audioPreview]);
    return {
        isRecording,
        duration,
        audioPreview,
        error,
        startRecording,
        stopRecording,
        cancelRecording,
        clearPreview:resetPreview
    }
}
