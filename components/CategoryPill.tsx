
import React from 'react';

interface CategoryPillProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ name, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${isActive 
          ? 'bg-primary text-white shadow-md' 
          : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
    >
      {name}
    </button>
  );
};

export default CategoryPill;
