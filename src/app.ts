import express, { Application } from "express";

export class App {
  private app : Application
  private port : string | number
  constructor(){
    this.app = express()
    this.port = process.env.PORT || 3000
  }

  public async startApp(){
    this.app.listen(this.port, () => {
      console.log(`listening to port ${this.port}`)
    })
  }
}