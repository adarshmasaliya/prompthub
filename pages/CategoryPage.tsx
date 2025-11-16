
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import PromptCard from '../components/PromptCard';
import { ArrowLeftIcon } from '../components/icons/Icons';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { prompts, getCategory } = usePrompts();
  const navigate = useNavigate();

  const category = categoryId ? getCategory(categoryId) : undefined;
  const filteredPrompts = prompts.filter(p => p.categoryId === categoryId);

  if (!category) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <Link to="/" className="text-secondary hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 font-medium transition-colors">
        <ArrowLeftIcon className="w-5 h-5"/>
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
        Category: <span className="text-primary">{category.name}</span>
      </h1>

      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-xl text-gray-500">No prompts in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
