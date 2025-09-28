import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { StopIcon } from './icons/StopIcon';

interface AudioGeneratorProps {
    script: string;
    isDisabled: boolean;
}

export const AudioGenerator: React.FC<AudioGeneratorProps> = ({ script, isDisabled }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | undefined>();
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const populateVoiceList = useCallback(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) return;
        
        const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
        setVoices(englishVoices);

        if (!selectedVoiceURI && englishVoices.length > 0) {
            const defaultVoice = englishVoices.find(voice => voice.default) || englishVoices[0];
            if (defaultVoice) {
                setSelectedVoiceURI(defaultVoice.voiceURI);
            }
        }
    }, [selectedVoiceURI]);


    useEffect(() => {
        populateVoiceList();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }
        
        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [populateVoiceList]);

    const handlePlay = () => {
        if (!script.trim() || isDisabled) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        } else {
            const newUtterance = new SpeechSynthesisUtterance(script);
            utteranceRef.current = newUtterance;

            if (selectedVoiceURI) {
                const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
                if (selectedVoice) {
                    newUtterance.voice = selectedVoice;
                }
            }

            newUtterance.onstart = () => {
                setIsSpeaking(true);
                setIsPaused(false);
            };

            newUtterance.onend = () => {
                setIsSpeaking(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };
            
            newUtterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror', event);
                setIsSpeaking(false);
                setIsPaused(false);
            };

            window.speechSynthesis.speak(newUtterance);
        }
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsSpeaking(false);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
    };
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-white mb-3">1.5 Generate Audio (Voiceover)</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                 <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full sm:w-auto flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    aria-label="Select voice"
                    disabled={isDisabled || isSpeaking || isPaused}
                >
                    {voices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                     {voices.length === 0 && <option>No voices available</option>}
                </select>
                <div className="flex gap-2">
                    {isSpeaking ? (
                         <button onClick={handlePause} className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white transition-colors" aria-label="Pause audio">
                            <PauseIcon className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={handlePlay} disabled={isDisabled || !script.trim()} className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors" aria-label="Play audio">
                            <PlayIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={handleStop} disabled={!isSpeaking && !isPaused} className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors disabled:bg-red-400 disabled:cursor-not-allowed" aria-label="Stop audio">
                        <StopIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
