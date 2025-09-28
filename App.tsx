import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TextInputArea } from './components/TextInputArea';
import { AudioGenerator } from './components/AudioGenerator';
import { GeneratedContent } from './components/GeneratedContent';
import { VideoPlayer } from './components/VideoPlayer';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { VideoIcon } from './components/icons/VideoIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { generateYoutubeContent, generateVideoFromText } from './services/geminiService';
import type { YouTubeContent } from './types';

const App: React.FC = () => {
    const [script, setScript] = useState<string>('');
    const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
    const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
    const [videoGenerationStatus, setVideoGenerationStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerateContent = useCallback(async () => {
        if (!script.trim()) {
            setError('Please enter a script first.');
            return;
        }
        setError(null);
        setIsLoadingContent(true);
        setGeneratedContent(null);
        try {
            const content = await generateYoutubeContent(script);
            setGeneratedContent(content);
        } catch (err) {
            console.error(err);
            setError('Failed to generate content. Please check your API key and try again.');
        } finally {
            setIsLoadingContent(false);
        }
    }, [script]);

    const handleGenerateVideo = useCallback(async () => {
        if (!script.trim()) {
            setError('Please enter a script first to generate the video.');
            return;
        }
        setError(null);
        setIsLoadingVideo(true);
        setVideoUrl(null);
        
        const statusCallback = (status: string) => {
            setVideoGenerationStatus(status);
        };

        try {
            const url = await generateVideoFromText(script, statusCallback);
            setVideoUrl(url);
        } catch (err) {
            console.error(err);
            setError('Failed to generate video. This is an experimental feature and may fail. Please try again later.');
        } finally {
            setIsLoadingVideo(false);
            setVideoGenerationStatus('');
        }
    }, [script]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-white">1. Your Video Script</h2>
                        <TextInputArea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="Enter your video script here. The more detailed it is, the better the video and content will be..."
                        />
                        <AudioGenerator script={script} isDisabled={isLoadingContent || isLoadingVideo} />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGenerateContent}
                                disabled={isLoadingContent || isLoadingVideo}
                                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoadingContent ? 'Generating...' : 'Generate Title & Description'}
                            </button>
                            <button
                                onClick={handleGenerateVideo}
                                disabled={isLoadingContent || isLoadingVideo}
                                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <VideoIcon className="w-5 h-5 mr-2" />
                                {isLoadingVideo ? 'Creating Video...' : 'Generate Video'}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        
                        <GeneratedContent data={generatedContent} isLoading={isLoadingContent} />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                         <h2 className="text-2xl font-bold text-white">2. Your Generated Video</h2>
                        <VideoPlayer 
                            videoUrl={videoUrl} 
                            isLoading={isLoadingVideo} 
                            status={videoGenerationStatus} 
                        />
                         <p className="text-xs text-center text-gray-500 -mt-4">Note: Video is generated without audio. Use the audio generator above and combine them in a video editor.</p>
                        {videoUrl && !isLoadingVideo && (
                            <a
                                href={videoUrl}
                                download="ai-generated-video.mp4"
                                className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors"
                                aria-label="Download generated video"
                            >
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Download Video
                            </a>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;