//Native Modules
import fs from "fs";
import path from "path";

//Third Party Modules
import express,{ Request, Response, NextFunction } from "express";
import multer from "multer";

//Custom Modules
import parseFileName from "./util/parseFileName.js";
import validateFileMW from "./middleware/validateFileMW.js";

//Config
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
  filename: (_, file, cb) => cb(null, `full${parseFileName(file.originalname).ext}`)
  ,
});

const upload = multer({ storage });

app.post(
  "/upload",
  upload.single("file"),
  validateFileMW,
  async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;
    console.log(file);
    res.send("File uploaded successfully");
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
