import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Upload, Image as ImageIcon, Link, ArrowLeft } from 'lucide-react';

const UploadPage = () => {
  const { user, addMeme, isDarkMode } = useAppContext();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!imageFile && !imageUrl.trim()) || !user) return;

    setIsLoading(true);

    const formData = new FormData();

    if (uploadMethod === 'file' && imageFile) {
      formData.append('memes', imageFile); // 'memes' should match the multer field name
    } else if (uploadMethod === 'url' && imageUrl) {
      formData.append('imageUrl', imageUrl); // optional if backend supports direct URL upload
    }

    formData.append('caption', caption);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meme/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // JWT auth header
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Optional: add to global state
      addMeme({
        imageUrl: data.data?.meme?.[0],
        caption: data.data?.caption,
        uploader: user.username,
      });

      // Navigate back to feed
      navigate('/feed');
    } catch (err) {
      console.error('Upload error:', err.message);
      alert(err.message);
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
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Upload Form */}
      <div className={`rounded-2xl p-8 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800/80 border border-gray-700' 
          : 'bg-white/80 border border-gray-200'
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Method Toggle */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                setUploadMethod('file');
                setImageUrl('');
                setPreviewUrl('');
              }}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                uploadMethod === 'file'
                  ? isDarkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload File</span>
            </button>
            {/* <button
              type="button"
              onClick={() => {
                setUploadMethod('url');
                setImageFile(null);
                setPreviewUrl('');
              }}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                uploadMethod === 'url'
                  ? isDarkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Link className="w-5 h-5" />
              <span>Image URL</span>
            </button> */}
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
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
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div>
              <label className={`block text-lg font-semibold mb-4 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/meme.jpg"
                className={`w-full px-4 py-4 rounded-xl border text-lg transition-all duration-300 focus:ring-2 focus:outline-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div>
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
          )}

          {/* Caption Input */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!imageFile && !imageUrl.trim())}
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
