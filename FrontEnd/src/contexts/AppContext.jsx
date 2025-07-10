import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

const AppContext = createContext(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [memes, setMemes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme and check for existing session
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check for existing session
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Invalid JWT Token", e);
      return {};
    }
  }

 const login = async (email, password) => {
  // setIsLoading(true);

  try {
    // console.log(`${import.meta.env.VITE_API_BASE_URL}`)
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    // console.log(data);

    if (!res.ok) {
      // console.log(data.error);
      // setIsLoading(false)
      return { success: false, message: data.error || 'Login failed' };
    }

    const token = data.token;
    const userInfo = parseJwt(token);

    const newUser = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
      createdAt: new Date()
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    // setIsLoading(false);
    return { success: true };

  } catch (err) {
    console.error('Login error:', err.message);
    setIsLoading(false);
    return { success: false, message: err.message || 'Something went wrong' }; 
  }
};


  const signup = async (username, email, password) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmpassword: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      // Extract and format error messages from backend response
      let errorMsg = 'Signup failed';
      // Check for Zod error structure in both message and errors fields
      const extractZodErrors = (obj) => {
        if (!obj) return [];
        let errors = [];
        if (obj.formErrors && Array.isArray(obj.formErrors)) {
          errors = errors.concat(obj.formErrors);
        }
        if (obj.fieldErrors && typeof obj.fieldErrors === 'object') {
          errors = errors.concat(
            Object.values(obj.fieldErrors).flat()
          );
        }
        return errors;
      };

      let allErrors = [];
      if (data && typeof data.message === 'object') {
        allErrors = allErrors.concat(extractZodErrors(data.message));
      }
      if (data && typeof data.errors === 'object') {
        allErrors = allErrors.concat(extractZodErrors(data.errors));
      }
      // Remove duplicates
      allErrors = [...new Set(allErrors)];
      if (allErrors.length > 0) {
        errorMsg = allErrors.join(' | ');
      } else if (data && typeof data.message === 'string') {
        errorMsg = data.message;
      } else if (data && data.error) {
        errorMsg = data.error;
      }
      console.log('Signup error:', errorMsg);
      return { success: false, message: errorMsg };
    }

    const token = data.token;
    const userInfo = parseJwt(token); // Decode token

    const newUser = {
      id: userInfo.id,
      username: userInfo.username || username,
      email: userInfo.email,
      avatar: `https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100`,
      createdAt: new Date()
    };

    localStorage.setItem('token', token); // Store JWT
    localStorage.setItem('user', JSON.stringify(newUser));

    setUser(newUser);

    return { success: true };
  } catch (err) {
    console.error('Signup error:', err.message);
    return { success: false, message: err.message || 'Something went wrong' };
  }
};

  const logout = () => {
    setUser(null);
    setMemes([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addMeme = (memeData) => {
    if (!user) return;
    
    const newMeme = {
      ...memeData,
      id: Date.now().toString(),
      uploaderId: user.id,
      likes: 0,
      likedBy: [],
      createdAt: new Date(),
    };
    // Don't add to memes array since we filter out user's own memes from feed
    // setMemes(prev => [newMeme, ...prev]);
  };

  const updateMeme = (memeId, updates) => {
    if (!user) return;
    
    setMemes(prev => prev.map(meme => {
      if (meme.id === memeId && meme.uploaderId === user.id) {
        return { ...meme, ...updates };
      }
      return meme;
    }));
  };

const deleteMeme = async (memeId) => {
  if (!user) return;

  try {
   const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meme/delete/${memeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // assuming JWT token
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (res.ok) {
      // Frontend state update
      setMemes(prev => prev.filter(meme => meme.id !== memeId));
      // console.log(data.message); // optional: toast or alert
    } else {
      console.error(data.error || data.Message);
      // Optional: toast.error(data.error || data.Message);
    }
  } catch (err) {
    console.error("Error deleting meme:", err);
    // Optional: toast.error("Something went wrong");
  }
};


    const likeMeme = async (memeId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      // console.log("Token being sent:", user.token);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/meme/likes/${memeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to like/unlike meme');

      // Update likes count in state
      setMemes(prev =>
        prev.map(meme =>
          meme._id === memeId
            ? { ...meme, likes: data.totalLikes }
            : meme
        )
      );

      // Return the updated likes count for optimistic updates
      return data.totalLikes;
    } catch (err) {
      console.error("Like/unlike failed:", err.message);
      throw err; // Re-throw to handle in component
    }
  };

  const fetchMemes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/meme/getmeme`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const rawMemes = response.data.data;
      const processedMemes = rawMemes.map(meme => ({
        _id: meme._id,
        imageUrl: meme.meme?.[0] || '',
        caption: meme.caption || '',
        uploader: meme.author?.username || 'Unknown',
        uploaderId: meme.author?._id || '',
        likes: Array.isArray(meme.likes) ? meme.likes.length : 0,
        likesArray:meme.likes,
        createdAt: meme.createdAt
      }));

      // Do not filter out current user's memes
      setMemes(processedMemes);
    } catch (err) {
      console.error('Failed to fetch memes:', err);
    }
  };

  // Separate function to fetch user's own memes for profile page
  const fetchUserMemes = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/meme/getmeme`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const rawMemes = response.data.data;
      const processedMemes = rawMemes.map(meme => ({
        _id: meme._id,
        id: meme._id, // Add id for compatibility
        imageUrl: meme.meme?.[0] || '',
        caption: meme.caption || '',
        uploader: meme.author?.username || 'Unknown',
        uploaderId: meme.author?._id || '',
        likes: Array.isArray(meme.likes) ? meme.likes.length : 0,
        createdAt: meme.createdAt
      }));

      // Return only current user's memes
      return processedMemes.filter(meme => meme.uploaderId === userId);
    } catch (err) {
      console.error('Failed to fetch user memes:', err);
      return [];
    }
  };


  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      memes,
      addMeme,
      updateMeme,
      deleteMeme,
      likeMeme,
      isDarkMode,
      toggleTheme,
      login,
      signup,
      logout,
      fetchMemes,
      fetchUserMemes
    }}>
      {children}
    </AppContext.Provider>
  );
};