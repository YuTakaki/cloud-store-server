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
    router.post("/register", this.register);
    router.post("/login", this.login);

    return router;
  }

  private register = async(req : Request, res : Response) => {
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

  public login = async(req : Request, res : Response) => {
    try {
      const {
        usernameOrEmail,
        password
      } = req.body;
      const user = await this.manager.findUser(usernameOrEmail);
      if (user != null) {
        const verifyPassword = await bcrypt.compare(password, user.password);
        return verifyPassword ? res.send(user) : res.status(401).send({
          error : "wrong password"
        });
      }
      return res.status(404).send({
        error : "user does not exist"
      })
    } catch (error) {
      console.log(error);
    }
  }
}