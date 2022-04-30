import { Router } from "express";
import authController from "../controllers/authController";

export class AuthRouter{
  public route_path = "auth"
  public route : Router

  constructor(){
    this.route = this.startRouter()
  }

  public startRouter(){
    const router = Router();
    router.get("/", authController.sample);

    return router;

  }
}