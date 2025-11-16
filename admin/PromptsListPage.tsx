
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrompts } from '../context/PromptContext';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const PromptsListPage: React.FC = () => {
  const { prompts, deletePrompt, getCategory } = usePrompts();
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (promptToDelete) {
      deletePrompt(promptToDelete);
      setPromptToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Prompts</h1>
        <Link
          to="/admin/prompts/new"
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Prompt
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map(prompt => {
              const category = getCategory(prompt.categoryId);
              return (
                <tr key={prompt.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{prompt.title}</td>
                  <td className="px-6 py-4">{category?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{new Date(prompt.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-3">
                      <Link to={`/admin/prompts/edit/${prompt.id}`} className="text-secondary hover:text-primary">
                        <EditIcon className="w-5 h-5" />
                      </Link>
                      <button onClick={() => setPromptToDelete(prompt.id)} className="text-red-600 hover:text-red-800">
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {prompts.length === 0 && (
            <p className="text-center p-8 text-gray-500">No prompts yet. Add one to get started!</p>
        )}
      </div>

      {promptToDelete && (
        <Modal
          title="Delete Prompt"
          message="Are you sure you want to delete this prompt? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setPromptToDelete(null)}
          confirmText="Delete"
        />
      )}
    </>
  );
};

export default PromptsListPage;
