import z from 'zod'
import usermodel from '../models/User.js'
import { email } from 'zod/v4'
import { password } from 'bun'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const signUpValidation = z.object({
    username : z.string().min(3,"Username should be minimum 3 characters").max(10,"Username should be maximum 8 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"User name only contains letter,number,and userscores"),
    email: z.string().email("Invalid email address"),
    password:z.string().min(6,"Password should be minimum 6 characters").max(64,"Password should be maximum 64 characters")
    .regex(/[A-Z]/,"Password should contain atleast one uppercase letter")
    .regex(/[a-z]/,"Password should contain atleast 1 lowercase")
    .regex(/[0-9]/,"Password should contain atleast one number")
    .regex(/[^a-zA-Z0-9]/,"Password should contain atleast one special character"),
    confirmpassword:z.string()
}).refine((data)=>data.password===data.confirmpassword,{
    path:["confirmpassword"],
    error:"Passwords do not match"
})
const signUp = async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;

    const verifyUser = signUpValidation.safeParse({ username, email, password, confirmpassword });

    if (!verifyUser.success) {
      return res.status(403).json({
        message: verifyUser.error.flatten(),
        errors: verifyUser.error.flatten()
      });
    }


    const existingUser = await usermodel.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new usermodel({
      username,
      email,
      password: hashpassword
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      message: "User registered successfully",
      token
    });

  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default signUp