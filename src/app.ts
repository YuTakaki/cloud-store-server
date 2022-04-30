import express, { Application } from "express";
import {AuthRouter} from "./routes/auth";

export class App {
  private app : Application
  private port : string | number
  constructor(){
    this.app = express()
    this.port = process.env.PORT || 3000
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
      express.urlencoded({extended: true})
    ]

    middlewares.forEach((_middleware) => this.app.use(_middleware))
  }

  private useRouters(){
    const routers = [
      new AuthRouter(),
    ];

    routers.forEach(_route => this.app.use(`/api/${_route.route_path}`, _route.route));

  }


}