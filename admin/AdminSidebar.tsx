
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CubeIcon, DashboardIcon, SparklesIcon, TagIcon } from '../components/icons/Icons';

const AdminSidebar: React.FC = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 text-gray-200 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-blue-900' : 'hover:bg-blue-700'
    }`;

  return (
    <div className="w-64 bg-primary text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-blue-700">
        <Link to="/admin" className="flex items-center space-x-2">
            <CubeIcon className="w-8 h-8"/>
            <span className="text-2xl font-bold">PromptHub</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4">
        <NavLink to="/admin/dashboard" className={navLinkClass}>
          <DashboardIcon className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/prompts" className={navLinkClass}>
          <SparklesIcon className="w-5 h-5 mr-3" />
          Prompts
        </NavLink>
        <NavLink to="/admin/categories" className={navLinkClass}>
          <TagIcon className="w-5 h-5 mr-3" />
          Categories
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
