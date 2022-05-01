import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import upload from "../../middlewares/upload";
import verifyToken from "../../middlewares/verifyToken";
import { BaseController } from "../common/controller";
import { Manager } from "../common/manager";

export class UploadController extends BaseController {
  public route_path: string = "upload";
  public manager: Manager | undefined;
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

    route.post('/', verifyToken, this.uploadFiles);
    route.get('/:filename',this.getSingleImage);
    route.delete('/:id', this.deleteImage);

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

  public getSingleImage = async (req: Request, res: Response) => {
    try {
      await this.gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (err) {
      res.status(500).send(err);
    }
  };
  
  public deleteImage = async (req: Request, res: Response) => {
    try {
      await this.gfs.delete(new mongoose.Types.ObjectId(req.params.id));
      res.status(200).send("File has been deleted.");
    } catch (err) {
      res.status(500).send(err);
    }
  };
}