<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# A+コンテンツ画像生成ツール

Google Gemini APIを使用した、A+コンテンツ用の画像を自動生成するWebアプリケーションです。

## Features

- 📝 テキストから画像生成プロンプトを自動抽出
- 🧹 **Amazonページからの商品情報自動抽出** - 500文字以上のテキストから商品詳細のみを抽出
- 🎨 ヘッダーと3つの特徴画像（計4枚）を一括生成
- 🖼️ **製品画像ベースの生成** - アップロードした商品画像を参照してAI画像を生成
- 🔄 個別の画像を再生成可能
- 💧 自動ウォーターマーク追加
- 📥 一括ダウンロード機能
- ✅ ファイルアップロードの検証（最大10MB、JPEG/PNG/WebP/GIF）
- ⏱️ APIリクエストのタイムアウト処理（30秒）

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Get your API key from: https://ai.google.dev/

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add `GEMINI_API_KEY` to environment variables in Vercel settings
4. Deploy

## Security Notes

⚠️ **IMPORTANT**: Never commit your `.env` file or API keys to version control!

- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template for required environment variables
- For production deployments, set environment variables in your hosting platform (e.g., Vercel)
- The API key is validated on server startup to fail fast if missing

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Vercel Serverless Functions
- **AI**: Google Gemini 2.5 Flash (text & image generation)

## Project Structure

```
├── api/                    # Vercel Serverless Functions
│   ├── generateAll.ts     # Generate all 4 images
│   └── regenerateSingle.ts # Regenerate single image
├── services/              # API client services
│   └── apiClient.ts       # Frontend API client
├── utils/                 # Utility functions
│   ├── fileUtils.ts       # File conversion & watermark
│   └── textProcessor.ts   # Amazon text extraction
├── constants.ts           # Application constants
└── *.tsx                  # React components
```

## License

MIT
