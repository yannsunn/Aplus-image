import { GoogleGenAI } from '@google/genai';
import { ERROR_MESSAGES } from '../constants';

/**
 * Validates and retrieves the Gemini API key from environment variables
 * @throws Error if API key is missing
 * @returns Validated API key
 */
export function getValidatedApiKey(): string {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
    }
    return apiKey;
}

/**
 * Creates a configured GoogleGenAI instance
 * @returns GoogleGenAI instance with validated API key
 */
export function createGeminiClient(): GoogleGenAI {
    const apiKey = getValidatedApiKey();
    return new GoogleGenAI({ apiKey });
}

/**
 * Structured error logger for API endpoints
 * @param context The context/function where error occurred
 * @param error The error object
 * @param metadata Additional metadata to log
 */
export function logError(context: string, error: unknown, metadata?: Record<string, unknown>): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        context,
        error: errorMessage,
        stack: errorStack,
        ...metadata
    }));
}
