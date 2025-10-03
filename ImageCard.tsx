import React from 'react';
import type { GeneratedImage } from './types';
import Loader from './Loader';

interface ImageCardProps {
    image: GeneratedImage;
    isRegenerating: boolean;
    isAnyRegenerating: boolean;
    onRegenerate: (id: number) => void;
    imageContainerClassName?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
    image,
    isRegenerating,
    isAnyRegenerating,
    onRegenerate,
    imageContainerClassName = '',
}) => {
    return (
        <div className="group flex flex-col">
            <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200">
                    {image.title}
                </span>
            </div>

            <div
                className={`relative w-full flex justify-center items-center rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 group-hover:border-indigo-300 transition-all duration-300 ${imageContainerClassName}`}
                aria-busy={isRegenerating}
            >
                {isRegenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm z-10">
                        <Loader />
                        <p className="text-white text-sm font-medium mt-4">再生成中...</p>
                    </div>
                )}
                <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => onRegenerate(image.id)}
                    disabled={isAnyRegenerating}
                    className="group/btn flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md disabled:shadow-none"
                    aria-label={`Regenerate ${image.title}`}
                >
                    <svg className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>再生成</span>
                </button>
            </div>
        </div>
    );
};

export default ImageCard;
