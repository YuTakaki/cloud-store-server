import express, { Application } from 'express';
import mongoose from 'mongoose';
import { App } from './app';

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