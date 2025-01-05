import mongoose from "mongoose";

export const DBconnection = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Database connected');
    } catch (error) {
      console.error('Error occurred connecting to database', error);
    }
  };
