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
        <div className="space-y-6">
            {/* Text Input Section */}
            <div>
                <label htmlFor="prompt-text" className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Product Description
                </label>
                <textarea
                    id="prompt-text"
                    rows={8}
                    value={promptText}
                    onChange={(e) => onPromptTextChange(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm hover:border-gray-300"
                    placeholder="Paste your A+ content text here... (e.g., Premium organic cleaning wipes...)"
                />
            </div>

            {/* Image Upload Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200">
                <label htmlFor="image-input" className="block text-base font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>📸 Product Image (Required)</span>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                    Upload a product image to generate AI-enhanced A+ content images
                </p>
                <div className="relative">
                    <input
                        type="file"
                        id="image-input"
                        accept="image/*"
                        onChange={onImageFileChange}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white hover:file:from-indigo-700 hover:file:to-purple-700 file:transition-all file:duration-200 file:cursor-pointer file:shadow-xl cursor-pointer border-2 border-dashed border-indigo-300 rounded-2xl p-6 hover:border-indigo-500 hover:bg-white/60 transition-all bg-white/40 backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Image Preview */}
            {baseImagePreview && (
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 border-2 border-gray-200">
                    <div className="absolute top-2 right-2 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                            ✓ Preview
                        </span>
                    </div>
                    <img
                        src={baseImagePreview}
                        alt="Uploaded preview"
                        className="max-h-96 w-full object-contain rounded-xl shadow-lg"
                    />
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-3 transform hover:scale-105 active:scale-95 disabled:transform-none"
                >
                    {isLoading ? (
                        <>
                            <Loader size="w-5 h-5" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Generate Images</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InputForm;
