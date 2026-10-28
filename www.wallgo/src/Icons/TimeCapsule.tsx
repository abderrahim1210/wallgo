import React, { useEffect, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import { Lock, Sparkles, Timer } from 'lucide-react'

interface TimeCapsuleLockedProps {
    unlockTime: string | Date
    createdAt?: string | Date
    onUnlock?: () => void
}

const ROWS = [4, 5, 4, 5];
const TOTAL = ROWS.reduce((a, b) => a + b, 0)
const ROW_START = ROWS.map((_, i) => ROWS.slice(0, i).reduce((a, b) => a + b, 0))

const pad = (n: number) => String(n).padStart(2, '0')

const TimeCapsuleLocked: React.FC<TimeCapsuleLockedProps> = ({ unlockTime, createdAt, onUnlock }) => {
    const unlockMs = useMemo(() => moment(unlockTime).valueOf(), [unlockTime])
    const createdMs = useMemo(() => (createdAt ? moment(createdAt).valueOf() : null), [createdAt])

    const [now, setNow] = useState(() => Date.now())
    const remaining = Math.max(0, unlockMs - now)

    const onUnlockRef = useRef(onUnlock)
    onUnlockRef.current = onUnlock
    const fired = useRef(false)

    useEffect(() => {
        const fire = () => {
            if (fired.current) return
            fired.current = true
            onUnlockRef.current?.()
        }
        if (unlockMs <= Date.now()) { fire(); return }
        fired.current = false
        const id = setInterval(() => {
            const t = Date.now()
            setNow(t)
            if (t >= unlockMs) { clearInterval(id); fire() }
        }, 1000)
        return () => clearInterval(id)
    }, [unlockMs])

    const d = moment.duration(remaining)
    const parts = [
        { value: String(Math.floor(d.asDays())), label: 'Days' },
        { value: pad(d.hours()), label: 'Hrs' },
        { value: pad(d.minutes()), label: 'Min' },
        { value: pad(d.seconds()), label: 'Sec' },
    ]

    const progress = createdMs && unlockMs > createdMs
        ? Math.min(1, Math.max(0, (now - createdMs) / (unlockMs - createdMs)))
        : 0
    const removed = Math.min(TOTAL - 1, Math.floor(progress * TOTAL))

    return (
        <div
            role="group"
            aria-label={`Locked post, opens on ${moment(unlockMs).format('MMMM Do YYYY, h:mm a')}`}
            className="relative mx-4 my-2 overflow-hidden rounded-2xl border border-white/10 bg-[var(--special-dark)] text-center text-white shadow-inner"
        >
            <div aria-hidden className="absolute inset-0 flex flex-col justify-between gap-2 p-3">
                {ROWS.map((count, r) => (
                    <div key={r} className="flex gap-2">
                        {Array.from({ length: count }).map((_, c) => {
                            const i = ROW_START[r] + c
                            const style =
                                i < removed
                                    ? 'border border-dashed border-white/10'                                  // already fell
                                    : i === removed
                                        ? 'bg-[var(--special-red)]/70 animate-pulse'                          // next to fall
                                        : 'border border-[var(--special-purple)]/25 bg-[var(--special-purple)]/20' // still standing
                            return <span key={c} className={`h-5 flex-1 rounded-full ${style}`} />
                        })}
                    </div>
                ))}
            </div>

            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--special-dark)_35%,transparent_80%)]" />

            <div className="relative z-10 flex flex-col items-center gap-4 px-4 py-10">
                <div className="relative">
                    <span className="absolute inset-0 animate-ping rounded-2xl bg-[var(--special-purple)]/40" />
                    <div className="relative rounded-2xl bg-[var(--special-purple)] p-3 shadow-lg shadow-[var(--special-purple)]/40">
                        <Lock className="h-7 w-7 text-white" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h5 className="flex items-center justify-center gap-1.5 text-base font-bold tracking-tight">
                        Sealed behind the wall <Sparkles className="h-4 w-4 text-[var(--special-purple)]" />
                    </h5>
                    <p className="text-xs text-white/60">This time capsule opens on</p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md">
                    <Timer className="h-4 w-4 text-[var(--special-purple)]" />
                    <span>{moment(unlockMs).format('MMMM Do YYYY, h:mm a')}</span>
                </div>

                <div className="flex items-stretch gap-2">
                    {parts.map(p => (
                        <div key={p.label} className="min-w-[3.5rem] rounded-xl border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-md">
                            <div className="text-lg font-bold tabular-nums leading-none">{p.value}</div>
                            <div className="mt-1 text-[10px] uppercase tracking-wider text-white/50">{p.label}</div>
                        </div>
                    ))}
                </div>

                {createdMs && (
                    <p className="text-[11px] italic text-white/40">
                        The wall is {Math.round(progress * 100)}% down
                    </p>
                )}
            </div>
        </div>
    )
}

export default TimeCapsuleLocked