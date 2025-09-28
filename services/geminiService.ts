import { GoogleGenAI, Type } from "@google/genai";
import type { YouTubeContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const contentGenerationModel = "gemini-2.5-flash";
const videoGenerationModel = "veo-2.0-generate-001";

const youtubeContentSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "An eye-catching, SEO-friendly YouTube title, under 60 characters."
        },
        keywords: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "A list of 10-15 relevant keywords (tags) for the video."
        },
        description: {
            type: Type.STRING,
            description: "A detailed, well-structured YouTube video description of 200-300 words, including hashtags."
        },
    },
    required: ["title", "keywords", "description"],
};

export const generateYoutubeContent = async (script: string): Promise<YouTubeContent> => {
    const prompt = `Based on the following video script, generate an optimized YouTube title, keywords, and description.

Script:
---
${script}
---
`;
    
    const response = await ai.models.generateContent({
        model: contentGenerationModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: youtubeContentSchema,
        },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as YouTubeContent;
};

const VIDEO_GENERATION_STATUS_MESSAGES = [
    "Warming up the digital director's chair...",
    "Storyboarding your script into visual scenes...",
    "Consulting with our AI cinematographers...",
    "Selecting the perfect digital, faceless actors...",
    "Rendering each frame in stunning 1080p HD...",
    "Applying cinematic color grading...",
    "Composing the final cut...",
    "Adding the final polish, almost ready!",
];


export const generateVideoFromText = async (script: string, onStatusUpdate: (status: string) => void): Promise<string> => {
    const prompt = `Generate a high-definition (1080p), cinematic, faceless stock video based on the following script. The video should visually narrate the script's content with appropriate pacing and scene changes. Use a combination of high-quality B-roll, slick animations, and abstract visuals to create an engaging experience. The overall tone should be modern, clean, and professional, suitable for a YouTube audience. Ensure there are smooth transitions between different concepts presented in the script. Do not include any text, logos, or human faces.

Script:
---
${script}
---`;
    
    onStatusUpdate(VIDEO_GENERATION_STATUS_MESSAGES[0]);

    let operation = await ai.models.generateVideos({
        model: videoGenerationModel,
        prompt: prompt,
        config: {
            numberOfVideos: 1,
        }
    });

    let messageIndex = 1;
    while (!operation.done) {
        onStatusUpdate(VIDEO_GENERATION_STATUS_MESSAGES[messageIndex % VIDEO_GENERATION_STATUS_MESSAGES.length]);
        messageIndex++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    onStatusUpdate("Finalizing your video...");
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download the generated video. Status: ${videoResponse.status}`);
    }

    const videoBlob = await videoResponse.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    return videoUrl;
};