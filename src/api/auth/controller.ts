import e, { Request, Response, Router } from "express";
import { AuthManager } from "./manager";
import bcrypt from "bcrypt";
import { BaseController } from "../common/controller";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../middlewares/verifyToken";

export class AuthController implements BaseController{
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
    router.get('/verify', verifyToken, this.verify)

    return router;
  }

  private register = async(req : Request, res : Response) => {
    try {

      type error = {
        username? : string,
        email?: string
      }

      const errors : error = {}
      const {
        password,
        username,
        email
      } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const userByUsername = await this.manager.findUser(username);
      const userByEmail = await this.manager.findUser(email);

      if (userByUsername) {
        errors.username = "username already exist"
      }

      if (userByEmail) {
        errors.email = "email already exist"
      }

      if (Object.keys(errors).length === 0) {
        const saved_user = await this.manager.saveUser({
          ...req.body,
          password: hash
        });
        
        const user = await this.manager.findUser(saved_user.username);
  
        const token = generateToken(saved_user.id);
        return res.cookie("token", token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        }).send({
          user,
          token,
        })
      } else {
        return res.status(400).send(errors)
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send(error)
    }
  }

  public verify = async(req: Request, res: Response) => {
    try {
      const { user } = res.locals;
      const _user = await this.manager.findUserbyId(user);
      if (!_user) {
        res.sendStatus(401)
      } else {
        res.send(_user);
      }

      
    } catch (error) {
      console.log(error);
      res.sendStatus(401)
      
    }
  }

  public login = async(req : Request, res : Response) => {
    try {
      const {
        usernameOrEmail,
        password
      } = req.body;
      const user = await this.manager.findUser(usernameOrEmail);
      console.log(user);
      if (user != null) {
        const verifyPassword = await bcrypt.compare(password, user.password);
        if (verifyPassword) {
          const token = generateToken(user.id);
          return res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          }).send({
            user,
            token
          })
        }
        return res.status(401).send({
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