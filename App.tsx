import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TextInputArea } from './components/TextInputArea';
import { AudioGenerator } from './components/AudioGenerator';
import { GeneratedContent } from './components/GeneratedContent';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateYoutubeContent } from './services/geminiService';
import type { YouTubeContent } from './types';

const App: React.FC = () => {
    const [script, setScript] = useState<string>('');
    const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
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

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-white">1. Your Script</h2>
                        <TextInputArea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="Enter your video script here. The more detailed it is, the better the content will be..."
                        />
                        <AudioGenerator script={script} isDisabled={isLoadingContent} />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGenerateContent}
                                disabled={isLoadingContent}
                                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoadingContent ? 'Generating...' : 'Generate Title, Keywords & Description'}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        
                        <div className="mt-4">
                             <h2 className="text-2xl font-bold text-white mb-6">2. Your Generated Content</h2>
                             <GeneratedContent data={generatedContent} isLoading={isLoadingContent} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
