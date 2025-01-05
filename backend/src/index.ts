import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { DBconnection } from './config/db'; 
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import friendRoutes from './routes/friendRoutes';



const app =express();


app.use(cors({  origin: 'https://friend-recommendation-app.vercel.app',}
  
)); 
app.use(express.json())


DBconnection();

//routes



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);


const PORT = process.env.port || 5000;
app.listen(PORT,()=>{
    console.log(`server connected on port ${PORT}`)
})