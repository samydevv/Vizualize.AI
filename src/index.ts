import fs from "fs";
import path from "path";

import express, { Request, Response, NextFunction } from "express";
import multer from "multer";

const app = express();
const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
