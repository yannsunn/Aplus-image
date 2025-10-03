const { Type, Modality } = require('@google/genai');
const { createGeminiClient, logError, MODELS } = require('./utils');

// Lazy initialization of Gemini client
let ai = null;
function getAI() {
    if (!ai) {
        ai = createGeminiClient();
    }
    return ai;
}

async function getPromptsFromText(text) {
    const model = MODELS.TEXT;
    const systemInstruction = `
        あなたはSEOとコピーライティングの専門家です。与えられた商品説明文を分析し、Amazon A+コンテンツ用の画像生成プロンプトを作成するためのキーワードを抽出してください。

        抽出するキーワードは以下の4つのカテゴリーに分けてください：
        - header: 商品全体を象徴する単語やフレーズ（商品名、ブランド、主要な価値提案など）
        - feature1: 主要な特徴1（品質、素材、技術、デザインなど）
        - feature2: 主要な特徴2（用途、使用シーン、機能性など）
        - feature3: 主要な特徴3（サイズ、容量、付加価値、環境配慮など）

        回答は必ずJSON形式で出力してください。
    `;

    try {
        const response = await getAI().models.generateContent({
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

        const baseInstruction = "Reference the input image and maintain the product's design, packaging, and colors. Generate a professional product photo that maximizes the product's appeal. If tissues or props appear in the image, ignore them and focus only on the product.";
        const commonStyle = "No text. High-quality commercial photography. Atmosphere tailored to the appropriate target audience.";

        return [
            { id: 0, title: 'モジュール1 (ヘッダー)', prompt: `${baseInstruction} Theme: [${keywords.header}]. ${commonStyle} Close-up shot with the product as the main focus. Studio lighting that highlights the product's appeal. Composition that visually conveys the product's key features and value.` },
            { id: 1, title: 'モジュール2 (特徴1)', prompt: `${baseInstruction} Theme: [${keywords.feature1}]. ${commonStyle} Express the product's usage scenes and features. Show the product in actual use situations blending into lifestyle. Close-up shots that convey quality and material feel.` },
            { id: 2, title: 'モジュール3 (特徴2)', prompt: `${baseInstruction} Theme: [${keywords.feature2}]. ${commonStyle} Express the product's purpose and functionality. Show various usage scenarios in split-screen or collage style. Emphasize diversity and convenience.` },
            { id: 3, title: 'モジュール4 (特徴3)', prompt: `${baseInstruction} Theme: [${keywords.feature3}]. ${commonStyle} Emphasize the product packaging design and added value. Image of the product placed in actual retail environments or lifestyle settings. Composition that conveys size and capacity.` },
        ];
    } catch (error) {
        logError('getPromptsFromText', error);
        throw new Error("テキストからのプロンプト生成に失敗しました。");
    }
}

async function generateSingleImage(prompt, base64ImageData, mimeType) {
    const model = MODELS.IMAGE;
    try {
        const response = await getAI().models.generateContent({
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
        logError('generateSingleImage', error, { promptPreview: prompt.substring(0, 50) });
        throw new Error(`画像の生成に失敗しました。`);
    }
}

module.exports = async function handler(req, res) {
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
        logError('generateAll.handler', error);
        return res.status(500).json({ message: errorMessage });
    }
};
