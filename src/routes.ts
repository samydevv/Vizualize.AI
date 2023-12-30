//Native Modules
import fs, { promises as fsPromise } from "fs";
import path from "path";

//Custom Modules
import validateFileMW from "./middleware/validateFileMW.js";
import { MediaType } from "./types/MediaType.js";
import prepareFileDetails from "./util/prepareFileDetails.js";
import compressImage from "./util/compressImage.js";
import parseFileName from "./util/parseFileName.js";

//Third Party Modules
import multer from "multer";
import dotenv from "dotenv";
import Replicate from "replicate";
import { Express, Request, Response, NextFunction } from "express";

//dotenv config
dotenv.config();

//replicate config
const MODEL_1 =
  "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
const MODEL_2 =
  "pollinations/adampi:80e17332327fac3769729b546a1a856af0e1e7a769a392dbf2dd152bad95d44c";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

//multer config
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

export default (app: Express) => {
  app.post(
    "/upload",
    upload.single("file"),
    validateFileMW,
    async (req: Request, res: Response, next: NextFunction) => {
      const { file } = req;
      const modelNumber = req.query.model;

      // prepare file details like full filepath, compressed filepath and extension
      const { fullFilepath, compressedFilePath, ext } =
        prepareFileDetails(file);

      // Compress the image
      compressImage(fullFilepath, compressedFilePath, 50, ext as MediaType)
        .then(async () => {
          // Read the file into a buffer
          const data = await fsPromise.readFile(compressedFilePath);

          // Convert the buffer into a base64-encoded string
          const base64 = data.toString("base64");

          // Set MIME type for PNG image
          const mimeType = `image/${ext}`;

          // Create the data URI
          const dataURI = `data:${mimeType};base64,${base64}`;

          // prepare the input data to the model
          const input = {
            image: dataURI,
          };

          let output: any;
          if (modelNumber === "1") {
            output = await replicate.run(MODEL_1, { input });
          } else if (modelNumber === "2") {
            output = await replicate.run(MODEL_2, { input });
          }

          // send the output to the client
          res.send(output);
        })
        .catch((err) => {
          return res
            .status(415)
            .send("Failed to compress unsupported image type");
        });
    }
  );
};
