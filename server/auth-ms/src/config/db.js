import mongoose from 'mongoose';

import { MONGO_URI } from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`[AuthMS] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[AuthMS] MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
