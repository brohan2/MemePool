import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Upload, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const UploadPage = () => {
  const { user, addMeme, isDarkMode } = useAppContext();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const previewRef = useRef(null);

  // File input handler with validation
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file type and size (max 10MB)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Only PNG, JPG, and GIF files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    };
    reader.readAsDataURL(file);
  }, []);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    setIsLoading(true);
    setSuccessMessage('');

    const formData = new FormData();
    if (imageFile) {
      formData.append('memes', imageFile);
    }
    formData.append('caption', caption);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meme/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccessMessage('🎉 Meme uploaded successfully! Check your Profile Section for your memes');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      addMeme({
        imageUrl: data.data?.meme?.[0],
        caption: data.data?.caption,
        uploader: user.username,
      });

      // Reset form after upload
      setImageFile(null);
      setCaption('');
      setPreviewUrl('');

      // Wait before navigating to feed
      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err.message);
      alert(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/feed')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>
        <h1 className={`text-2xl font-bold transition-colors duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Upload New Meme
        </h1>
        <div className="w-24"></div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl text-center font-semibold text-green-700 bg-green-100 border border-green-300 transition-all duration-500">
          {successMessage}
        </div>
      )}

      {/* Upload Form */}
      <div className={`rounded-2xl p-8 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800/80 border border-gray-700' 
          : 'bg-white/80 border border-gray-200'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className={`block text-lg font-semibold mb-4 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Choose Image File
            </label>
            <div className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 hover:border-opacity-80 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700/50 hover:border-purple-500' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-500'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <ImageIcon className={`w-16 h-16 mx-auto mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg font-medium mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className={`text-sm transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Image Preview & Caption Side by Side */}
          {previewUrl && (
            <div ref={previewRef} className="flex flex-row gap-6 items-start">
              <div className="flex-1">
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Preview
                </label>
                <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden max-w-md mx-auto">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={() => setPreviewUrl('')}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className={`block text-lg font-semibold mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Caption 
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a funny caption..."
                  rows={8}
                  className={`w-full px-4 py-4 rounded-xl border text-lg transition-all duration-300 focus:ring-2 focus:outline-none resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Hide the original Caption Input below */}
          {!previewUrl && (
            <div>
              <label className={`block text-lg font-semibold mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Caption 
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a funny caption..."
                rows={4}
                className={`w-full px-4 py-4 rounded-xl border text-lg transition-all duration-300 focus:ring-2 focus:outline-none resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !imageFile}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Upload className="w-6 h-6" />
                <span>Upload Meme</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
