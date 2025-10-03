import React, { useState, useCallback, ChangeEvent } from 'react';
import { generateAllImages, regenerateImage } from './services/apiClient';
import { addWatermark, downloadImage } from './utils/fileUtils';
import type { GeneratedImage } from './types';

import InputForm from './InputForm';
import ImageGrid from './ImageGrid';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';

const App: React.FC = () => {
    const [promptText, setPromptText] = useState<string>('');
    const [baseImageFile, setBaseImageFile] = useState<File | null>(null);
    const [baseImagePreview, setBaseImagePreview] = useState<string>('');
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRegenerating, setIsRegenerating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBaseImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setBaseImagePreview(previewUrl);
        } else {
            setBaseImageFile(null);
            setBaseImagePreview('');
        }
    };

    const runGeneration = useCallback(async () => {
        if (!promptText || !baseImageFile) {
            setError('テキストと画像の両方を入力してください。');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            // The apiClient now handles all backend communication.
            const newImages = await generateAllImages(promptText, baseImageFile);
            
            // Add watermarks on the client-side after receiving the images.
            const watermarkedImages = await Promise.all(
                newImages.map(async (image) => ({
                    ...image,
                    src: await addWatermark(image.src), // Assuming API returns base64 string in src
                }))
            );

            setGeneratedImages(watermarkedImages);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`画像の生成中にエラーが発生しました: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [promptText, baseImageFile]);

    const handleRegenerate = useCallback(async (index: number) => {
        const imageToRegen = generatedImages.find(img => img.id === index);
        if (!baseImageFile || !imageToRegen) {
            setError('再生成の元となる画像またはプロンプトがありません。');
            return;
        }

        setIsRegenerating(index);
        setError(null);

        try {
            const prompt = imageToRegen.prompt;
            const newImageBase64 = await regenerateImage(prompt, baseImageFile);
            const watermarkedSrc = await addWatermark(newImageBase64);
            
            setGeneratedImages(prev => prev.map(img => img.id === index ? { ...img, src: watermarkedSrc } : img));
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`モジュール${index + 1}の再生成中にエラーが発生しました: ${errorMessage}`);
        } finally {
            setIsRegenerating(null);
        }
    }, [baseImageFile, generatedImages]);
    
    const handleDownloadAll = () => {
        generatedImages.forEach((image, index) => {
            if (image.src && !image.src.startsWith('https://placehold.co')) {
                setTimeout(() => {
                    downloadImage(image.src, `A+content_image_${index + 1}.png`);
                }, index * 200);
            }
        });
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">A+コンテンツ画像生成ツール</h1>
                    <p className="text-gray-600">テキストと画像を組み合わせて、A+コンテンツ用の画像を生成します。</p>
                </header>

                <InputForm
                    promptText={promptText}
                    onPromptTextChange={setPromptText}
                    onImageFileChange={handleImageInputChange}
                    baseImagePreview={baseImagePreview}
                    onSubmit={runGeneration}
                    isLoading={isLoading}
                    isSubmitDisabled={isLoading || !promptText || !baseImageFile}
                />

                {isLoading && (
                    <div className="flex flex-col justify-center items-center my-8">
                        <Loader />
                        <p className="text-gray-600 mt-4">画像を生成中です...</p>
                    </div>
                )}
                
                {error && <ErrorDisplay message={error} />}

                {generatedImages.length > 0 && !isLoading && (
                    <ImageGrid
                        images={generatedImages}
                        isRegeneratingId={isRegenerating}
                        onRegenerate={handleRegenerate}
                        onDownloadAll={handleDownloadAll}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
