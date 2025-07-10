import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Smile, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, X } from 'lucide-react';

const LoginPage = () => {
  const { login, isDarkMode } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);

  const from = location.state?.from?.pathname || '/feed';

  // Handle ESC key and outside clicks for popup
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showForgotPopup) {
        setShowForgotPopup(false);
      }
    };

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowForgotPopup(false);
      }
    };

    if (showForgotPopup) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showForgotPopup]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when input changes
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLocalLoading(true);
      const { success, message } = await login(formData.email, formData.password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError(message);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-purple-600' : 'bg-blue-400'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-pink-600' : 'bg-pink-400'
        } blur-3xl animate-pulse`}></div>
      </div>

      {/* Main Container */}
      <div className={`relative z-10 flex flex-col md:flex-row items-center max-w-5xl w-full mx-4 p-4 md:p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
        isDarkMode
          ? 'bg-gray-800/80 border-gray-700 shadow-2xl shadow-purple-500/20'
          : 'bg-white/80 border-white/50 shadow-2xl shadow-blue-500/20'
      }`}>
        {/* Left-side image */}
        <div className="hidden md:block md:w-1/2 p-8">
          <img
            src={error ? 'meme2.jpeg' : 'meme3.jpg'}
            alt="Login Visual"
            className="w-full h-auto rounded-xl transition-all duration-500"
          />
        </div>

        {/* Right-side form */}
        <div className="w-full md:w-1/2 p-6">
          <Link 
            to="/"
            className={`inline-flex items-center space-x-2 mb-6 text-sm font-medium transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
              isDarkMode ? 'bg-purple-600' : 'bg-blue-500'
            }`}>
              <Smile className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Welcome Back!
            </h1>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Sign in to continue sharing memes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
              <AlertCircle className="w-5 h-5 inline mr-2" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border focus:ring-2 focus:outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              {localLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?
              <Link
                to="/signup"
                className={`ml-2 font-semibold ${
                  isDarkMode 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Sign up
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setShowForgotPopup(true)}
              className={`mt-4 underline text-sm ${
                isDarkMode ? 'text-purple-300 hover:text-white' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            ref={popupRef}
            className={`w-[45vw] h-[60vh] bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center relative ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <button
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              onClick={() => setShowForgotPopup(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="forgot.jpg"
              alt="Forgot Password"
              className="object-contain w-full h-full rounded-xl"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;