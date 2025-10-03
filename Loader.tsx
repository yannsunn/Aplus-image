import React from 'react';

interface LoaderProps {
    size?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'w-10 h-10' }) => (
    <div className="relative inline-flex items-center justify-center">
        <div className={`border-4 border-indigo-200 border-t-indigo-600 rounded-full ${size} animate-spin`}></div>
        <div className="absolute">
            <div className={`border-4 border-transparent border-b-purple-600 rounded-full ${size} animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
    </div>
);

export default Loader;
