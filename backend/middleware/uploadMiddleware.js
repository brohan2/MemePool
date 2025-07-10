// middleware/uploadMiddleware.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinary/cloudConfig.js';

let upload;
try {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'memes',
      allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });
  console.log("Storage Configured:");
  console.log(storage);
  upload = multer({ storage });
  console.log(upload);
} catch (err) {
  console.error('Error configuring multer/cloudinary storage:', err);
  upload = (req, res, next) => {
    res.status(500).json({ error: 'File upload service unavailable.' });
  };
}
export default upload;
