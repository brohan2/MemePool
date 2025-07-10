import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MemeCard from './MemeCard';
import { ImageIcon } from 'lucide-react';

const MemeFeed = () => {
  const { memes, isDarkMode, user } = useAppContext();

  // Filter out current user's memes from the feed (additional client-side filtering)
  const feedMemes = user 
    ? memes.filter(meme => meme.uploaderId !== user.id)
    : memes;

  if (feedMemes.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 transition-colors duration-500 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No memes to show!</h3>
        <p className="text-center max-w-md">
          {user 
            ? "There are no memes from other users yet. Check back later or encourage others to share their memes!"
            : "Be the first to share a meme and get the fun started. Click the upload button to add your first meme!"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Memes Grid - 3 columns, 40% screen height */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {feedMemes.map((meme) => (
          <div
            key={meme._id || meme.id}
          >
            <MemeCard meme={meme} />
          </div>
        ))}
      </div>

      {/* End of content indicator */}
      {feedMemes.length > 0 && (
        <div className={`text-center py-8 transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p className="text-sm">You've seen all the community memes! 🎉</p>
          <p className="text-xs mt-1">Upload your own memes to contribute to the community!</p>
        </div>
      )}
    </div>
  );
};

export default MemeFeed;