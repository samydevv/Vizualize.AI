import { Request, Response, NextFunction } from "express";

export default(req: Request, res: Response, next: NextFunction) => {
  if (!req.file || !req.file.filename) {
    return res.status(400).send("Please upload a file");
  }
  next();
};