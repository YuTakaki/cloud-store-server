import { Request, Response, Router } from "express";
import { BaseController } from "../common/controller";
import { Manager } from "../common/manager";

export class UploadController extends BaseController {
  public route_path: string = "upload";
  // public manager: Manager | undefined;
  public route: Router;

  constructor(){
    super();
    this.route = this.startRouter();
  }

  public startRouter(): Router {
    const route = Router();

    return route;
  }

  public uploadFiles = async(req: Request, res: Response) => {
    try {
      
    } catch (error) {
      console.log(error);
    }

  }
  
}