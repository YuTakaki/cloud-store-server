import mongoose from "mongoose";
import { fileSchema, fileType } from "./Files";

export type userSchemaTypes = {
  firstName: string
  lastName : string
  username : string
  email : string
  password : string
  bio : string,
  files?: fileType[]
}
const Schema = mongoose.Schema;

const userSchema = new Schema<userSchemaTypes>({
  firstName : {
    type: String,
    required: true
  },
  lastName : {
    type: String,
    required: true
  },
  username : {
    type: String,
    required: true,
    unique: true,
  },
  email : {
    type: String,
    required: true,
    unique: true
  },
  password : {
    type: String,
    required: true
  },
  files : [fileSchema]
}, {timestamps: true})

const user = mongoose.model('user', userSchema);

export default user;