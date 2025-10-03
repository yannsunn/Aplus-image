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
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-center border-b pb-4 mb-6">生成された画像</h2>
            <div className="flex justify-end mb-4">
                <button onClick={onDownloadAll} className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none transition">
                    すべてダウンロード
                </button>
            </div>

            {headerImage && (
                <div className="mb-8">
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
