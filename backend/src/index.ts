import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { DBconnection } from './config/db'; 
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';



const app =express();


app.use(cors()); 
app.use(express.json())


DBconnection();

//routes



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.port || 5000;
app.listen(PORT,()=>{
    console.log(`server connected on port ${PORT}`)
})