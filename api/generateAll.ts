import { GoogleGenAI, Type, Modality } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Validate API key on module load
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
}

const ai = new GoogleGenAI({ apiKey });

// Model constants
const MODELS = {
    TEXT: 'gemini-2.5-flash',
    IMAGE: 'gemini-2.5-flash-image',
} as const;

async function getPromptsFromText(text: string): Promise<{ id: number; title: string; prompt: string; }[]> {
    const model = MODELS.TEXT;
    const systemInstruction = `
        あなたはSEOとコピーライティングの専門家です。与えられたA+コンテンツの文章を分析し、画像生成プロンプトを作成するためのキーワードを抽出してください。
        製品の主題は「住居用クリーナーシート（ワイプ）」です。
        抽出するキーワードは以下の4つのカテゴリーに分けてください：
        - header: 商品全体を象徴する単語やフレーズ
        - feature1: 主要な特徴1（例：香り、厚手素材など）
        - feature2: 主要な特徴2（例：多目的、フローリング対応など）
        - feature3: 主要な特徴3（例：大容量、環境配慮など）
        回答は必ずJSON形式で出力してください。
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: text,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        header: { type: Type.STRING },
                        feature1: { type: Type.STRING },
                        feature2: { type: Type.STRING },
                        feature3: { type: Type.STRING },
                    },
                    required: ["header", "feature1", "feature2", "feature3"],
                }
            }
        });

        if (!response.text) {
            throw new Error('APIレスポンスが空です。');
        }
        const keywords = JSON.parse(response.text);

        const baseInstruction = "生成する画像は、**住居用クリーナーシート（ワイプ）**を主題とし、その使用シーンをレンダリングすること。入力画像を参照し、製品のパッケージや色を維持すること。";
        const commonStyle = "文字なし。高品質なコマーシャルフォト。登場人物は日本人。";

        return [
            { id: 0, title: 'モジュール1 (ヘッダー)', prompt: `${baseInstruction} [${keywords.header}]. ${commonStyle} クリーナーシート（ワイプ）を主役にしたクローズアップ。清潔感のあるスタジオ照明。除菌・掃除力を想起させる水滴や光のエフェクト。` },
            { id: 1, title: 'モジュール2 (特徴1)', prompt: `${baseInstruction} [${keywords.feature1}]. ${commonStyle} 日本人の女性がリビングでフローリングを清掃している様子。清掃後の清潔感と爽やかな香りが広がるイメージ。シートの厚手で丈夫な質感の接写。` },
            { id: 2, title: 'モジュール3 (特徴2)', prompt: `${baseInstruction} [${keywords.feature2}]. ${commonStyle} 日本のモダンなキッチンや水回りなど、複数の場所でワイプが活躍している様子を分割画面またはコラージュ風に表現。多目的利用のシーン。` },
            { id: 3, title: 'モジュール4 (特徴3)', prompt: `${baseInstruction} [${keywords.feature3}]. ${commonStyle} 大容量の製品パッケージが、日本の一般的な家庭の掃除用品棚に並んでいる様子。または、環境に配慮したECOパッケージデザインを強調したレイアウト。` },
        ];
    } catch (error) {
        console.error("Error generating prompts:", error);
        throw new Error("テキストからのプロンプト生成に失敗しました。");
    }
}

async function generateSingleImage(prompt: string, base64ImageData: string, mimeType: string): Promise<string> {
    const model = MODELS.IMAGE;
    try {
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
        
        const candidate = response.candidates?.[0];
        if (!candidate?.content?.parts) {
            throw new Error('APIレスポンスに画像データが見つかりませんでした。');
        }

        const imagePart = candidate.content.parts.find(p => p.inlineData);
        if (!imagePart?.inlineData?.data) {
            throw new Error('APIレスポンスに画像データが見つかりませんでした。');
        }
        return imagePart.inlineData.data;

    } catch (error) {
        console.error(`Error generating image for prompt "${prompt.substring(0, 50)}...":`, error);
        throw new Error(`画像の生成に失敗しました。`);
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'POSTリクエストのみ許可されています。' });
    }

    try {
        const { productDescription, base64ImageData, mimeType } = req.body;

        const prompts = await getPromptsFromText(productDescription);

        const imageGenerationPromises = prompts.map(p => 
            generateSingleImage(p.prompt, base64ImageData, mimeType)
        );
        const generatedImageB64s = await Promise.all(imageGenerationPromises);

        const images = prompts.map((p, index) => ({
            id: p.id,
            title: p.title,
            prompt: p.prompt,
            src: generatedImageB64s[index],
        }));

        return res.status(200).json({ images });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'サーバーで不明なエラーが発生しました。';
        console.error('Handler error:', error);
        return res.status(500).json({ message: errorMessage });
    }
}
