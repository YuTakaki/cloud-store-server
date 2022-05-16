import express, { Application } from "express";
import { AuthController } from "./api/auth/controller";
import { UploadController } from "./api/upload/controller";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

export class App {
  private app : Application
  private port : string | number
  constructor(){
    this.app = express()
    this.port = process.env.PORT || 4000
  }

  public async startApp(){

    this.useMiddleware();
    this.useRouters();

    this.app.listen(this.port, () => {
      console.log(`listening to port ${this.port}`)
    })
  }

  private useMiddleware(){
    const middlewares = [
      express.json(),
      express.urlencoded({extended: true}),
      cors({
        credentials: true,
        origin: process.env.ORIGIN
      })
    ]

    middlewares.forEach((_middleware) => this.app.use(_middleware))
  }

  private useRouters(){
    const routers = [
      new AuthController(),
      new UploadController(),
    ];

    routers.forEach(_route => this.app.use(`/api/${_route.route_path}`, _route.route));

  }


}