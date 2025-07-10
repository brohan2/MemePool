// config/imagekit.js
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, // e.g., https://ik.imagekit.io/your_imagekit_id
});

export default imagekit;
