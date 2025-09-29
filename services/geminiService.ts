import { GoogleGenAI, Type } from "@google/genai";
import type { YouTubeContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const contentGenerationModel = "gemini-2.5-flash";

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
