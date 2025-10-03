import { GoogleGenAI, Modality } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
const model = 'gemini-2.5-flash-image';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'POSTリクエストのみ許可されています。' });
    }

    try {
        const { prompt, base64ImageData, mimeType } = req.body;

        if (!prompt || !base64ImageData || !mimeType) {
            return res.status(400).json({ message: 'prompt, base64ImageData, mimeTypeが必要です。'});
        }

        const response = await ai.models.generateContent({
            model,
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

        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData) {
            throw new Error('APIレスポンスに画像データが見つかりませんでした。');
        }

        return res.status(200).json({ imageBase64: imagePart.inlineData.data });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'サーバーで不明なエラーが発生しました。';
        console.error('Regeneration handler error:', error);
        return res.status(500).json({ message: errorMessage });
    }
}
