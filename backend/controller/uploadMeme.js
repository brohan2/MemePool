// routes/meme.js
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import Meme from '../models/MemeModel.js';

const uploadMeme = async (req, res) => {
  try {
    const {id} = req.user;
    const ucaption = req.body.caption;
    console.log("User ID:", id);
    console.log("Caption:", ucaption);
    if (!id) {
      return res.status(400).json({ error: 'Author (user ID) is required' });
    }
    console.log("Files received:", req.files);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => file.path);
    console.log("Image",imageUrls) 
    // Cloudinary URLs
    if(!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ error: 'No valid image URLs found' });
    }
    const newMeme = new Meme({
      author:id,
      meme: imageUrls,
      caption:ucaption
    });
    console.log("New Meme Data:", newMeme);
    await newMeme.save();
    console.log("Meme saved successfully:", newMeme);
    return res.status(201).json({
      message: 'Memes uploaded successfully',
      data: newMeme
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};

export default uploadMeme;
