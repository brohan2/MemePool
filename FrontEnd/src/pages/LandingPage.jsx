import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Smile, ArrowRight, Star, Users, Share2 } from 'lucide-react';

const LandingPage = () => {
  const { isDarkMode } = useAppContext();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-purple-600' : 'bg-blue-400'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-pink-600' : 'bg-pink-400'
        } blur-3xl animate-pulse`}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isDarkMode ? 'bg-purple-600' : 'bg-blue-500'
            }`}>
              <Smile className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              MemeShare
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              Get Started
            </Link>
          </div>
        </header>

 {/* Hero Section */}
<div className="flex-1 flex items-center justify-center px-6">
  <div className="max-w-2xl mx-auto text-center">
    

    {/* Image container with relative position */}
 <div className="relative inline-block">
  <img 
    src="image.png"
    alt="Hero Meme" 
    className="w-64 sm:w-80 md:w-96 rounded-xl shadow-xl" // ← Reduced width
  />

  {/* Button overlay (unchanged) */}
  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 rotate-[-15deg] flex space-x-10 p-16">
    <Link
      to="/signup"
      className={`ml-4 w-24 h-24 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-110 ${
        isDarkMode 
          ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-400/30' 
          : 'border shadow-red-400/30'
      }`}
    />
    <Link
      to="/login"
      className={`mr-4 w-24 h-24 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-110 ${
        isDarkMode 
          ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-400/30' 
          : 'border shadow-red-400/30'
      }`}
    />
  </div>
</div>

  </div>
</div>
      </div>
    </div>
  );
};

export default LandingPage;