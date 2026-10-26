import React from 'react'
import ButtonSpinner from './ButtonSpinner'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading = false,
    disabled,
    className = '',
    children,
    ...props
}) => {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            aria-busy={loading}
            className={`relative inline-flex items-center justify-center gap-2 rounded-xl
                bg-[var(--special-purple)] px-5 py-2.5 text-sm font-semibold text-white
                shadow-lg shadow-[var(--special-purple)]/30 transition-all duration-300
                hover:brightness-110 active:scale-95
                focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--special-purple)]/40
                disabled:cursor-not-allowed disabled:opacity-80 ${className}`}
        >
            <span className={`inline-flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
                {children}
            </span>

            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <ButtonSpinner />
                </span>
            )}
        </button>
    )
}

export default LoadingButton