//Native Modules
import fs from "fs";
import path from "path";

//Third Party Modules
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import Replicate from "replicate";
import dotenv from "dotenv";

//Custom Modules
import parseFileName from "./util/parseFileName.js";
import validateFileMW from "./middleware/validateFileMW.js";
import { MediaType } from "./types/MediaType.js";
import prepareFileDetails from "./util/prepareFileDetails.js";
import compressImage from "./util/compressImage.js";

//Config
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    const { base } = parseFileName(file.originalname);
    fs.promises
      .mkdir(path.join("uploads", base), { recursive: true })
      .then(() => cb(null, `uploads/${base}`))
      .catch((err) => cb(err, ""));
  },
  filename: (_, file, cb) =>
    cb(null, `full${parseFileName(file.originalname).ext}`),
});

const upload = multer({ storage });

//replicate config
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

//routes
app.post(
  "/upload",
  upload.single("file"),
  validateFileMW,
  async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;
    if (file) {
      const { fullFilepath, compressedFilePath, ext } =
        prepareFileDetails(file);
      // res.on("finish", async() => await compressImage(fullFilepath, compressedFilePath, 50, ext as MediaType));
      async () =>
        await compressImage(
          fullFilepath,
          compressedFilePath,
          50,
          ext as MediaType
        );
      res.send("File uploaded successfully");
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
