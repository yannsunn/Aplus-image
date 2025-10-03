import React from 'react';

interface LoaderProps {
    size?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'w-10 h-10' }) => (
    <div className={`border-4 border-gray-200 border-t-blue-500 rounded-full ${size} animate-spin`}></div>
);

export default Loader;
