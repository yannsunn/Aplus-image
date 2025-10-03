module.exports = async function handler(_req, res) {
    try {
        // Test environment variables
        const apiKey = process.env.GEMINI_API_KEY;

        return res.status(200).json({
            success: true,
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey?.length || 0,
            nodeVersion: process.version,
            env: process.env.NODE_ENV
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;

        return res.status(500).json({
            success: false,
            error: errorMessage,
            stack: errorStack
        });
    }
};
