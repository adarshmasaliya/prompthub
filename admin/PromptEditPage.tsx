import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import { Prompt } from '../types';
import { generatePromptWithAI } from '../services/geminiService';
import { SparklesIcon, ArrowPathIcon } from '../components/icons/Icons';
import ImageUploadBox from '../components/ImageUploadBox';

const PromptEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPrompt, addPrompt, updatePrompt, categories } = usePrompts();
  const [isGenerating, setIsGenerating] = useState(false);

  const initialState = location.state as Partial<Omit<Prompt, 'id' | 'createdAt'>> || {};

  const [formData, setFormData] = useState<Omit<Prompt, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    promptText: '',
    categoryId: categories[0]?.id || '',
    imageUrl: '',
    logoUrl: '',
    productImageUrl: '',
    humanPhotoUrl: '',
    referenceImageUrl: '',
    assetUrl: '',
    ...initialState,
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const existingPrompt = getPrompt(id);
      if (existingPrompt) {
        setFormData(existingPrompt);
      }
    }
  }, [id, isEditing, getPrompt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttachmentChange = (field: keyof Omit<Prompt, 'id' | 'createdAt'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePrompt = async () => {
      if(!formData.title || !formData.description) {
          alert("Please provide a title and description to generate a prompt.");
          return;
      }
      setIsGenerating(true);
      const generatedText = await generatePromptWithAI(formData.title, formData.description);
      setFormData(prev => ({ ...prev, promptText: generatedText }));
      setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      updatePrompt({ ...formData, id, createdAt: getPrompt(id)?.createdAt || new Date().toISOString() });
    } else {
      addPrompt(formData);
    }
    navigate('/admin/prompts');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Edit Prompt' : 'Create New Prompt'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Text Fields */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="promptText" className="block text-sm font-medium text-gray-700">Full Prompt Text</label>
            <textarea name="promptText" id="promptText" value={formData.promptText} onChange={handleChange} required rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm font-mono" />
            <button
                type="button"
                onClick={handleGeneratePrompt}
                disabled={isGenerating}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400"
            >
                {isGenerating ? <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin"/> : <SparklesIcon className="w-5 h-5 mr-2"/>}
                {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
            <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Main Image URL (Optional)</label>
            <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder="https://... or base64 data"/>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ImageUploadBox
                  label="Logo Upload"
                  imageUrl={formData.logoUrl}
                  onUpload={(base64) => handleAttachmentChange('logoUrl', base64)}
                  onRemove={() => handleAttachmentChange('logoUrl', '')}
              />
              <ImageUploadBox
                  label="Product Image Upload"
                  imageUrl={formData.productImageUrl}
                  onUpload={(base64) => handleAttachmentChange('productImageUrl', base64)}
                  onRemove={() => handleAttachmentChange('productImageUrl', '')}
              />
              <ImageUploadBox
                  label="Human Photo Upload"
                  imageUrl={formData.humanPhotoUrl}
                  onUpload={(base64) => handleAttachmentChange('humanPhotoUrl', base64)}
                  onRemove={() => handleAttachmentChange('humanPhotoUrl', '')}
              />
              <ImageUploadBox
                  label="Reference Image Upload"
                  imageUrl={formData.referenceImageUrl}
                  onUpload={(base64) => handleAttachmentChange('referenceImageUrl', base64)}
                  onRemove={() => handleAttachmentChange('referenceImageUrl', '')}
              />
              <ImageUploadBox
                  label="Asset Attachment"
                  imageUrl={formData.assetUrl}
                  onUpload={(base64) => handleAttachmentChange('assetUrl', base64)}
                  onRemove={() => handleAttachmentChange('assetUrl', '')}
              />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">{isEditing ? 'Save Changes' : 'Create Prompt'}</button>
        </div>
      </form>
    </div>
  );
};

export default PromptEditPage;