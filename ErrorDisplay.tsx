import React from 'react';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
        <strong className="font-bold">エラー: </strong>
        <span className="block sm:inline">{message}</span>
    </div>
);

export default ErrorDisplay;
