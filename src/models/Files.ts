import mongoose from "mongoose";

export type fileType = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  id: string
  filename: string
  metadata: null | any,
  bucketName: string,
  chunkSize: number
  size: number
  uploadDate: string
  contentType: string
}

const Schema = mongoose.Schema;

export const fileSchema = new Schema<fileType>({
  fieldname: {
    type: String,
  },
  originalname: {
    type: String,
  },
  encoding: {
    type: String,
  },
  mimetype: {
    type: String,
  },
  id: {
    type: String,
  },
  filename: {
    type: String,
  },
  metadata: {
    type: String,
  },
  bucketName: {
    type: String,
  },
  chunkSize: {
    type: Number,
  },
  size: {
    type: Number,
  },
  uploadDate: {
    type: String,
  },
  contentType: {
    type: String,
  },
});

const file = mongoose.model("file", fileSchema)
export default file;