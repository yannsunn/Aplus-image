import { Modality } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createGeminiClient, logError, MODELS } from './utils';

// Lazy initialization of Gemini client
let ai: ReturnType<typeof createGeminiClient> | null = null;
function getAI() {
    if (!ai) {
        ai = createGeminiClient();
    }
    return ai;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'POSTリクエストのみ許可されています。' });
    }

    try {
        const { prompt, base64ImageData, mimeType } = req.body;

        if (!prompt || !base64ImageData || !mimeType) {
            return res.status(400).json({ message: 'prompt, base64ImageData, mimeTypeが必要です。'});
        }

        const response = await getAI().models.generateContent({
            model: MODELS.IMAGE,
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { data: base64ImageData, mimeType } },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const candidate = response.candidates?.[0];
        if (!candidate?.content?.parts) {
            throw new Error('APIレスポンスに画像データが見つかりませんでした。');
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (!imagePart?.inlineData?.data) {
            throw new Error('APIレスポンスに画像データが見つかりませんでした。');
        }

        return res.status(200).json({ imageBase64: imagePart.inlineData.data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'サーバーで不明なエラーが発生しました。';
        logError('regenerateSingle.handler', error);
        return res.status(500).json({ message: errorMessage });
    }
}
