import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './models/user';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"
dotenv.config();

const app =express();

const secret = process.env.JWT_SECRET || ''

app.use(cors()); 
app.use(express.json())


const DBconnection =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('database connected');
    } catch (error) {
        console.error("error occured connecting to database", error)
    }
}
DBconnection();

//routes
app.post('/api/signup', async (req,res)=>{
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


// // Middleware to check if the request has a valid token
// function authenticateToken(req:any, res:any , next:any) {
//   const token = req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded; // Save user data from token to request object
//     next(); // Proceed to the next middleware/route handler
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid token' });
//   }
// }

// // Protected route using the middleware
// app.get('/api/dashboard', authenticateToken, (req, res) => {
//   res.json({ message: 'Welcome to the dashboard'});
// });


app.get('/api/protectedroute', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        // Token is valid, proceed with your logic
        res.status(200).json({ message: 'Access granted' });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});

app.post('/api/login', async (req,res)=>{
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user){res.status(400).json({message:'user not exist'})};
        if(user){
          const isMatch = await bcrypt.compare(password, user.password)
          if(!isMatch){ return res.status(400).json({message:'invalid credentials'})}
      
          const token = jwt.sign({userId: user._id}, secret ,{
              expiresIn: '1h'
          })
          res.status(200).json({token, userId: user._id});
        }
    } catch (error) {
        res.status(500).json({message:'error logging in',error});
    }
 
})

const PORT = process.env.port || 5000;
app.listen(PORT,()=>{
    console.log(`server connected on port ${PORT}`)
})