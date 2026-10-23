import { AlertCircle, Home } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Icon wla Illustration */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full mb-6 shadow-sm">
                    <AlertCircle size={40} />
                </div>

                <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Page not found</h2>
                <p className="text-sm text-gray-500 mb-8">
                    Sma7 lia, l'page li katقلb 3liha makhdmach wla tms7at. Rj3 l saf7a ra2isiya w kml tsswira dyalk f WallGo.
                </p>

                {/* Home Button */}
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
