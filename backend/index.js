import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mrouter from './Router/MemeRouter.js';
import urouter from './Router/UserRouter.js'
import cors from 'cors';
import authminfy from './minfyauth/authminfy.js';
import auth from './authentication/auth.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/meme', mrouter);
app.use('/api/verify',urouter)
app.get('/test',(req,res)=>{
        res.send("TEST")
})
await connectDB()
app.get('/test',(req,res)=>{
  res.send("TEST WORKING")
})
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

