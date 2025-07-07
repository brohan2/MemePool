import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import {
  Smile,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const SignupPage = () => {
  const { signup, isDarkMode } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLocalLoading(true);
    try {
      const { success, message,error } = await signup(
        formData.username,
        formData.email,
        formData.password
      );

      setLocalLoading(false);

      if (success) {
        navigate('/feed');
      } else {
        setError(error || 'Signup failed');
      }
    } catch (err) {
      setLocalLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
            isDarkMode ? 'bg-purple-600' : 'bg-blue-400'
          } blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
            isDarkMode ? 'bg-pink-600' : 'bg-pink-400'
          } blur-3xl animate-pulse`}
        ></div>
      </div>

      {/* Container with image and form */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 px-4">
        {/* 👈 Left Image */}
        <img
          src={error ? 'meme2.jpeg' : 'meme4.jpg'}
          alt="Signup visual"
          className="hidden md:block w-full h-72 object-cover rounded-xl shadow-lg transition-all duration-300"
        />

        {/* Form Container */}
        <div
          className={`max-w-md w-full p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
            isDarkMode
              ? 'bg-gray-800/80 border-gray-700 shadow-2xl shadow-purple-500/20'
              : 'bg-white/80 border-white/50 shadow-2xl shadow-blue-500/20'
          }`}
        >
          {/* Back Button */}
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 mb-6 text-sm font-medium hover:scale-105 ${
              isDarkMode
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-purple-600' : 'bg-blue-500'
              }`}
            >
              <Smile className="w-8 h-8 text-white" />
            </div>
            <h1
              className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Join MemeShare
            </h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Create an account to start sharing
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                isDarkMode
                  ? 'bg-red-900/50 border border-red-700'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-red-300' : 'text-red-700'
                }`}
              >
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              icon={User}
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              type="text"
              isDarkMode={isDarkMode}
            />
            <InputField
              icon={Mail}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              type="email"
              isDarkMode={isDarkMode}
            />
            <InputField
              icon={Lock}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              isDarkMode={isDarkMode}
              toggle={() => setShowPassword(!showPassword)}
              showToggle={true}
              show={showPassword}
            />
            <InputField
              icon={Lock}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              isDarkMode={isDarkMode}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              showToggle={true}
              show={showConfirmPassword}
            />

            <button
              type="submit"
              disabled={localLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white hover:scale-105 disabled:opacity-50 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/30'
              }`}
            >
              {localLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Already have an account?
              <Link
                to="/login"
                className={`ml-2 font-semibold ${
                  isDarkMode
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// InputField component
const InputField = ({
  icon: Icon,
  name,
  type,
  value,
  onChange,
  placeholder,
  isDarkMode,
  toggle,
  showToggle,
  show
}) => (
  <div className="relative">
    <Icon
      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}
    />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:outline-none ${
        isDarkMode
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20'
          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
      }`}
      required
    />
    {showToggle && (
      <button
        type="button"
        onClick={toggle}
        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${
          isDarkMode
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {show ? (
          <EyeOff className="w-4 h-4 pointer-events-none" />
        ) : (
          <Eye className="w-4 h-4 pointer-events-none" />
        )}
      </button>
    )}
  </div>
);

export default SignupPage;
