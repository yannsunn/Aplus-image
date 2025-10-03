import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
    <div
        className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 my-6 shadow-sm"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0" aria-hidden="true">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">エラー</h3>
                <p className="text-sm text-red-700">{message}</p>
            </div>
        </div>
    </div>
);

export default ErrorDisplay;
