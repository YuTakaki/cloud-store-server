import { Request } from "express";
import multer from "multer";
import dotenv from "dotenv"
import { GridFsStorage } from "multer-gridfs-storage";

dotenv.config();

const storage = new GridFsStorage({
	url: process.env.MONGODB_URI!,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	file: (req : Request, file : any) => {
		return {
			bucketName: "files",
			filename: `${Date.now()}${file.originalname}`,
		};
	},
});

const uploadFiles = multer({ storage }).array("files");
export default uploadFiles