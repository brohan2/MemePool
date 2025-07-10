// import usermodel from "../models/User"
import mememodel from '../models/MemeModel.js'
const getAllMeme = async (req, res) => {
  try {
    const user = req.user;

    const allmemes = await mememodel
      .find().sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('likes', 'username');

    return res.status(200).json({ data: allmemes });
  } catch (e) {
    return res.status(500).json({ message: 'fail', error: e.message });
  }
};

export default getAllMeme