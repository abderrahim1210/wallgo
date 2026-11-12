import { AlertCircle, Home } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const errorMessages: Record<number, { title: string; message: string }> = {
    400: {
        title: "errors.badRequestTitle",
        message: "errors.badRequestMessage"
    },
    401: {
        title: "errors.unauthorizedTitle",
        message: "errors.unauthorizedMessage"
    },
    403: {
        title: "errors.forbiddenTitle",
        message: "errors.forbiddenMessage"
    },
    404: {
        title: "errors.notFoundTitle",
        message: "errors.notFoundMessage"
    },
    405: {
        title: "errors.methodNotAllowedTitle",
        message: "errors.methodNotAllowedMessage"
    },
    422: {
        title: "errors.unprocessableTitle",
        message: "errors.unprocessableMessage"
    },
    500: {
        title: "errors.serverErrorTitle",
        message: "errors.serverErrorMessage"
    },
    502: {
        title: "errors.badGatewayTitle",
        message: "errors.badGatewayMessage"
    },
    503: {
        title: "errors.unavailableTitle",
        message: "errors.unavailableMessage"
    }
};

interface ErrorPageProps {
    codeP?: string;
}

export const ErrorPage : React.FC<ErrorPageProps> = ({codeP}) => {
    const { t } = useTranslation();
    const { code } = useParams<{ code?: string }>();

    const errorCode = code ? parseInt(code, 10) : codeP ? parseInt(codeP,10) :  404;

    const errorInfo = errorMessages[errorCode] || {
        title: 'errors.unexpectedTitle',
        message: 'errors.unexpectedMessage'
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center px-4 transition-colors">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 dark:bg-red-950/40 text-[var(--special-red,#ef4444)] rounded-full mb-6 shadow-sm">
                    <AlertCircle size={45} />
                </div>

                <h1 className="text-6xl font-extrabold tracking-tight mb-2">
                    {errorCode}
                </h1>

                <h2 className="text-xl font-bold mb-3">
                    {t(errorInfo.title)}
                </h2>

                <p className="text-sm mb-8 leading-relaxed">
                    {t(errorInfo.message)}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 bg-[var(--special-purple)] hover:opacity-90 text-white font-semibold rounded-xl shadow-md transition duration-200"
                >
                    <Home size={18} />
                    <span>{t('errors.backToHome')}</span>
                </Link>
            </div>
        </div>
    )
}
