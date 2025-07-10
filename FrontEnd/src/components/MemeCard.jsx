import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Heart, User, Clock, X } from 'lucide-react';

const MemeCard = ({ meme }) => {
  const { user, likeMeme, isDarkMode } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(meme.likes || 0);
  const [showModal, setShowModal] = useState(false);
  const [captionTruncated, setCaptionTruncated] = useState(false);
  const captionRef = useRef(null);

  // ✅ Determine if current user has already liked
  const [hasLiked, setHasLiked] = useState(() =>
    user && meme.likesArray ? meme.likesArray.some(likedUser => likedUser._id === user.id) : false
  );

  // Check if caption is truncated
  useEffect(() => {
    if (captionRef.current && meme.caption) {
      const element = captionRef.current;
      setCaptionTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [meme.caption]);

  // Update hasLiked when user or meme changes
  useEffect(() => {
    if (user && meme.likesArray) {
      setHasLiked(meme.likesArray.some(likedUser => likedUser._id === user.id));
    } else {
      setHasLiked(false);
    }
  }, [user, meme.likesArray]);

  // ESC key handler for closing modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    setLikeAnimation(true);

    const originalLikes = currentLikes;
    const originalLiked = hasLiked;

    try {
      // Optimistic update
      setCurrentLikes(prev => originalLiked ? prev - 1 : prev + 1);
      setHasLiked(!originalLiked);

      // Call backend to like/unlike
      const updatedLikes = await likeMeme(meme._id);
      if (typeof updatedLikes === 'number') {
        setCurrentLikes(updatedLikes);
        // Update hasLiked based on the actual backend response
        // If likes increased from original, user liked; if decreased, user unliked
        const userLiked = updatedLikes > originalLikes;
        setHasLiked(userLiked);
      }
    } catch (error) {
      console.error('Error liking meme:', error);
      setCurrentLikes(originalLikes);
      setHasLiked(originalLiked);
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
      setTimeout(() => setLikeAnimation(false), 600);
    }
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleReadMoreClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className={`group rounded-lg overflow-hidden w-full max-w-sm mx-auto text-sm transition-all duration-300 hover:scale-[1.015] hover:-translate-y-1 ${
          isDarkMode
            ? 'bg-gray-700 shadow-md shadow-gray-900/40 hover:shadow-xl hover:shadow-purple-500/20'
            : 'bg-white shadow-md shadow-gray-200/40 hover:shadow-xl hover:shadow-blue-500/20'
        }`}
      >
        {/* Image - Fixed aspect ratio - Now clickable */}
        <div 
          className="relative aspect-[4/5] p-1 bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
          title="Click to view full image"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-6 h-6 border-2 rounded-full animate-spin ${
                  isDarkMode
                    ? 'border-purple-600 border-t-transparent'
                    : 'border-blue-500 border-t-transparent'
                }`}
              />
            </div>
          )}
          <img
            src={meme.imageUrl}
            alt={meme.caption}
            className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Like ping animation */}
          {likeAnimation && hasLiked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-14 h-14 text-red-500 animate-ping" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Caption & Footer - Fixed height */}
        <div className="p-3 h-24 flex flex-col justify-between">
          {meme.caption && (
            <div className="mb-2 flex-1">
              <p
                ref={captionRef}
                className={`text-sm line-clamp-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {meme.caption}
              </p>
              {captionTruncated && (
                <button
                  onClick={handleReadMoreClick}
                  className={`text-xs mt-1 font-medium hover:underline ${
                    isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-600'
                  }`}
                >
                  Read more
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span
                  className={`font-medium truncate max-w-20 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {meme.uploader}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatTimeAgo(meme.createdAt)}
                </span>
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={!user || isLiking}
              title={!user ? 'Please login to like memes' : hasLiked ? 'Unlike this meme' : 'Like this meme'}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiking ? 'animate-pulse' : ''}`}
                fill={hasLiked ? 'red' : 'none'}
                stroke={hasLiked ? 'red' : (isDarkMode ? '#D1D5DB' : '#4B5563')}
              />
              <span className="text-sm font-medium">{currentLikes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className={`relative max-w-2xl max-h-[90vh] w-full rounded-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Close button */}
            <button
              onClick={handleModalClose}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal content */}
            <div className="flex flex-col max-h-[90vh]">
              {/* Image */}
              <div className="relative flex-1 min-h-0 bg-gray-100 dark:bg-gray-700 p-4">
                <img
                  src={meme.imageUrl}
                  alt={meme.caption}
                  className="w-full h-full object-contain max-h-[60vh]"
                />
              </div>

              {/* Caption and details */}
              <div className="p-6 max-h-[30vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {meme.uploader}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimeAgo(meme.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Like button in modal */}
                  <button
                    onClick={handleLike}
                    disabled={!user || isLiking}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-red-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiking ? 'animate-pulse' : ''}`}
                      fill={hasLiked ? 'red' : 'none'}
                      stroke={hasLiked ? 'red' : (isDarkMode ? '#D1D5DB' : '#4B5563')}
                    />
                    <span className="font-medium">{currentLikes}</span>
                  </button>
                </div>

                {/* Full caption */}
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {meme.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCard;