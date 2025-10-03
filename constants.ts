/**
 * Application-wide constants
 */

// Gemini AI Models
export const MODELS = {
  TEXT: 'gemini-2.5-flash',
  IMAGE: 'gemini-2.5-flash-image-preview',
} as const;

// File Upload Validation
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

// API Configuration
export const API = {
  TIMEOUT_MS: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    GENERATE_ALL: '/api/generateAll',
    REGENERATE_SINGLE: '/api/regenerateSingle',
  },
} as const;

// Watermark Configuration
export const WATERMARK = {
  TEXT: 'Awake Inc.',
  FONT: '24px "Inter", sans-serif',
  FILL_STYLE: 'rgba(255, 255, 255, 0.7)',
  PADDING: 10,
} as const;

// Download Configuration
export const DOWNLOAD = {
  FILENAME_PREFIX: 'A+content_image_',
  DELAY_MS: 200,
  FILE_EXTENSION: '.png',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  MISSING_INPUT: 'テキストと画像の両方を入力してください。',
  MISSING_REGENERATION_DATA: '再生成の元となる画像またはプロンプトがありません。',
  FILE_TOO_LARGE: `ファイルサイズは${FILE_UPLOAD.MAX_SIZE_MB}MB以下にしてください。`,
  INVALID_FILE_TYPE: `対応している画像形式: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')}`,
  GENERATION_FAILED: '画像の生成中にエラーが発生しました',
  REGENERATION_FAILED: '画像の再生成中にエラーが発生しました',
  API_KEY_MISSING: 'GEMINI_API_KEY environment variable is required',
} as const;
