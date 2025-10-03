const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini AI model names
 */
const MODELS = {
    TEXT: 'gemini-2.5-flash',
    IMAGE: 'gemini-2.5-flash-image-preview',
};

/**
 * Validates and retrieves the Gemini API key from environment variables
 * @throws Error if API key is missing
 * @returns Validated API key
 */
function getValidatedApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
    }
    return apiKey;
}

/**
 * Creates a configured GoogleGenAI instance
 * @returns GoogleGenAI instance with validated API key
 */
function createGeminiClient() {
    const apiKey = getValidatedApiKey();
    return new GoogleGenAI({ apiKey });
}

/**
 * Structured error logger for API endpoints
 * @param {string} context - The context/function where error occurred
 * @param {unknown} error - The error object
 * @param {Record<string, unknown>} metadata - Additional metadata to log
 */
function logError(context, error, metadata = {}) {
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

module.exports = {
    MODELS,
    getValidatedApiKey,
    createGeminiClient,
    logError
};
