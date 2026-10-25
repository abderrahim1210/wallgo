import { AlertCircle, Home } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

const errorMessages: Record<number, { title: string; message: string }> = {
    400: {
        title: "Bad Request",
        message: "The request could not be understood by the server due to malformed syntax."
    },
    401: {
        title: "Unauthorized",
        message: "You need to log in to access this page or resource."
    },
    403: {
        title: "Access Forbidden",
        message: "You don't have permission to access this resource."
    },
    404: {
        title: "Page Not Found",
        message: "The page you are looking for might have been removed or is temporarily unavailable."
    },
    405: {
        title: "Method Not Allowed",
        message: "The method specified in the request is not allowed for this resource."
    },
    422: {
        title: "Unprocessable Content",
        message: "The request was well-formed but was unable to be followed due to semantic errors."
    },
    500: {
        title: "Internal Server Error",
        message: "Oops, something went wrong on our servers. We're working to fix it!"
    },
    502: {
        title: "Bad Gateway",
        message: "The server received an invalid response from the upstream server."
    },
    503: {
        title: "Service Unavailable",
        message: "The server is currently unable to handle the request. Please try again later."
    }
};

interface ErrorPageProps {
    codeP?: string;
}

export const ErrorPage : React.FC<ErrorPageProps> = ({codeP}) => {
    const { code } = useParams<{ code?: string }>();

    const errorCode = code ? parseInt(code, 10) : codeP ? parseInt(codeP,10) :  404;

    const errorInfo = errorMessages[errorCode] || {
        title: 'Unexpected Error',
        message: 'An unexpected error occurred. Please try again later.'
    };

    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center px-4 transition-colors">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-[var(--special-red,#ef4444)] rounded-full mb-6 shadow-sm">
                    <AlertCircle size={45} />
                </div>

                <h1 className="text-6xl font-extrabold tracking-tight mb-2">
                    {errorCode}
                </h1>

                <h2 className="text-xl font-bold mb-3">
                    {errorInfo.title}
                </h2>

                <p className="text-sm mb-8 leading-relaxed">
                    {errorInfo.message}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 bg-[var(--special-purple)] hover:opacity-90 text-white font-semibold rounded-xl shadow-md transition duration-200"
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    )
}
