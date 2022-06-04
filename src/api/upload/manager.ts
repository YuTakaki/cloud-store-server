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

  public getFilesByType = async(fileType : string, user: string) => {
    return this.user.aggregate([
      {$unwind: '$files'},
      { $match:
        { $expr : { 
            $eq: [ '$_id' , { $toObjectId: user } ] 
          },
          'files.contentType' : {
            $regex : fileType === 'all' ? '' : fileType
          }
        },
      },
      {$project : {
        'files' : 1,
        '_id' : 0
      }}
    ])
  }

}