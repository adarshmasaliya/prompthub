
import React from 'react';
import { Link } from 'react-router-dom';
import { Prompt } from '../types';
import { TagIcon } from './icons/Icons';
import { usePrompts } from '../context/PromptContext';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
    const { getCategory } = usePrompts();
    const category = getCategory(prompt.categoryId);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out group">
      <Link to={`/prompt/${prompt.id}`} className="block">
        <div className="relative">
          <img 
            className="w-full h-48 object-cover" 
            src={prompt.imageUrl || `https://picsum.photos/seed/${prompt.id}/500/300`} 
            alt={prompt.title} 
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={prompt.title}>{prompt.title}</h3>
          <p className="text-gray-600 text-sm mt-1 h-10 overflow-hidden">{prompt.description}</p>
          {category && (
            <div className="mt-3 flex items-center text-sm text-secondary">
              <TagIcon className="w-4 h-4 mr-1.5" />
              <span>{category.name}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PromptCard;
