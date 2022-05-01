import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import upload from "../../middlewares/upload";
import verifyToken from "../../middlewares/verifyToken";
import { fileType } from "../../models/Files";
import { BaseController } from "../common/controller";
import { Manager } from "../common/manager";
import { UploadManager } from "./manager";

export class UploadController implements BaseController {
  public route_path: string = "upload";
  public manager: UploadManager;
  public route: Router;
  public gfs : any

  constructor(){
    this.route = this.startRouter();
    this.manager = new UploadManager();
    const conn = mongoose.connection;
    conn.once("open", () => {
      this.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "files",
      });
    });
  }

  public startRouter(): Router {
    const route = Router();

    route.post('/', verifyToken, upload, this.uploadFiles);
    route.get('/:filename',verifyToken,this.getSingleImage);
    route.delete('/:id',verifyToken, this.deleteImage);

    return route;
  }

  public uploadFiles = async(req: Request, res: Response) => {
    try {
      const files : unknown= req.files;
      const x = await this.manager.addFilesToUser(res.locals.user, files as fileType[])
      res.send({
        files,
        x
      });
      
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