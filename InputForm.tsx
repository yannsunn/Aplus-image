import React, { ChangeEvent } from 'react';
import Loader from './Loader';

interface InputFormProps {
    promptText: string;
    onPromptTextChange: (value: string) => void;
    onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    baseImagePreview: string;
    onSubmit: () => void;
    isLoading: boolean;
    isSubmitDisabled: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
    promptText,
    onPromptTextChange,
    onImageFileChange,
    baseImagePreview,
    onSubmit,
    isLoading,
    isSubmitDisabled,
}) => {
    return (
        <div className="mb-6 space-y-4">
            <div>
                <label htmlFor="prompt-text" className="block text-sm font-medium text-gray-700 mb-2">A+コンテンツのテキストを貼り付けてください:</label>
                <textarea
                    id="prompt-text"
                    rows={8}
                    value={promptText}
                    onChange={(e) => onPromptTextChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="例：濃厚クリーミー！とろけるチーズマカロニ..."
                />
            </div>
            <div>
                <label htmlFor="image-input" className="block text-sm font-medium text-gray-700 mb-2">元となる画像をアップロードしてください:</label>
                <input
                    type="file"
                    id="image-input"
                    accept="image/*"
                    onChange={onImageFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
                />
            </div>
            {baseImagePreview && (
                <div className="flex justify-center items-center rounded-lg overflow-hidden bg-gray-200 p-2">
                    <img src={baseImagePreview} alt="アップロードされた画像のプレビュー" className="max-h-96 w-auto object-contain rounded-lg shadow-md" />
                </div>
            )}
            <div className="text-right mt-4">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                    className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center ml-auto"
                >
                    {isLoading ? <><Loader size="w-5 h-5" /> <span className="ml-2">生成中...</span></> : '画像を生成'}
                </button>
            </div>
        </div>
    );
};

export default InputForm;
