import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import { ArrowLeftIcon, ClipboardIcon, CheckCircleIcon, TagIcon } from '../components/icons/Icons';

const AttachmentThumbnail: React.FC<{ label: string; url: string }> = ({ label, url }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={url} alt={label} className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"/>
        </a>
        <p className="text-center text-sm font-medium text-gray-600 p-2 truncate">{label}</p>
    </div>
);

const PromptDetailPage: React.FC = () => {
  const { promptId } = useParams<{ promptId: string }>();
  const { getPrompt, getCategory } = usePrompts();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const prompt = promptId ? getPrompt(promptId) : undefined;
  const category = prompt ? getCategory(prompt.categoryId) : undefined;

  if (!prompt) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Prompt not found</h2>
        <Link to="/" className="text-secondary hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const attachments = [
      { label: 'Logo', url: prompt.logoUrl },
      { label: 'Product Image', url: prompt.productImageUrl },
      { label: 'Human Photo', url: prompt.humanPhotoUrl },
      { label: 'Reference Image', url: prompt.referenceImageUrl },
      { label: 'Asset', url: prompt.assetUrl },
  ].filter(att => att.url);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 font-medium transition-colors">
        <ArrowLeftIcon className="w-5 h-5"/>
        Back to prompts
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              className="w-full h-64 md:h-full object-cover" 
              src={prompt.imageUrl || `https://picsum.photos/seed/${prompt.id}/800/600`} 
              alt={prompt.title} 
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
              {category && (
                <Link to={`/category/${category.id}`} className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary font-semibold mb-2">
                  <TagIcon className="w-4 h-4"/> {category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
              <p className="mt-2 text-gray-600">{prompt.description}</p>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Full Prompt</label>
              <div className="mt-1 relative">
                <textarea
                  readOnly
                  value={prompt.promptText}
                  className="w-full p-3 pr-12 bg-gray-100 border border-gray-300 rounded-md text-gray-800 font-mono text-sm resize-none h-32"
                />
                <button 
                  onClick={handleCopy} 
                  className="absolute top-2 right-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                  title="Copy Prompt"
                >
                  {copied ? <CheckCircleIcon className="w-5 h-5 text-green-600" /> : <ClipboardIcon className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
              {copied && <p className="text-green-600 text-sm mt-2">Copied to clipboard!</p>}
            </div>
          </div>
        </div>
      </div>
      
      {attachments.length > 0 && (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Attachments</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {attachments.map(att => (
                    att.url && <AttachmentThumbnail key={att.label} label={att.label} url={att.url} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default PromptDetailPage;