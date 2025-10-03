import { fileToBase64 } from '../utils/fileUtils';
import type { GeneratedImage } from '../types';
import { API } from '../constants';

/**
 * Creates an AbortController with timeout
 * @param timeoutMs Timeout in milliseconds
 * @returns AbortController instance
 */
const createAbortControllerWithTimeout = (timeoutMs: number): AbortController => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller;
};

/**
 * Calls the backend API to generate all four A+ content images.
 * @param productDescription The user-provided text.
 * @param baseImageFile The user-uploaded image file.
 * @returns A promise that resolves to an array of generated image objects.
 */
export const generateAllImages = async (productDescription: string, baseImageFile: File): Promise<GeneratedImage[]> => {
    const base64ImageData = await fileToBase64(baseImageFile);
    const controller = createAbortControllerWithTimeout(API.TIMEOUT_MS);

    try {
        // This fetch call is intended for a backend endpoint (e.g., a Vercel Function)
        // at the path `/api/generateAll`. This will not work in the current environment
        // but is structured for a real-world deployment.
        const response = await fetch('/api/generateAll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productDescription,
                base64ImageData,
                mimeType: baseImageFile.type,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred on the server.' }));
            throw new Error(errorData.message || 'Failed to generate images.');
        }

        const data = await response.json();
        return data.images; // Expects the backend to return { images: GeneratedImage[] }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`リクエストがタイムアウトしました（${API.TIMEOUT_MS / 1000}秒）`);
        }
        throw error;
    }
};

/**
 * Calls the backend API to regenerate a single image.
 * @param prompt The prompt for the specific image to regenerate.
 * @param baseImageFile The user-uploaded image file.
 * @returns A promise that resolves to the Base64 string of the new image.
 */
export const regenerateImage = async (prompt: string, baseImageFile: File): Promise<string> => {
    const base64ImageData = await fileToBase64(baseImageFile);
    const controller = createAbortControllerWithTimeout(API.TIMEOUT_MS);

    try {
        // This fetch call targets a backend endpoint at `/api/regenerateSingle`.
        const response = await fetch('/api/regenerateSingle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                base64ImageData,
                mimeType: baseImageFile.type,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred on the server.' }));
            throw new Error(errorData.message || 'Failed to regenerate the image.');
        }

        const data = await response.json();
        return data.imageBase64; // Expects the backend to return { imageBase64: string }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`リクエストがタイムアウトしました（${API.TIMEOUT_MS / 1000}秒）`);
        }
        throw error;
    }
};
