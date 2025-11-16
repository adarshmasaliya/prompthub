import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CubeIcon, UserCircleIcon, SparklesIcon } from './icons/Icons';

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 text-gray-600 hover:text-primary font-medium transition-colors ${isActive ? 'text-primary' : ''}`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors">
              <CubeIcon className="w-8 h-8" />
              <span className="text-2xl font-bold">PromptHub</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/generate" className={navLinkClass}>
              <SparklesIcon className="w-5 h-5" />
              <span>Generate Image</span>
            </NavLink>
            <Link to="/login" title="Admin Login" className="text-gray-500 hover:text-primary transition-colors">
              <UserCircleIcon className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;