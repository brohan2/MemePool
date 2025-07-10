import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Smile, Upload, Moon, Sun, User, LogOut, Settings, Home } from 'lucide-react';

const Header = () => {
  const { user, isDarkMode, toggleTheme, logout } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isDarkMode ? 'bg-purple-600' : 'bg-blue-500'
            }`}>
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                MemeShare
              </h1>
              <p className={`text-xs transition-colors duration-500 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Spread Smile, Happy Memeing
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/feed"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                location.pathname === '/feed'
                  ? isDarkMode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Feed</span>
            </Link>
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Upload Button */}
            <Link
              to="/upload"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Meme</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className={`hidden sm:block text-sm font-medium transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}>
                  {user?.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-300 ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="w-4 h-4 text-white" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-300 ${
                        isDarkMode 
                          ? 'text-red-400 hover:bg-gray-700' 
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;