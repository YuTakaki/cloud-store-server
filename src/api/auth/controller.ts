import { Request, Response, Router } from "express";
import { AuthManager } from "./manager";
import bcrypt from "bcrypt";

export class AuthController{
  public route_path = "auth"
  public route : Router
  public manager : AuthManager

  constructor(){
    this.route = this.startRouter();
    this.manager = new AuthManager();
  }

  public startRouter(){
    const router = Router();
    router.get("/register", this.register);

    return router;
  }

  private register = async(req : Request, res : Response) => {
    //find the user
    //if not create
    try {
      const {
        username,
        password
      } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt)

      const user = await this.manager.saveUser({
        ...req.body,
        password: hash
      });
      console.log(user)
      res.send(user)
      
    } catch (error) {
      console.log(error);
      res.send(error)
    }

  }
}