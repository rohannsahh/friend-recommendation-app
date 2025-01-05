import User from "../models/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware';
import { Router } from "express";

const router=Router();
const secret = process.env.JWT_SECRET || ''

router.post('/signup', async (req,res)=>{
    try {
        const {username , email,password,interests} = req.body;
        let user =await User.findOne({email});
        if(user ){
            return res.status(400).json({message: 'user already exists please login'})
        }
        const hashedPassword = await bcrypt.hash(password , 10);
         user = new User({username , email,password:hashedPassword,interests})  ;
        await user.save(); 
        res.status(201).json({message: 'user registered successfully', user});
    } catch (error) {
        res.status(500).json({message:'error registering user' , error})
    }
});



router.post('/login', async (req,res)=>{
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user){res.status(400).json({message:'user not exist'})};
        if(user){
          const isMatch = await bcrypt.compare(password, user.password)
          if(!isMatch){ return res.status(400).json({message:'invalid credentials'})}
      
          const token = jwt.sign({userId: user._id}, secret ,{
              expiresIn: '24h'
          })
          res.status(200).json({token, userId: user._id});
        }
    } catch (error) {
        res.status(500).json({message:'error logging in',error});
    }
 
}) 

router.get('/protectedroute',authMiddleware, async (req, res) => {
    return  res.status(200).json({ message: 'Access granted' });
 
 });


export default router;