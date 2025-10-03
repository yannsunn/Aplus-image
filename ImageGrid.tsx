import React from 'react';
import type { GeneratedImage } from './types';
import ImageCard from './ImageCard';

interface ImageGridProps {
    images: GeneratedImage[];
    isRegeneratingId: number | null;
    onRegenerate: (id: number) => void;
    onDownloadAll: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isRegeneratingId, onRegenerate, onDownloadAll }) => {
    const headerImage = images.find(img => img.id === 0);
    const featureImages = images.slice(1);

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        生成された画像
                    </h2>
                </div>
                <button
                    onClick={onDownloadAll}
                    className="group flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold px-6 py-3 rounded-xl hover:from-gray-800 hover:to-black focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    aria-label="Download all generated images"
                >
                    <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>すべてダウンロード</span>
                </button>
            </div>

            {headerImage && (
                <div className="mb-10">
                    <ImageCard
                        image={headerImage}
                        isRegenerating={isRegeneratingId === headerImage.id}
                        isAnyRegenerating={isRegeneratingId !== null}
                        onRegenerate={onRegenerate}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {featureImages.map((image) => (
                    <ImageCard
                        key={image.id}
                        image={image}
                        isRegenerating={isRegeneratingId === image.id}
                        isAnyRegenerating={isRegeneratingId !== null}
                        onRegenerate={onRegenerate}
                        imageContainerClassName="aspect-square"
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGrid;
