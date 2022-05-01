import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import upload from "../../middlewares/upload";
import unlinkFile from "../../utils/unlinkFile";
import { BaseController } from "../common/controller";
import { Manager } from "../common/manager";

export class UploadController extends BaseController {
  public route_path: string = "upload";
  // public manager: Manager | undefined;
  public route: Router;
  public gfs : any

  constructor(){
    super();
    this.route = this.startRouter();
    const conn = mongoose.connection;
    conn.once("open", () => {
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "files",
      });
    });
  }

  public startRouter(): Router {
    const route = Router();

    route.post('/', upload, this.uploadFiles);

    return route;
  }

  public uploadFiles = async(req: Request, res: Response) => {
    try {
      const files = req.files;
      res.send(files);
      
    } catch (error) {
      console.log(error);
    }

  }
  
}