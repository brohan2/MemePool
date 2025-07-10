import z from 'zod'
import jwt from 'jsonwebtoken'
import { password } from 'bun'
import usermodel from '../models/User.js'
import bcrypt from 'bcrypt'

const loginValidate = z.object({
    email: z.string().email("Invlid email"),
    password:z.string().min(8,"Password is too short")
})


const login = async (req,res)=>{
   try{ const {email,password} = req.body
    const validate = loginValidate.safeParse({email,password})
    if(!validate.success){
       return res.status(400).json({error:"Input format error"})
    }
    const user = await usermodel.findOne({email})
    if(!user){
        return res.status(400).json({error:"User not found signUp"})
    }
    const matchPassword = await bcrypt.compare(password,user.password)
    if(!matchPassword){
        return res.status(400).json({error:"Invalid creds"})
    }
    const token = jwt.sign(
        {id:user._id,
        email:user.email,
        username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    return res.status(200).json({
        message:"Login success",
        token
    })
}catch(e){
        res.status(500).json({error:"Internal Server error"})
        console.log(e)
    }
}
export default login