import { GoogleGenAI, Modality } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

export const isAiAvailable = () => !!ai;

const parseBase64 = (base64DataUrl: string): { data: string; mimeType: string } | null => {
    const match = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (match && match.length === 3) {
        return { mimeType: match[1], data: match[2] };
    }
    return null;
};

export const generatePromptWithAI = async (title: string, description: string): Promise<string> => {
  if (!ai) {
    return Promise.resolve("AI functionality is disabled. Please configure your Gemini API key.");
  }

  try {
    const fullPrompt = `Based on the following title and description, generate a detailed, creative, and effective text-to-image prompt. The prompt should be a single, comma-separated string of keywords and descriptive phrases that an AI image generator can understand.

    Title: "${title}"
    Description: "${description}"
    
    Generated Prompt:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      }
    });

    const text = response.text.trim();
    // Clean up potential markdown or unwanted formatting
    return text.replace(/`/g, '').replace('Generated Prompt:', '').trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error generating prompt with AI. Please try again.";
  }
};

export const generateImageWithNanoBanana = async (prompt: string, attachments: string[] = []): Promise<string> => {
    if (!ai) {
        throw new Error("AI functionality is disabled. Please configure your Gemini API key.");
    }

    try {
        const imageParts = attachments.map(attachment => {
            const parsed = parseBase64(attachment);
            if (parsed) {
                return {
                    inlineData: {
                        mimeType: parsed.mimeType,
                        data: parsed.data,
                    },
                };
            }
            return null;
        }).filter((part): part is { inlineData: { mimeType: string; data: string } } => part !== null);

        const textPart = { text: prompt };
        const allParts = [...imageParts, textPart];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: allParts,
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error calling Nano Banana (gemini-2.5-flash-image) API:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};

// FIX: Implement video generation services for Veo.
export const generateVideoWithVeo = async (
    prompt: string,
    aspectRatio: '16:9' | '9:16',
    resolution: '1080p' | '720p',
    startImage: string | null,
    endImage: string | null
): Promise<any> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const config: any = {
        numberOfVideos: 1,
        resolution,
        aspectRatio,
    };

    let imagePayload: any;
    if (startImage) {
        const parsed = parseBase64(startImage);
        if (parsed) {
            imagePayload = {
                imageBytes: parsed.data,
                mimeType: parsed.mimeType,
            };
        }
    }
    
    if (endImage) {
        const parsed = parseBase64(endImage);
        if (parsed) {
            config.lastFrame = {
                imageBytes: parsed.data,
                mimeType: parsed.mimeType,
            };
        }
    }

    const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || undefined,
        image: imagePayload,
        config,
    });

    return operation;
};

export const pollVideoOperation = async (operation: any): Promise<any> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
    }
    return currentOperation;
};

export const fetchVideoBlob = async (downloadLink: string): Promise<Blob> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is not configured.");
    }
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch video: ${response.statusText}. Details: ${errorText}`);
    }
    return response.blob();
};