import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateImageWithNanoBanana, isAiAvailable } from '../services/geminiService';
import { SparklesIcon, DownloadIcon, RefreshIcon, ClipboardIcon, CheckCircleIcon, PlusIcon, ArrowPathIcon } from '../components/icons/Icons';
import ImageUploadBox from '../components/ImageUploadBox';

const MAX_PROMPT_LENGTH = 1000;

const ImageGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('A photorealistic image of a futuristic sports car driving through a neon-lit city at night, rain-slicked streets reflecting the vibrant lights.');
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    // State for the 5 attachment boxes
    const [logo, setLogo] = useState<string | null>(null);
    const [productImage, setProductImage] = useState<string | null>(null);
    const [humanPhoto, setHumanPhoto] = useState<string | null>(null);
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [asset, setAsset] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        const attachments = [logo, productImage, humanPhoto, referenceImage, asset].filter(Boolean) as string[];

        try {
            const imageUrl = await generateImageWithNanoBanana(prompt, attachments);
            setGeneratedImageUrl(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = `prompthub-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSaveToPrompts = () => {
        if (!generatedImageUrl || !prompt) return;
        // Navigate to the add prompt page with state
        navigate('/admin/prompts/new', {
            state: {
                promptText: prompt,
                imageUrl: generatedImageUrl
            }
        });
    };

    if (!isAiAvailable()) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">AI Service Unavailable</p>
                    <p>The Gemini API key is not configured. Please set up your API key to use the image generation feature.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                 <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                    AI Image <span className="text-primary">Generator</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Bring your ideas to life. Describe anything you can imagine and let our AI create it for you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Prompt Input */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">1. Describe your image</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="prompt" className="sr-only">Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A cute capybara wearing a top hat, studio portrait, photorealistic..."
                                rows={8}
                                maxLength={MAX_PROMPT_LENGTH}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors"
                            />
                            <p className="text-right text-sm text-gray-500 mt-1">
                                {prompt.length} / {MAX_PROMPT_LENGTH}
                            </p>
                        </div>
                        
                        {/* Attachments Section */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Attachments (Optional)</h3>
                            <p className="text-sm text-gray-500 mb-4">Add images to influence the generation (e.g., add a logo to a product, or provide a style reference).</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ImageUploadBox label="Logo Upload" imageUrl={logo ?? undefined} onUpload={setLogo} onRemove={() => setLogo(null)} />
                                <ImageUploadBox label="Product Image Upload" imageUrl={productImage ?? undefined} onUpload={setProductImage} onRemove={() => setProductImage(null)} />
                                <ImageUploadBox label="Human Photo Upload" imageUrl={humanPhoto ?? undefined} onUpload={setHumanPhoto} onRemove={() => setHumanPhoto(null)} />
                                <ImageUploadBox label="Reference Image Upload" imageUrl={referenceImage ?? undefined} onUpload={setReferenceImage} onRemove={() => setReferenceImage(null)} />
                                <ImageUploadBox label="Asset Attachment" imageUrl={asset ?? undefined} onUpload={setAsset} onRemove={() => setAsset(null)} />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : <SparklesIcon className="w-6 h-6" />}
                            {isLoading ? 'Generating...' : 'Generate Image'}
                        </button>
                    </div>
                </div>

                {/* Right side: Image Output */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[400px]">
                     <h2 className="text-2xl font-bold text-gray-700 mb-4 self-start">2. Your Result</h2>
                     <div className="w-full flex-grow flex items-center justify-center aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {isLoading && (
                            <div className="text-center text-gray-600">
                                <ArrowPathIcon className="w-12 h-12 animate-spin mx-auto text-primary" />
                                <p className="mt-2 font-medium">Generating your masterpiece...</p>
                                <p className="text-sm">This may take a moment.</p>
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="text-center text-red-600 p-4">
                                <p className="font-bold">Generation Failed</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        {!isLoading && !error && generatedImageUrl && (
                            <img src={generatedImageUrl} alt="Generated by AI" className="w-full h-full object-contain" />
                        )}
                        {!isLoading && !error && !generatedImageUrl && (
                            <div className="text-center text-gray-500">
                                <SparklesIcon className="w-12 h-12 mx-auto" />
                                <p className="mt-2 font-medium">Your generated image will appear here.</p>
                            </div>
                        )}
                    </div>
                     {generatedImageUrl && !isLoading && (
                        <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                            <button onClick={handleDownload} className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">
                                <DownloadIcon className="w-4 h-4" /> Download
                            </button>
                            <button onClick={handleGenerate} className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">
                                <RefreshIcon className="w-4 h-4" /> Regenerate
                            </button>
                             <button onClick={handleCopy} className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors">
                                {copied ? <CheckCircleIcon className="w-4 h-4 text-green-600"/> : <ClipboardIcon className="w-4 h-4"/> }
                                {copied ? 'Copied!' : 'Copy Prompt'}
                            </button>
                             <button onClick={handleSaveToPrompts} className="flex items-center justify-center gap-2 p-2 rounded-md bg-secondary text-white hover:bg-primary transition-colors">
                                <PlusIcon className="w-4 h-4" /> Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorPage;