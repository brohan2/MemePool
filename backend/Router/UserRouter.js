// routes/meme.js
import express from 'express';
import signUp from '../controller/signUp.js'
import login from '../controller/login.js'
import authminfy from '../minfyauth/authminfy.js';

const urouter = express.Router();

urouter.post('/signup', authminfy,signUp);
urouter.post('/login', authminfy,login)

export default urouter;