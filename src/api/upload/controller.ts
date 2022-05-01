import { Request, Response, Router } from "express";
import upload from "../../middlewares/upload";
import unlinkFile from "../../utils/unlinkFile";
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

    route.post('/', upload.array('files'), this.uploadFiles);

    return route;
  }

  public uploadFiles = async(req: Request, res: Response) => {
    try {
      const files = req.files;
      if (Array.isArray(files)) {
        files.forEach(_file => {
          unlinkFile(_file.path)
        })
      }

      res.send(files);
      
    } catch (error) {
      console.log(error);
    }

  }
  
}