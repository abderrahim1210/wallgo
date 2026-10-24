import { AlertCircle, Home } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface ErrorPageProps {
    code?: 400 | 401 | 500 | 420 | 403 | 404 | 405 | 406 | 407 | 408 | 502 | 511;
    title?:string;
    message?: string;
}

export const ErrorPage : React.FC<ErrorPageProps> = ({code,title,message}) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-[var(--special-red)] rounded-full mb-6 shadow-sm">
                    <AlertCircle size={70} />
                </div>

                <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">{code}</h1>
                <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
                <p className="text-sm text-gray-500 mb-8">
                    {message}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition duration-200"
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    )
}
