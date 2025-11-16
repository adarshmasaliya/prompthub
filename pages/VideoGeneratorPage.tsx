
import React, { useState, useEffect } from 'react';
import { isAiAvailable, generateVideoWithVeo, pollVideoOperation, fetchVideoBlob } from '../services/geminiService';
import { ArrowPathIcon, DownloadIcon, VideoCameraIcon, WarningIcon } from '../components/icons/Icons';
import ImageUploadBox from '../components/ImageUploadBox';

// FIX: Removed local AIStudio interface and declare global block to resolve type conflicts. They are now in types.ts.

const loadingMessages = [
    "Kicking off the generation process...",
    "Warming up the AI engines...",
    "Composing the digital scenes...",
    "Rendering frames, this may take a few minutes...",
    "The AI is hard at work on your video...",
    "Applying the finishing touches...",
    "Almost there, preparing your masterpiece...",
];

const VideoGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('A neon hologram of a cat driving at top speed');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'1080p' | '720p'>('720p');
    const [startImage, setStartImage] = useState<string | null>(null);
    const [endImage, setEndImage] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const [apiKeySelected, setApiKeySelected] = useState(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkApiKey();

        let messageInterval: number;
        if (isLoading) {
            let messageIndex = 0;
            messageInterval = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 5000);
        }
        return () => clearInterval(messageInterval);
    }, [isLoading]);
    
    const resetForm = () => {
        setPrompt('A neon hologram of a cat driving at top speed');
        setAspectRatio('16:9');
        setResolution('720p');
        setStartImage(null);
        setEndImage(null);
        setVideoUrl(null);
        setError(null);
    };

    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume the user selected a key. We'll verify on the next API call.
            setApiKeySelected(true);
        }
    };
    
    const handleGeneration = async () => {
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            let initialOperation = await generateVideoWithVeo(prompt, aspectRatio, resolution, startImage, endImage);
            let finalOperation = await pollVideoOperation(initialOperation);

            const downloadLink = finalOperation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const blob = await fetchVideoBlob(downloadLink);
                const objectUrl = URL.createObjectURL(blob);
                setVideoUrl(objectUrl);
            } else {
                throw new Error("Video generation completed, but no download link was found.");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            if (errorMessage.includes("Requested entity was not found")) {
                setError("Your API Key is invalid or missing permissions. Please select a valid key.");
                setApiKeySelected(false);
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAiAvailable()) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">AI Service Unavailable</p>
                    <p>The Gemini API key is not configured. Please set up your API key to use this feature.</p>
                </div>
            </div>
        );
    }
    
    if (!apiKeySelected) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-blue-100 border-l-4 border-primary text-primary-dark p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                    <WarningIcon className="w-12 h-12 mx-auto text-primary" />
                    <h2 className="text-2xl font-bold mt-4">API Key Required for Veo</h2>
                    <p className="mt-2">
                        Video generation with Veo requires you to select your own API key.
                        Please ensure your project is configured for billing.
                    </p>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:underline mt-1 inline-block">
                        Learn more about billing
                    </a>
                    <button
                        onClick={handleSelectKey}
                        className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors"
                    >
                        Select Your API Key
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                 <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                    AI Video <span className="text-primary">Generator</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Create stunning videos from text prompts and images with the power of Veo.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-2xl font-bold text-gray-700 mb-4">1. Configure your video</h2>
                     <fieldset disabled={isLoading} className="space-y-4">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
                            <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <ImageUploadBox label="Starting Image (Optional)" imageUrl={startImage ?? undefined} onUpload={setStartImage} onRemove={() => setStartImage(null)} />
                           <ImageUploadBox label="Ending Image (Optional)" imageUrl={endImage ?? undefined} onUpload={setEndImage} onRemove={() => setEndImage(null)} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                                    <option value="16:9">16:9 (Landscape)</option>
                                    <option value="9:16">9:16 (Portrait)</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Resolution</label>
                                <select value={resolution} onChange={e => setResolution(e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                                    <option value="720p">720p</option>
                                    <option value="1080p">1080p</option>
                                </select>
                            </div>
                        </div>

                         <button
                            onClick={handleGeneration}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <VideoCameraIcon className="w-6 h-6" />
                            Generate Video
                        </button>
                     </fieldset>
                </div>

                {/* Right side: Output */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[400px]">
                     <h2 className="text-2xl font-bold text-gray-700 mb-4 self-start">2. Your Result</h2>
                     <div className="w-full flex-grow flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        {isLoading && (
                             <div className="text-center text-gray-600">
                                <ArrowPathIcon className="w-12 h-12 animate-spin mx-auto text-primary" />
                                <p className="mt-2 font-medium">Generating your video...</p>
                                <p className="text-sm">{loadingMessage}</p>
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="text-center text-red-600 p-4">
                                <p className="font-bold">Generation Failed</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        {!isLoading && !error && videoUrl && (
                            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                        )}
                         {!isLoading && !error && !videoUrl && (
                            <div className="text-center text-gray-500">
                                <VideoCameraIcon className="w-12 h-12 mx-auto" />
                                <p className="mt-2 font-medium">Your generated video will appear here.</p>
                            </div>
                        )}
                    </div>
                     {videoUrl && !isLoading && (
                        <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <a href={videoUrl} download={`prompthub-video-${Date.now()}.mp4`} className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors text-center">
                                <DownloadIcon className="w-4 h-4" /> Download
                            </a>
                            <button onClick={resetForm} className="flex items-center justify-center gap-2 p-2 rounded-md bg-secondary text-white hover:bg-primary transition-colors">
                                Generate Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoGeneratorPage;