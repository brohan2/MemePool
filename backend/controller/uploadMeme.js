import Meme from '../models/MemeModel.js';
import imagekit from '../cloudinary/cloudConfig.js'; // ✅ your ImageKit SDK config
import dotenv from 'dotenv';

dotenv.config();

const uploadMeme = async (req, res) => {
  try {
    const { id } = req.user;
    const caption = req.body.caption;

    if (!id) {
      return res.status(400).json({ error: 'Author (user ID) is required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = [];
    console.log(imagekit);
    for (const file of req.files) {
      const result = await imagekit.upload({
        file: file.buffer, // Buffer directly from multer.memoryStorage()
        fileName: `meme-${Date.now()}`,
        folder: '/memes',
        useUniqueFileName: true,
      });

      imageUrls.push(result.url);
    }

    const newMeme = new Meme({
      author: id,
      meme: imageUrls,
      caption,
    });

    await newMeme.save();

    res.status(201).json({
      message: 'Memes uploaded successfully',
      data: newMeme,
    });

  } catch (error) {
    console.error('Upload error:', error.message || error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message || 'Unknown error',
    });
  }
};

export default uploadMeme;




// import Meme from '../models/MemeModel.js';
// import axios from 'axios';
// import FormData from 'form-data';
// import dotenv from 'dotenv';
// import imagekit from '../cloudinary/cloudConfig.js'; // Assuming you have an imagekit config file

// dotenv.config();

// const uploadMeme = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const caption = req.body.caption;

//     if (!id) {
//       return res.status(400).json({ error: 'Author (user ID) is required' });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: 'No files uploaded' });
//     }

//     const imageUrls = [];
//     console.log(imagekit)
//     for (const file of req.files) {
//       const form = new FormData();
//       form.append('file', file.buffer, {
//         filename: file.originalname,
//         contentType: file.mimetype,
//       });
//       form.append('fileName', `meme-${Date.now()}`);
//       form.append('folder', '/memes');
//       form.append('useUniqueFileName', 'true');

//       const auth = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64');

//       const response = await axios.post(
//         'https://upload.imagekit.io/api/v1/files/upload',
//         form,
//         {
//           headers: {
//             ...form.getHeaders(),
//             Authorization: `Basic ${auth}`,
//           },
//         }
//       );

//       imageUrls.push(response.data.url);
//     }

//     const newMeme = new Meme({
//       author: id,
//       meme: imageUrls,
//       caption,
//     });

//     await newMeme.save();

//     res.status(201).json({
//       message: 'Memes uploaded successfully',
//       data: newMeme,
//     });

//   } catch (error) {
//     console.error('Upload error:', error?.response?.data || error.message);
//     res.status(500).json({
//       error: 'Upload failed',
//       details: error?.response?.data?.message || error.message,
//     });
//   }
// };

// export default uploadMeme;



