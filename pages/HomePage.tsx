
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import PromptCard from '../components/PromptCard';
import { Category } from '../types';
import CategoryPill from '../components/CategoryPill';
import { SearchIcon } from '../components/icons/Icons';

const HomePage: React.FC = () => {
  const { prompts, categories } = usePrompts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesCategory = selectedCategory ? prompt.categoryId === selectedCategory : true;
      const matchesSearch = searchTerm ? 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) 
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [prompts, searchTerm, selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category.id) {
        setSelectedCategory(null);
    } else {
        setSelectedCategory(category.id);
        navigate(`/category/${category.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-white rounded-lg shadow-md mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Discover Your Next <span className="text-primary">Masterpiece</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our extensive library of high-quality prompts to fuel your AI art generation.
        </p>
        <div className="mt-8 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for prompts like 'cyberpunk city'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:border-primary transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          <CategoryPill name="All" isActive={!selectedCategory} onClick={() => setSelectedCategory(null)} />
          {categories.map(cat => (
            <CategoryPill 
                key={cat.id} 
                name={cat.name} 
                isActive={selectedCategory === cat.id} 
                onClick={() => handleCategoryClick(cat)}
            />
          ))}
        </div>
      </div>
      
      {/* Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-xl text-gray-500">No prompts found. Try a different search or category!</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
