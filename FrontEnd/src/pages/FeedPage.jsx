import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MemeFeed from '../components/MemeFeed';

const FeedPage = () => {
  const { fetchMemes } = useAppContext();

  useEffect(() => {
    fetchMemes();
  }, []); // Add fetchMemes to dependency array

  return <MemeFeed />;
};

export default FeedPage;