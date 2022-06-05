import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import upload from "../../middlewares/upload";
import verifyToken from "../../middlewares/verifyToken";
import file, { fileType } from "../../models/Files";
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
    this.gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "files",
    });
  }

  public startRouter(): Router {
    const route = Router();

    route.post('/', verifyToken, upload, this.uploadFiles);
    route.get('/type/:type',verifyToken,this.getFiles);
    route.get('/:filename',verifyToken,this.getSingleFile);
    route.delete('/:id',verifyToken, this.deleteFile);

    return route;
  }

  public getFiles = async (req: Request, res: Response) => {
    try {
      const {
        user
      } = res.locals
      const {
        type
      } = req.params;
      const files = await this.manager.getFilesByType(type, user);
      return res.send(files.map(file => file.files));
      
    } catch (error) {
      console.log(error);
    }
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

  public getSingleFile = async (req: Request, res: Response) => {
    try {
      await this.gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  };
  
  public deleteFile = async (req: Request, res: Response) => {
    try {
      await this.gfs.delete(new mongoose.Types.ObjectId(req.params.id));
      res.status(200).send("File has been deleted.");
    } catch (err) {
      res.status(500).send(err);
    }
  };
}