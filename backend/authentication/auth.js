import usermodel from "../models/User.js";
import jwt from 'jsonwebtoken'
const auth = async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decoded.id).select('-password');
    if(!user){
        return res.status(401).json("User not found, login again")
    }
    req.user = {"id":user._id,"email":user.email,"username":user.username}

    next();


}catch(e){
    console.log(e)
    return res.status(500).json({message:"Auth failed"})
    }
    }
export default auth;
