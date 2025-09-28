
import React from 'react';

interface TextInputAreaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({ value, onChange, placeholder }) => {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="relative w-full">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={12}
                className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y shadow-inner"
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
        </div>
    );
};
