
import React from 'react';
import { VideoIcon } from './icons/VideoIcon';

interface VideoPlayerProps {
    videoUrl: string | null;
    isLoading: boolean;
    status: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isLoading, status }) => {
    return (
        <div className="aspect-video w-full bg-gray-800 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-10">
                    <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white mt-4 text-center font-medium">{status || 'Generating video...'}</p>
                </div>
            )}
            {!isLoading && !videoUrl && (
                <div className="text-center text-gray-500">
                    <VideoIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>Your generated video will appear here.</p>
                </div>
            )}
            {videoUrl && (
                <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                >
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};
