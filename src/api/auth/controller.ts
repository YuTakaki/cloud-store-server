import { Request, Response, Router } from "express";
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
      const {
        password
      } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt)

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
      
    } catch (error) {
      console.log(error);
      return res.send(error)
    }
  }

  public verify = async(req: Request, res: Response) => {
    try {
      const { user_id } = res.locals;
      const user = await this.manager.findUserbyId(user_id);
      if (!user) {
        res.sendStatus(401)
      } else {
        res.send(user);
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