
import React, { useState } from 'react';
import { usePrompts } from '../context/PromptContext';
import { DeleteIcon, PlusIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const CategoriesListPage: React.FC = () => {
  const { categories, addCategory, deleteCategory } = usePrompts();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
    }
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400"
              disabled={!newCategoryName.trim()}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          <ul className="space-y-3">
            {categories.map(cat => (
              <li key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-800">{cat.name}</span>
                <button
                  onClick={() => setCategoryToDelete(cat.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Category"
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {categoryToDelete && (
        <Modal
          title="Delete Category"
          message="Are you sure you want to delete this category? This is only possible if no prompts are using it. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setCategoryToDelete(null)}
          confirmText="Delete"
        />
      )}
    </>
  );
};

export default CategoriesListPage;
