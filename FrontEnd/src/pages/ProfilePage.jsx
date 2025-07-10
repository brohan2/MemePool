import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Edit3, Trash2, Calendar, Heart, ImageIcon, User } from 'lucide-react';
import EditMemeModal from '../components/EditMemeModel';

const ProfilePage = () => {
  const { user, deleteMeme, isDarkMode, fetchUserMemes } = useAppContext();
  const [editingMeme, setEditingMeme] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [userMemes, setUserMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's own memes when component mounts
  useEffect(() => {
    const loadUserMemes = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const memes = await fetchUserMemes(user.id);
          setUserMemes(memes);
        } catch (error) {
          console.error('Failed to load user memes:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserMemes();
  }, []);

  const handleDeleteMeme = (memeId) => {
    // Remove from local state
    setUserMemes(prev => prev.filter(meme => meme.id !== memeId));
    deleteMeme(memeId);
    setShowDeleteConfirm(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 border-2 rounded-full animate-spin ${
            isDarkMode 
              ? 'border-purple-600 border-t-transparent' 
              : 'border-blue-500 border-t-transparent'
          }`}></div>
          <span className={`text-sm font-medium transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Loading your memes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Info */}
      <div className={`rounded-2xl p-8 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800/80 border border-gray-700' 
          : 'bg-white/80 border border-gray-200'
      }`}>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <h2 className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {user?.username}
            </h2>
            <p className={`text-sm mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {user?.email}
            </p>
            <div className={`flex items-center space-x-4 text-sm transition-colors duration-500 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ImageIcon className="w-4 h-4" />
                <span>{userMemes.length} memes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{userMemes.reduce((total, meme) => total + meme.likes, 0)} total likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Memes */}
      <div className={`rounded-2xl p-6 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gray-800/80 border border-gray-700' 
          : 'bg-white/80 border border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-6 transition-colors duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          My Memes ({userMemes.length})
        </h3>

        {userMemes.length === 0 ? (
          <div className={`text-center py-12 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-semibold mb-2">No memes yet!</h4>
            <p>Upload your first meme to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMemes.map((meme) => (
              <div
                key={meme.id || meme._id}
                className={`group rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                  isDarkMode 
                    ? 'bg-gray-700 shadow-lg shadow-gray-900/50 hover:shadow-2xl hover:shadow-purple-500/20' 
                    : 'bg-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/20'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <img
                    src={meme.imageUrl}
                    alt={meme.caption}
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                   
                    <button
                      onClick={() => setShowDeleteConfirm(meme.id || meme._id)}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 transform hover:scale-110"
                      title="Delete meme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {meme.caption && (
                    <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {meme.caption}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className={`flex items-center space-x-1 transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Heart className="w-4 h-4" />
                      <span>{meme.likes} likes</span>
                    </div>
                    <span className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatDate(meme.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Meme Modal */}
      {editingMeme && (
        <EditMemeModal
          meme={editingMeme}
          isOpen={!!editingMeme}
          onClose={() => setEditingMeme(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="p-6">
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Delete Meme
                </h3>
                <p className={`text-sm mb-6 transition-colors duration-500 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Are you sure you want to delete this meme? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteMeme(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;