
import React from 'react';
import { usePrompts } from '../context/PromptContext';
import { SparklesIcon, TagIcon } from '../components/icons/Icons';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 text-primary p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
  const { prompts, categories } = usePrompts();
  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Prompts" value={prompts.length} icon={<SparklesIcon className="w-6 h-6"/>} />
            <StatCard title="Total Categories" value={categories.length} icon={<TagIcon className="w-6 h-6"/>} />
        </div>
    </div>
  );
};

export default DashboardPage;
