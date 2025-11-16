
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Prompt, Category } from '../types';
import { initialPrompts, initialCategories } from '../data/mockData';

interface PromptContextType {
  prompts: Prompt[];
  categories: Category[];
  getPrompt: (id: string) => Prompt | undefined;
  getCategory: (id:string) => Category | undefined;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt'>) => void;
  updatePrompt: (prompt: Prompt) => void;
  deletePrompt: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const getPrompt = useCallback((id: string) => {
    return prompts.find(p => p.id === id);
  }, [prompts]);
  
  const getCategory = useCallback((id: string) => {
      return categories.find(c => c.id === id);
  }, [categories]);

  const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt'>) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: new Date().getTime().toString(),
      createdAt: new Date().toISOString(),
    };
    setPrompts(prev => [newPrompt, ...prev]);
  };

  const updatePrompt = (updatedPrompt: Prompt) => {
    setPrompts(prev => prev.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
  };

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };
  
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: category.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setCategories(prev => [...prev, newCategory]);
  };
  
  const deleteCategory = (id: string) => {
    if (prompts.some(p => p.categoryId === id)) {
        alert('Cannot delete category with active prompts.');
        return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <PromptContext.Provider value={{ prompts, categories, getPrompt, getCategory, addPrompt, updatePrompt, deletePrompt, addCategory, deleteCategory }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};
