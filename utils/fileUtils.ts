import { WATERMARK } from '../constants';

/**
 * Converts a File object to a Base64 encoded string, without the data URL prefix.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Adds a watermark to a Base64 encoded image and returns a new image as a data URL.
 */
export const addWatermark = (base64Image: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64Image}`;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback to original image if context is not available
        resolve(img.src);
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Add watermark using constants
      ctx.font = WATERMARK.FONT;
      ctx.fillStyle = WATERMARK.FILL_STYLE;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      ctx.fillText(WATERMARK.TEXT, canvas.width - WATERMARK.PADDING, canvas.height - WATERMARK.PADDING);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
        // In case of error loading the image, resolve with a placeholder or the broken source
        resolve('https://placehold.co/500x500/cccccc/000000?text=Image+Load+Error');
    };
  });
};


/**
 * Triggers a browser download for a given data URL.
 */
export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
