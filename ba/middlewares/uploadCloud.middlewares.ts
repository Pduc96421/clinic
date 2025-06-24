import { Express, Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

declare module "express-serve-static-core" {
  interface Request {
    file?: Express.Multer.File;
  }
}

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
// end cloudinary

let streamUpload = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      (error: any, result: any) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const upload = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const uploadToCloudinary = async (buffer: Buffer) => {
      const result: any = await streamUpload(buffer);
      req.body[req.file.fieldname] = result.url;
      next();
    };

    uploadToCloudinary(req.file.buffer);
  } else {
    next();
  }
};
