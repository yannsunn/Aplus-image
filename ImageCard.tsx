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
        <div className="flex flex-col items-center">
            <p className="text-center font-bold text-lg mb-2">{image.title}</p>
            <div className={`w-full flex justify-center items-center rounded-lg overflow-hidden shadow-lg bg-gray-200 relative ${imageContainerClassName}`}>
                {isRegenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <Loader />
                    </div>
                )}
                <img src={image.src} alt={image.title} className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="mt-2">
                <button
                    onClick={() => onRegenerate(image.id)}
                    disabled={isAnyRegenerating}
                    className="bg-white bg-opacity-70 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold hover:bg-opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    再度生成
                </button>
            </div>
        </div>
    );
};

export default ImageCard;
