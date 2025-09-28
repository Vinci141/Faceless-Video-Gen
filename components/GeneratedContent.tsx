
import React from 'react';
import type { YouTubeContent } from '../types';

interface GeneratedContentProps {
    data: YouTubeContent | null;
    isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded-md w-3/4"></div>
        <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-700 rounded-full w-24"></div>
            <div className="h-6 bg-gray-700 rounded-full w-16"></div>
            <div className="h-6 bg-gray-700 rounded-full w-28"></div>
        </div>
        <div>
            <div className="h-4 bg-gray-700 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded-md w-5/6"></div>
        </div>
    </div>
);


export const GeneratedContent: React.FC<GeneratedContentProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <SkeletonLoader />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-gray-500">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Generated Content</h3>
                <p>Your generated title, keywords, and description will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wider">Title</h3>
                <p className="text-xl font-bold text-white">{data.title}</p>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wider">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {data.keywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-indigo-400 mb-2 uppercase tracking-wider">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{data.description}</p>
            </div>
        </div>
    );
};
