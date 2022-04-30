import mongoose from 'mongoose';
import { App } from './app';
import dotenv from 'dotenv';

dotenv.config();

(async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('connected to database');

    const app = new App();
    app.startApp();

  } catch (error) {
    console.log(error);
  }

})()