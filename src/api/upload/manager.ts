import { Manager } from "../common/manager";
import user, { userSchemaTypes } from "../../models/Users";
import mongoose from "mongoose";
import { fileType } from "../../models/Files";

export class UploadManager implements Manager {
  private user : mongoose.Model<userSchemaTypes>

  constructor(){
    this.user = user;
  }

  public addFilesToUser = async(user: string, file : fileType[]) => {
    return this.user.updateOne({_id: user}, {$push: {files : file }})
  }

}