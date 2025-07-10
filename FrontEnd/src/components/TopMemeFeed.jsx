
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MemeCard from './MemeCard';

const TopMemeFeed = () => {
  const { memes, isDarkMode, user } = useAppContext();

  // Sort memes by likes (descending), then by createdAt (newest first for tie-breaker)
  const sorted = [...memes]
    .sort((a, b) => {
      if ((b.likes || 0) !== (a.likes || 0)) return (b.likes || 0) - (a.likes || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 3);

  if (sorted.length === 0) return null;

  return (
    <div className={`rounded-lg p-2 mb-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h2 className={`text-sm font-semibold mb-2 text-center tracking-wide ${isDarkMode ? 'text-purple-300' : 'text-blue-700'}`}>Top Memes</h2>
      <div className={`flex flex-col md:flex-row gap-4 justify-center items-stretch rounded-xl ${isDarkMode ? 'bg-gray-900/80' : 'bg-blue-50'} pb-6 pt-2`}>
        {sorted.map((meme, idx) => {
          const isOwnMeme = user && meme.uploaderId === user.id;
          return (
            <div key={meme._id || meme.id} className="relative flex-1 flex flex-col items-center max-w-xs md:mx-2 mb-3 md:mb-0">
              {/* Rank badge with animation */}
              <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs z-10 shadow-md animate-bounce ${
                idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : 'bg-orange-400 text-orange-900'
              }`}>
                {idx + 1}
              </div>
              {/* Eye-catching glow for top memes */}
              <div className={`w-full pt-4`}>
                <div
                  className={`rounded-lg ${
                    idx === 0 ? 'ring-4 ring-yellow-300/60' : idx === 1 ? 'ring-2 ring-gray-300/50' : 'ring-2 ring-orange-300/50'
                  } transition-all duration-300`}
                  style={{
                    boxShadow:
                      idx === 0
                        ? '0 0 16px 4px #fde04788'
                        : idx === 1
                        ? '0 0 10px 2px #d1d5db88'
                        : idx === 2
                        ? '0 0 10px 2px #fdba7488'
                        : undefined
                  }}
                >
                  <MemeCard meme={meme} hideLikeButton={isOwnMeme} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopMemeFeed;