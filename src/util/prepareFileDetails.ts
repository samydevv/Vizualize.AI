import path from "path";
import fs from "fs";
import parseFileName from "./parseFileName.js";

export default (file: Express.Multer.File)=>{
  const { base, ext } = parseFileName(file.originalname);
  const fullFilepath = path.join('uploads', base, `full${ext}`);
  const compressedFilePath = path.join('uploads', base, `compressed${ext}`);

  return { fullFilepath, compressedFilePath, ext };
}