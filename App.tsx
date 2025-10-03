import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { generateAllImages, regenerateImage } from './services/apiClient';
import { addWatermark, downloadImage } from './utils/fileUtils';
import { extractProductInfo } from './utils/textProcessor';
import type { GeneratedImage } from './types';
import { FILE_UPLOAD, ERROR_MESSAGES } from './constants';

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

    // テキスト入力時にAmazonページなどから商品情報を抽出
    const handlePromptTextChange = useCallback((text: string) => {
        // 大量のテキスト（500文字以上）の場合、商品情報を抽出
        if (text.length > 500) {
            const extractedInfo = extractProductInfo(text);
            setPromptText(extractedInfo);
        } else {
            setPromptText(text);
        }
    }, []);

    // Cleanup object URL to prevent memory leak
    useEffect(() => {
        return () => {
            if (baseImagePreview) {
                URL.revokeObjectURL(baseImagePreview);
            }
        };
    }, [baseImagePreview]);

    const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        // Reset state if no file selected
        if (!file) {
            if (baseImagePreview) {
                URL.revokeObjectURL(baseImagePreview);
            }
            setBaseImageFile(null);
            setBaseImagePreview('');
            setError(null);
            return;
        }

        // Validate file size
        if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
            setError(ERROR_MESSAGES.FILE_TOO_LARGE);
            e.target.value = ''; // Reset input
            return;
        }

        // Validate file type - check if file type starts with 'image/'
        if (!file.type.startsWith('image/')) {
            setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
            e.target.value = ''; // Reset input
            return;
        }

        // Revoke previous URL before creating a new one
        if (baseImagePreview) {
            URL.revokeObjectURL(baseImagePreview);
        }

        setError(null);
        setBaseImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setBaseImagePreview(previewUrl);
    };

    const runGeneration = useCallback(async () => {
        if (!promptText || !baseImageFile) {
            setError(ERROR_MESSAGES.MISSING_INPUT);
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
            setError(`${ERROR_MESSAGES.GENERATION_FAILED}: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [promptText, baseImageFile]);

    const handleRegenerate = useCallback(async (index: number) => {
        if (!baseImageFile) {
            setError(ERROR_MESSAGES.MISSING_REGENERATION_DATA);
            return;
        }

        setIsRegenerating(index);
        setError(null);

        try {
            // Get the image from state safely
            setGeneratedImages(prev => {
                const imageToRegen = prev.find(img => img.id === index);
                if (!imageToRegen) {
                    setError(ERROR_MESSAGES.MISSING_REGENERATION_DATA);
                    setIsRegenerating(null);
                    return prev;
                }

                // Start regeneration asynchronously
                (async () => {
                    try {
                        const newImageBase64 = await regenerateImage(imageToRegen.prompt, baseImageFile);
                        const watermarkedSrc = await addWatermark(newImageBase64);
                        setGeneratedImages(current =>
                            current.map(img => img.id === index ? { ...img, src: watermarkedSrc } : img)
                        );
                    } catch (err) {
                        console.error(err);
                        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                        setError(`${ERROR_MESSAGES.REGENERATION_FAILED}: ${errorMessage}`);
                    } finally {
                        setIsRegenerating(null);
                    }
                })();

                return prev;
            });
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`${ERROR_MESSAGES.REGENERATION_FAILED}: ${errorMessage}`);
            setIsRegenerating(null);
        }
    }, [baseImageFile]);
    
    const handleDownloadAll = () => {
        generatedImages.forEach((image, index) => {
            // Only download valid data URLs
            if (image.src && image.src.startsWith('data:')) {
                setTimeout(() => {
                    downloadImage(image.src, `A+content_image_${index + 1}.png`);
                }, index * 200);
            }
        });
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
                        A+ Content Generator
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        AI-powered image generation for your Amazon A+ content. Transform your product descriptions into stunning visuals.
                    </p>
                </header>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6 sm:p-8 lg:p-10">

                <InputForm
                    promptText={promptText}
                    onPromptTextChange={handlePromptTextChange}
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

                {/* Footer */}
                <footer className="mt-12 text-center text-sm text-gray-500">
                    <p>Powered by Google Gemini AI • Built with React & TypeScript</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
