
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoutIcon } from '../components/icons/Icons';

const AdminHeader: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
      </div>
      <div className="flex items-center">
        <span className="text-gray-600 mr-4">Welcome, Admin!</span>
        <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
            <LogoutIcon className="w-4 h-4 mr-2" />
            Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
